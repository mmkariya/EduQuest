
const LEVELS = [
    { level: 1, xp: 0 },
    { level: 2, xp: 100 },
    { level: 3, xp: 200 },
    { level: 4, xp: 300 },
    { level: 5, xp: 400 },
    { level: 6, xp: 500 },
    { level: 7, xp: 600 },
    { level: 8, xp: 700 },
    { level: 9, xp: 800 },
    { level: 10, xp: 900 }
];

const ACHIEVEMENT_INFO = [
    {
        id: "first-quest",
        name: "First Quest",
        icon: "🏅",
        description: "Complete your first quest."
    },
    {
        id: "xp-hunter",
        name: "XP Hunter",
        icon: "⭐",
        description: "Earn 100 XP."
    },
    {
        id: "rising-scholar",
        name: "Rising Scholar",
        icon: "🛡️",
        description: "Reach Level 3."
    }
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
    const defaults = defaultPlayerData();

    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return defaults;
        }

        const data = JSON.parse(saved);

        if (!data || typeof data !== "object" || Array.isArray(data)) {
            return defaults;
        }

        const player = {
            ...defaults,
            ...data,
            name: typeof data.name === "string" ? data.name : defaults.name,
            title: typeof data.title === "string" ? data.title : defaults.title,
            avatar: typeof data.avatar === "string" ? data.avatar : defaults.avatar,
            gradeLevel: typeof data.gradeLevel === "string" ? data.gradeLevel : defaults.gradeLevel,
            xp: Math.max(0, Number(data.xp) || 0),
            points: Math.max(0, Number(data.points) || 0),
            completedQuests: Array.isArray(data.completedQuests) ? data.completedQuests : [],
            achievements: Array.isArray(data.achievements) ? data.achievements : []
        };

        player.level = calculateLevel(player.xp);

        return player;
    } catch (error) {
        console.error("Error loading player data:", error);
        return defaults;
    }
}

function savePlayerData(player) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
        notifyDataChanged();
        return true;
    } catch (error) {
        console.error("Error saving player data:", error);
        showToast("Could not save player data.", "⚠️");
        return false;
    }
}

function resetPlayerData() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        updatePlayerDisplays();
        notifyDataChanged();
    } catch (error) {
        console.error("Error resetting player data:", error);
    }
}

function calculateLevel(xp) {
    let level = 1;
    const totalXP = Math.max(0, Number(xp) || 0);

    for (const entry of LEVELS) {
        if (totalXP >= entry.xp) {
            level = entry.level;
        }
    }

    return level;
}

function levelMinXp(level) {
    const entry = LEVELS.find(function (item) {
        return item.level === level;
    });

    return entry ? entry.xp : 0;
}

function nextLevelMinXp(level) {
    const entry = LEVELS.find(function (item) {
        return item.level === level + 1;
    });

    return entry ? entry.xp : null;
}

function getLevelProgress(xp) {
    const totalXP = Math.max(0, Number(xp) || 0);
    const level = calculateLevel(totalXP);
    const currentMin = levelMinXp(level);
    const nextMin = nextLevelMinXp(level);

    if (nextMin === null) {
        return {
            current: totalXP - currentMin,
            required: 0,
            percent: 100
        };
    }

    const current = totalXP - currentMin;
    const required = nextMin - currentMin;

    const percent = required > 0
        ? Math.min(100, Math.round((current / required) * 100))
        : 0;

    return {
        current: current,
        required: required,
        percent: percent
    };
}

function addXP(amount) {
    const reward = Number(amount);

    if (!Number.isFinite(reward) || reward <= 0) {
        return getPlayerData();
    }

    const player = getPlayerData();
    const oldLevel = calculateLevel(player.xp);

    player.xp += reward;
    player.level = calculateLevel(player.xp);

    if (!savePlayerData(player)) {
        return getPlayerData();
    }

    updatePlayerDisplays();

    if (player.level > oldLevel) {
        showLevelUp(oldLevel, player.level);
    }

    if (player.xp >= 100) {
        unlockAchievement("xp-hunter");
    }

    if (player.level >= 3) {
        unlockAchievement("rising-scholar");
    }

    return getPlayerData();
}

function addPoints(amount) {
    const reward = Number(amount);

    if (!Number.isFinite(reward) || reward <= 0) {
        return getPlayerData();
    }

    const player = getPlayerData();
    player.points += reward;

    if (!savePlayerData(player)) {
        return getPlayerData();
    }

    updatePlayerDisplays();

    return getPlayerData();
}

function isQuestCompleted(questId) {
    return getPlayerData().completedQuests.includes(questId);
}

function completeQuest(questId, xpReward, pointReward) {
    if (typeof questId !== "string" || !questId.trim()) {
        return false;
    }

    const player = getPlayerData();

    if (player.completedQuests.includes(questId)) {
        return false;
    }

    const quest = typeof QUESTS !== "undefined"
        ? QUESTS[questId]
        : null;

    const xp = xpReward !== undefined
        ? Number(xpReward)
        : quest
            ? Number(quest.xp)
            : 0;

    const points = pointReward !== undefined
        ? Number(pointReward)
        : quest
            ? Number(quest.points)
            : 0;

    if (
        !Number.isFinite(xp) ||
        !Number.isFinite(points) ||
        xp < 0 ||
        points < 0
    ) {
        console.error("Invalid quest rewards:", questId);
        return false;
    }

    player.completedQuests.push(questId);

    if (!savePlayerData(player)) {
        return false;
    }

    if (xp > 0) {
        addXP(xp);
    }

    if (points > 0) {
        addPoints(points);
    }

    unlockAchievement("first-quest");
    updatePlayerDisplays();

    return true;
}

function unlockAchievement(achievementId) {
    const player = getPlayerData();

    if (player.achievements.includes(achievementId)) {
        return false;
    }

    const info = ACHIEVEMENT_INFO.find(function (achievement) {
        return achievement.id === achievementId;
    });

    if (!info) {
        return false;
    }

    player.achievements.push(achievementId);

    if (!savePlayerData(player)) {
        return false;
    }

    updatePlayerDisplays();
    showToast("Achievement Unlocked: " + info.name, info.icon);

    return true;
}

function updatePlayerDisplays() {
    if (typeof document === "undefined") {
        return;
    }

    const player = getPlayerData();

    updateTextByDisplay("name", player.name);
    updateTextByDisplay("title", player.title);
    updateTextByDisplay("gradeLevel", player.gradeLevel);
    updateTextByDisplay("level", player.level);
    updateTextByDisplay("xp", player.xp);
    updateTextByDisplay("points", player.points);
    updateTextByDisplay("quests", player.completedQuests.length);
    updateTextByDisplay("achievements", player.achievements.length);

    document.querySelectorAll("[data-avatar]").forEach(function (element) {
        element.textContent = player.avatar;
    });

    document.querySelectorAll("[data-levelbadge]").forEach(function (element) {
        element.textContent = "Lv " + player.level;
    });

    const progress = getLevelProgress(player.xp);

    document.querySelectorAll("[data-xptext]").forEach(function (element) {
        if (progress.required > 0) {
            element.textContent = progress.current + " / " + progress.required + " XP";
        } else {
            element.textContent = player.xp + " XP (Max Level)";
        }
    });

    document.querySelectorAll("[data-xptonext]").forEach(function (element) {
        if (progress.required > 0) {
            element.textContent =
                (progress.required - progress.current) +
                " XP to Level " + (player.level + 1);
        } else {
            element.textContent = "Max Level reached!";
        }
    });

    document.querySelectorAll("[data-progressbar]").forEach(function (element) {
        element.style.width = progress.percent + "%";
        element.setAttribute("aria-valuenow", String(progress.percent));
    });
}

function updateTextByDisplay(key, value) {
    document.querySelectorAll('[data-display="' + key + '"]').forEach(function (element) {
        element.textContent = String(value);
    });
}

function notifyDataChanged() {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("eduquest-data-changed"));
    }
}

function showToast(message, icon) {
    if (typeof document === "undefined") {
        return;
    }

    const existing = document.querySelector(".toast-notification");

    if (existing) {
        existing.remove();
    }

    const toast = document.createElement("div");
    toast.className = "toast-notification";

    const iconElement = document.createElement("span");
    iconElement.className = "toast-icon";
    iconElement.textContent = icon || "🎉";

    const textElement = document.createElement("span");
    textElement.textContent = message;

    toast.appendChild(iconElement);
    toast.appendChild(textElement);
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

function showLevelUp(oldLevel, newLevel) {
    showToast("LEVEL UP! You reached Level " + newLevel + "!", "🎉");
}

document.addEventListener("DOMContentLoaded", function () {
    updatePlayerDisplays();
});
