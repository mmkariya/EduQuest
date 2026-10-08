const LEVELS = [
    { level: 1, xp: 0 },
    { level: 2, xp: 100 },
    { level: 3, xp: 250 },
    { level: 4, xp: 450 },
    { level: 5, xp: 700 },
    { level: 6, xp: 1000 }
];

const MAX_LEVEL = LEVELS[LEVELS.length - 1].level;



const QUESTS = {
    "math-explorer":    { name: "Math Explorer",    icon: "🧮", xp: 20, points: 10 },
    "code-apprentice":  { name: "Code Apprentice",  icon: "💻", xp: 30, points: 20 },
    "world-explorer":   { name: "World Explorer",   icon: "🌎", xp: 30, points: 20 },
    "science-master":   { name: "Science Master",   icon: "🔬", xp: 50, points: 30 }
};

const ACHIEVEMENT_INFO = [
    { id: "first-quest",     name: "First Quest",    icon: "🏅", description: "Complete your first quest." },
    { id: "xp-hunter",       name: "XP Hunter",      icon: "⭐", description: "Earn 100 XP." },
    { id: "rising-scholar",  name: "Rising Scholar", icon: "🛡️", description: "Reach Level 3." }
];

const STORAGE_KEY = "eduquestPlayer";


function defaultPlayerData() {
    return {
        name: "Player",
        title: "EduQuest Adventurer",
        avatar: "👤",
        gradeLevel: "College",
        xp: 0,
        level: 1,
        points: 0,
        completedQuests: [],
        achievements: []
    };
}

function getPlayerData() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
        try {
            const data = JSON.parse(saved);
            const defaults = defaultPlayerData();

            const player = {
                ...defaults,
                ...data,
                completedQuests: data.completedQuests || [],
                achievements: data.achievements || []
            };

            player.level = calculateLevel(player.xp);

            return player;
        } catch (error) {
            console.log("Could not read saved data, using defaults.");
            return defaultPlayerData();
        }
    }

    return defaultPlayerData();
}

function savePlayerData(player) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
    notifyDataChanged();
}
function resetPlayerData() {
    localStorage.removeItem(STORAGE_KEY);
}

function calculateLevel(xp) {
    let level = 1;

    for (const entry of LEVELS) {
        if (xp >= entry.xp) {
            level = entry.level;
        }
    }

    return level;
}


function levelMinXp(level) {
    const entry = LEVELS.find(function (e) { return e.level === level; });
    return entry ? entry.xp : 0;
}


function nextLevelMinXp(level) {
    const entry = LEVELS.find(function (e) { return e.level === level + 1; });
    return entry ? entry.xp : null;
}

function getLevelProgress(xp) {
    const level = calculateLevel(xp);
    const currentMin = levelMinXp(level);
    const nextMin = nextLevelMinXp(level);

    if (nextMin === null) {
        return { current: 0, required: 0, percent: 100 };
    }

    const current = xp - currentMin;
    const required = nextMin - currentMin;

    let percent = 0;
    if (required > 0) {
        percent = Math.min(100, Math.round((current / required) * 100));
    }

    return { current: current, required: required, percent: percent };
}


function addXP(amount) {
    const player = getPlayerData();
    const oldLevel = calculateLevel(player.xp);

    player.xp += amount;
    player.level = calculateLevel(player.xp);

    savePlayerData(player);
    updatePlayerDisplays();

    if (player.level > oldLevel) {
        showLevelUp(oldLevel, player.level);
    }

    return player;
}

function addPoints(amount) {
    const player = getPlayerData();
    player.points += amount;

    savePlayerData(player);
    updatePlayerDisplays();

    return player;
}

function isQuestCompleted(questId) {
    return getPlayerData().completedQuests.includes(questId);
}

function completeQuest(questId, xpReward, pointReward) {
    var player = getPlayerData();

    if (player.completedQuests.includes(questId)) {
        return false;
    }

    var quest = QUESTS[questId];
    var xp = (xpReward !== undefined) ? xpReward : (quest ? quest.xp : 0);
    var pts = (pointReward !== undefined) ? pointReward : (quest ? quest.points : 0);
    player.completedQuests.push(questId);
    savePlayerData(player);

    addXP(xp);
    addPoints(pts);

    return true;
}

function unlockAchievement(achievementId) {
    var player = getPlayerData();

    if (player.achievements.includes(achievementId)) {
        return false;
    }

    player.achievements.push(achievementId);
    savePlayerData(player);
    updatePlayerDisplays();
    var info = ACHIEVEMENT_INFO.find(function (a) {
        return a.id === achievementId;
    });
    showToast("Achievement Unlocked", info ? info.icon : "🏆");

    return true;
}

function updatePlayerDisplays() {
    var player = getPlayerData();

    updateTextByDisplay("name", player.name);
    updateTextByDisplay("title", player.title);
    updateTextByDisplay("avatar", player.avatar);
    updateTextByDisplay("gradeLevel", player.gradeLevel);
    updateTextByDisplay("level", player.level);
    updateTextByDisplay("xp", player.xp);
    updateTextByDisplay("points", player.points);
    updateTextByDisplay("quests", player.completedQuests.length);
    updateTextByDisplay("achievements", player.achievements.length);

    var progress = getLevelProgress(player.xp);

    document.querySelectorAll("[data-xptext]").forEach(function (el) {
        if (progress.required > 0) {
            el.textContent =
                progress.current + " / " + progress.required + " XP";
        } else {
            el.textContent = player.xp + " XP (Max Level)";
        }
    });

    document.querySelectorAll("[data-xptonext]").forEach(function (el) {
        if (progress.required > 0) {
            el.textContent =
                (progress.required - progress.current) +
                " XP to Level " + (player.level + 1);
        } else {
            el.textContent = "Max Level reached!";
        }
    });

    document.querySelectorAll("[data-progressbar]").forEach(function (el) {
        el.style.width = progress.percent + "%";
    });

    document.querySelectorAll("[data-avatar]").forEach(function (el) {
        el.textContent = player.avatar;
    });

    document.querySelectorAll("[data-levelbadge]").forEach(function (el) {
        el.textContent = "Lv " + player.level;
    });
}

function updateTextByDisplay(key, value) {
    document.querySelectorAll('[data-display="' + key + '"]').forEach(function (el) {
        el.textContent = value;
    });
}

function notifyDataChanged() {
    window.dispatchEvent(new CustomEvent("eduquest-data-changed"));
}

function showToast(message, icon) {
    var existing = document.querySelector(".toast-notification");
    if (existing) {
        existing.remove();
    }

    var toast = document.createElement("div");
    toast.className = "toast-notification";

    var iconEl = document.createElement("span");
    iconEl.className = "toast-icon";
    iconEl.textContent = icon || "🎉";

    var textEl = document.createElement("span");
    textEl.textContent = message;

    toast.appendChild(iconEl);
    toast.appendChild(textEl);

    document.body.appendChild(toast);

    requestAnimationFrame(function () {
        toast.classList.add("show");
    });

    setTimeout(function () {
        toast.classList.remove("show");
        setTimeout(function () {
            toast.remove();
        }, 400);
    }, 3500);
}


/* Show the "Level Up!" notification */
function showLevelUp(oldLevel, newLevel) {
    showToast("LEVEL UP! You reached Level " + newLevel + "!", "🎉");
}

document.addEventListener("DOMContentLoaded", function () {
    updatePlayerDisplays();
});