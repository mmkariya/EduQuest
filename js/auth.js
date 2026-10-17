
/* =====================================================
   EDUQUEST DEMO AUTHENTICATION
   Demo only: not secure for real/public accounts.
   ===================================================== */

const AUTH_USERS_KEY = "eduquestDemoUsers";
const AUTH_SESSION_KEY = "eduquestDemoSession";

function getUsers() {
    try {
        const users = JSON.parse(
            localStorage.getItem(AUTH_USERS_KEY) || "[]"
        );

        return Array.isArray(users) ? users : [];
    } catch (error) {
        return [];
    }
}

function getCurrentUser() {
    try {
        const session = JSON.parse(
            localStorage.getItem(AUTH_SESSION_KEY) || "null"
        );

        if (!session || !session.userId) {
            return null;
        }

        const user = getUsers().find(
            item => item.id === session.userId
        );

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            category: user.category || "Elementary"
            };
    } catch (error) {
        return null;
    }
}


function registerUser(name, email, password, category) {
  const users = getUsers();

  const normalizedEmail = email.trim().toLowerCase();

  if (users.some(user => user.email.toLowerCase() === normalizedEmail)) {
    throw new Error("An account with this email already exists.");
  }

  const user = {
    id: Date.now().toString(),
    name: name.trim(),
    email: normalizedEmail,
    password: password,
    category: category,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ userId: user.id }));

  const playerKey = "eduquestPlayer_" + user.id;

  if (!localStorage.getItem(playerKey)) {
    const legacyData = localStorage.getItem("eduquestPlayer");
    let playerData;

    if (legacyData && users.length === 1) {
      // Preserve existing progress for the first account.
      try {
        playerData = JSON.parse(legacyData);
      } catch {
        playerData = null;
      }
    }

    playerData = {
      ...(playerData || {}),
      name: user.name,
      gradeLevel: category,
      xp: playerData?.xp ?? 0,
      level: playerData?.level ?? 1,
      points: playerData?.points ?? 0,
      completedQuests: playerData?.completedQuests ?? [],
      achievements: playerData?.achievements ?? []
    };

    localStorage.setItem(playerKey, JSON.stringify(playerData));
  }

  return user;

}

function loginUser(email, password) {
    email = email.trim().toLowerCase();

    const user = getUsers().find(
        item => item.email === email &&
                item.password === password
    );

    if (!user) {
        throw new Error("Incorrect email or password.");
    }

    localStorage.setItem(
        AUTH_SESSION_KEY,
        JSON.stringify({ userId: user.id })
    );

    return user;
}

function logoutUser() {
    localStorage.removeItem(AUTH_SESSION_KEY);
    window.location.href = "login.html";
}

function requireLogin() {
    if (!getCurrentUser()) {
        window.location.href = "login.html";
        return false;
    }

    return true;
}

window.EduQuestAuth = {
    getCurrentUser,
    registerUser,
    loginUser,
    logoutUser,
    requireLogin
};
