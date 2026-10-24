const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const webpush = require('web-push');
require('dotenv').config();

const app = express();
const PORT = Number(process.env.PORT) || 8080;
const DATA_FILE = path.join(__dirname, 'data', 'users.json');
const NOTIFICATION_DEFAULTS = Object.freeze({
  questReminders: true,
  achievementAlerts: true,
  xpAlerts: true,
  studyReminders: false,
  browserPush: false,
  studyReminderTime: '18:00'
});
const vapidConfigured = Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);

if (vapidConfigured) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname));

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

function readUsers() {
  ensureDataFile();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeUsers(users) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

function getDefaultProfile(user = {}) {
  return {
    name: user.name || 'Player',
    title: 'EduQuest Adventurer',
    avatar: '👤',
    xp: 0,
    points: 0,
    level: 'elementary',
    gradeLevel: user.category || 'Elementary',
    completedQuests: [],
    achievements: [],
    streak: 0,
    dailyChallenge: 'math-explorer',
    rewardHistory: []
  };
}

function sanitizeProfile(profile = {}, user = {}) {
  const defaults = getDefaultProfile(user);
  const completed = Array.isArray(profile.completedQuests) ? profile.completedQuests : defaults.completedQuests;
  const achievements = Array.isArray(profile.achievements) ? profile.achievements : defaults.achievements;
  const rewardHistory = Array.isArray(profile.rewardHistory) ? profile.rewardHistory : defaults.rewardHistory;

  return {
    name: String(profile.name || user.name || defaults.name || 'Player').trim(),
    title: String(profile.title || defaults.title || 'EduQuest Adventurer').trim(),
    avatar: String(profile.avatar || defaults.avatar || '👤').trim(),
    xp: Math.max(0, Number(profile.xp) || 0),
    points: Math.max(0, Number(profile.points) || 0),
    level: String(profile.level || defaults.level || 'elementary').trim(),
    gradeLevel: String(profile.gradeLevel || user.category || defaults.gradeLevel || 'Elementary').trim(),
    completedQuests: completed.filter(Boolean),
    achievements: achievements.filter(Boolean),
    streak: Math.max(0, Number(profile.streak) || 0),
    dailyChallenge: String(profile.dailyChallenge || defaults.dailyChallenge || 'math-explorer').trim(),
    rewardHistory: rewardHistory
      .filter(item => item && typeof item.id === 'string')
      .slice(-100)
      .map(item => ({
        id: item.id.slice(0, 80),
        name: String(item.name || 'Reward').slice(0, 100),
        cost: Math.max(0, Number(item.cost) || 0),
        redeemedAt: String(item.redeemedAt || '').slice(0, 40)
      }))
  };
}

function sanitizeNotificationSettings(settings = {}) {
  const source = settings && typeof settings === 'object' ? settings : {};
  const time = typeof source.studyReminderTime === 'string' &&
    /^([01]\d|2[0-3]):[0-5]\d$/.test(source.studyReminderTime)
    ? source.studyReminderTime
    : NOTIFICATION_DEFAULTS.studyReminderTime;

  return {
    ...Object.fromEntries([
      'questReminders',
      'achievementAlerts',
      'xpAlerts',
      'studyReminders',
      'browserPush'
    ].map(key => [
      key,
      typeof source[key] === 'boolean' ? source[key] : NOTIFICATION_DEFAULTS[key]
    ])),
    studyReminderTime: time
  };
}

function isValidPushSubscription(subscription) {
  if (!subscription || typeof subscription !== 'object' ||
      typeof subscription.endpoint !== 'string' ||
      typeof subscription.keys?.p256dh !== 'string' ||
      typeof subscription.keys?.auth !== 'string') {
    return false;
  }

  try {
    return new URL(subscription.endpoint).protocol === 'https:';
  } catch {
    return false;
  }
}

async function deliverNotification(user, event) {
  const settings = sanitizeNotificationSettings(user.notificationSettings);
  const eventPreference = {
    quest: 'questReminders',
    achievement: 'achievementAlerts',
    xp: 'xpAlerts',
    study: 'studyReminders'
  }[event.type];

  if (!eventPreference || !settings[eventPreference]) return;

  if (settings.browserPush && Array.isArray(user.pushSubscriptions)) {
    if (!vapidConfigured) {
      console.warn(`EduQuest: Push is enabled for ${user.email}, but VAPID is not configured.`);
    } else {
      const subscriptions = user.pushSubscriptions;
      const remaining = [];
      let removedExpiredSubscription = false;
      for (const subscription of subscriptions) {
        try {
          await webpush.sendNotification(subscription, JSON.stringify({
            title: event.title,
            body: event.body,
            url: event.url || '/progress.html',
            tag: event.tag
          }));
          remaining.push(subscription);
        } catch (error) {
          if (error.statusCode === 404 || error.statusCode === 410) {
            console.info(`EduQuest: Removed an expired push subscription for ${user.email}.`);
            removedExpiredSubscription = true;
          } else {
            remaining.push(subscription);
            console.error(`EduQuest: Push delivery failed for ${user.email}.`, error);
          }
        }
      }
      user.pushSubscriptions = remaining;
      if (removedExpiredSubscription) {
        const users = readUsers();
        const index = users.findIndex(item => item.id === user.id);
        if (index !== -1) {
          users[index].pushSubscriptions = remaining;
          writeUsers(users);
        }
      }
    }
  }

}

async function deliverNotificationSafely(user, event) {
  try {
    await deliverNotification(user, event);
  } catch (error) {
    console.error(`EduQuest: Notification delivery failed for ${user.email}.`, error);
  }
}

function getLocalReminderDate(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return {
    date: `${values.year}-${values.month}-${values.day}`,
    time: `${values.hour}:${values.minute}`
  };
}

async function sendScheduledReminders() {
  const timeZone = process.env.STUDY_REMINDER_TIMEZONE || 'Asia/Manila';
  const localTime = getLocalReminderDate(new Date(), timeZone);
  const users = readUsers();
  let changed = false;

  for (const user of users) {
    const settings = sanitizeNotificationSettings(user.notificationSettings);
    if ((!settings.studyReminders && !settings.questReminders) ||
        settings.studyReminderTime !== localTime.time) {
      continue;
    }

    user.lastReminderDates = user.lastReminderDates || {};
    if (user.lastReminderDates[localTime.date]) continue;
    user.lastReminderDates[localTime.date] = true;
    changed = true;

    const reminders = [];
    if (settings.studyReminders) {
      reminders.push({
        type: 'study',
        title: 'Time for a study session',
        body: 'Take a few minutes to continue your EduQuest learning journey.',
        url: '/quests.html',
        tag: 'daily-study-reminder'
      });
    }
    if (settings.questReminders) {
      reminders.push({
        type: 'quest',
        title: 'Your quests are waiting',
        body: 'Choose a level-appropriate quest and keep your progress moving.',
        url: '/quests.html',
        tag: 'daily-quest-reminder'
      });
    }
    for (const reminder of reminders) {
      void deliverNotificationSafely(user, reminder);
    }
  }

  if (changed) writeUsers(users);
}

function requireAuth(req, res, next) {
  const token = req.cookies && req.cookies.sessionToken;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const users = readUsers();
  const user = users.find(item => item.sessionToken === token);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.user = user;
  next();
}

app.post('/api/register', (req, res) => {
  const { name, email, password, category } = req.body || {};

  if (!name || !email || !password || !category) {
    return res.status(400).json({ message: 'Please complete all required fields.' });
  }

  const users = readUsers();
  const emailExists = users.some(user => user.email.toLowerCase() === String(email).trim().toLowerCase());
  if (emailExists) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const user = {
    id: Date.now().toString(),
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    password: String(password),
    category: String(category).trim(),
    createdAt: new Date().toISOString(),
    sessionToken: null,
    profile: getDefaultProfile({ name: String(name).trim(), category: String(category).trim() })
  };

  users.push(user);
  writeUsers(users);
  return res.status(201).json({ message: 'Account created successfully.' });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const users = readUsers();
  const user = users.find(item =>
    item.email.toLowerCase() === String(email).trim().toLowerCase() && item.password === String(password)
  );

  if (!user) {
    return res.status(401).json({ message: 'Incorrect email or password.' });
  }

  const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
  user.sessionToken = token;

  if (!user.profile) {
    user.profile = getDefaultProfile(user);
  } else {
    user.profile = sanitizeProfile(user.profile, user);
  }

  writeUsers(users);

  res.cookie('sessionToken', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false
  });

  return res.json({
    message: 'Login successful.',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      category: user.category,
      profile: user.profile
    }
  });
});

app.post('/api/logout', (req, res) => {
  const token = req.cookies && req.cookies.sessionToken;
  if (token) {
    const users = readUsers();
    const updatedUsers = users.map(user => {
      if (user.sessionToken === token) {
        return { ...user, sessionToken: null };
      }
      return user;
    });
    writeUsers(updatedUsers);
  }

  res.clearCookie('sessionToken');
  return res.json({ message: 'Logged out.' });
});

app.get('/api/me', requireAuth, (req, res) => {
  const profile = sanitizeProfile(req.user.profile || getDefaultProfile(req.user), req.user);
  req.user.profile = profile;

  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      category: req.user.category,
      profile
    }
  });
});

app.get('/api/profile', requireAuth, (req, res) => {
  const profile = sanitizeProfile(req.user.profile || getDefaultProfile(req.user), req.user);
  req.user.profile = profile;
  writeUsers(readUsers().map(user => user.id === req.user.id ? { ...user, profile } : user));
  res.json({ profile });
});

app.put('/api/profile', requireAuth, (req, res) => {
  const users = readUsers();
  const index = users.findIndex(user => user.id === req.user.id);
  if (index === -1) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const previousProfile = sanitizeProfile(
    users[index].profile || getDefaultProfile(users[index]),
    users[index]
  );
  const nextProfile = sanitizeProfile({
    ...(req.user.profile || getDefaultProfile(req.user)),
    ...(req.body || {})
  }, req.user);

  users[index].profile = nextProfile;
  if (req.body && typeof req.body.name === 'string' && req.body.name.trim()) {
    users[index].name = req.body.name.trim();
  }
  if (req.body && typeof req.body.category === 'string' && req.body.category.trim()) {
    users[index].category = req.body.category.trim();
  }

  writeUsers(users);
  const events = [];
  const completed = nextProfile.completedQuests.filter(id =>
    !previousProfile.completedQuests.includes(id)
  );
  if (completed.length) {
    events.push({
      type: 'quest',
      title: 'Quest completed!',
      body: `Great work! You completed ${completed.length} quest${completed.length === 1 ? '' : 's'} and earned progress.`,
      url: '/quests.html',
      tag: `quest-completed-${completed.length}`
    });
  }

  const newAchievements = nextProfile.achievements.filter(id =>
    !previousProfile.achievements.includes(id)
  );
  for (const achievement of newAchievements) {
    events.push({
      type: 'achievement',
      title: 'Achievement unlocked!',
      body: `Congratulations! You unlocked ${achievement.replace(/[-_]/g, ' ')}.`,
      url: '/badges.html',
      tag: `achievement-${achievement}`
    });
  }

  if (nextProfile.xp > previousProfile.xp) {
    events.push({
      type: 'xp',
      title: 'You earned XP!',
      body: `Your adventure XP is now ${nextProfile.xp}. Keep up the great work!`,
      url: '/progress.html',
      tag: 'xp-earned'
    });
  }

  if (events.length) {
    const updatedUser = users[index];
    for (const event of events) void deliverNotificationSafely(updatedUser, event);
  }

  res.json({ profile: nextProfile });
});

app.get('/api/notifications/config', requireAuth, (req, res) => {
  res.json({
    pushConfigured: vapidConfigured,
    publicKey: vapidConfigured ? process.env.VAPID_PUBLIC_KEY : null,
    settings: sanitizeNotificationSettings(req.user.notificationSettings),
    hasPushSubscription: Array.isArray(req.user.pushSubscriptions) && req.user.pushSubscriptions.length > 0
  });
});

app.put('/api/notifications/settings', requireAuth, (req, res) => {
  const users = readUsers();
  const index = users.findIndex(user => user.id === req.user.id);
  if (index === -1) return res.status(404).json({ message: 'User not found.' });

  users[index].notificationSettings = sanitizeNotificationSettings(req.body || {});
  writeUsers(users);
  res.json({ settings: users[index].notificationSettings });
});

app.post('/api/notifications/subscribe', requireAuth, (req, res) => {
  if (!vapidConfigured) {
    return res.status(503).json({ message: 'Browser push is not configured on this server.' });
  }

  const subscription = req.body && req.body.subscription;
  if (!isValidPushSubscription(subscription)) {
    return res.status(400).json({ message: 'A valid HTTPS browser push subscription is required.' });
  }

  const users = readUsers();
  const index = users.findIndex(user => user.id === req.user.id);
  if (index === -1) return res.status(404).json({ message: 'User not found.' });
  const subscriptions = Array.isArray(users[index].pushSubscriptions)
    ? users[index].pushSubscriptions
    : [];
  users[index].pushSubscriptions = [
    ...subscriptions.filter(item => item.endpoint !== subscription.endpoint),
    subscription
  ].slice(-10);
  users[index].notificationSettings = sanitizeNotificationSettings({
    ...users[index].notificationSettings,
    browserPush: true
  });
  writeUsers(users);
  res.json({ message: 'Browser push notifications enabled.' });
});

app.delete('/api/notifications/subscribe', requireAuth, (req, res) => {
  const endpoint = req.body && req.body.endpoint;
  if (typeof endpoint !== 'string') {
    return res.status(400).json({ message: 'A push subscription endpoint is required.' });
  }
  const users = readUsers();
  const index = users.findIndex(user => user.id === req.user.id);
  if (index === -1) return res.status(404).json({ message: 'User not found.' });
  users[index].pushSubscriptions = (users[index].pushSubscriptions || [])
    .filter(subscription => subscription.endpoint !== endpoint);
  users[index].notificationSettings = sanitizeNotificationSettings({
    ...users[index].notificationSettings,
    browserPush: false
  });
  writeUsers(users);
  res.json({ message: 'Browser push notifications disabled.' });
});

app.get('/api/leaderboard', (req, res) => {
  const users = readUsers();
  const leaderboard = users
    .map(user => ({
      id: user.id,
      name: user.name,
      xp: Number((user.profile && user.profile.xp) || 0),
      points: Number((user.profile && user.profile.points) || 0),
      streak: Number((user.profile && user.profile.streak) || 0),
      completedQuests: Array.isArray(user.profile && user.profile.completedQuests) ? user.profile.completedQuests.length : 0
    }))
    .sort((a, b) => b.xp - a.xp || b.streak - a.streak)
    .slice(0, 8);

  res.json({ leaderboard });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', notifications: { pushConfigured: vapidConfigured } });
});

app.get('*', (req, res) => {
  const file = path.join(__dirname, 'index.html');
  res.sendFile(file);
});

const server = app.listen(PORT, () => {
  console.log(`EduQuest server running on http://localhost:${PORT}`);
  console.log(`Notification delivery: push=${vapidConfigured ? 'configured' : 'not configured'}`);
  setInterval(() => {
    sendScheduledReminders().catch(error => {
      console.error('EduQuest: Scheduled reminder check failed.', error);
    });
  }, 60_000);
  sendScheduledReminders().catch(error => {
    console.error('EduQuest: Initial scheduled reminder check failed.', error);
  });
});

server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the other server using it, or set PORT to a free port before starting EduQuest.`);
    process.exitCode = 1;
    return;
  }

  throw error;
});
