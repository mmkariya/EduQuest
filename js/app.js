/* =====================================================
   EDUQUEST - SHARED PLAYER STATE + ACHIEVEMENTS
   One source of truth for all pages.
   ===================================================== */

"use strict";

(function () {
    const STORAGE_KEY = "eduquest_progress_v1";
    const DEFAULT_AVATAR = "👤";
    const AVATAR_OPTIONS = new Set(["👤", "🧙", "🧑‍🚀", "🦸", "🧑‍🎓", "🧚"]);

    const EDUQUEST_SUBJECTS = {
        elementary: ["Math", "English", "Science", "History"],
        jhs: ["Math", "English", "Science", "Literature", "History"],
        shs: ["Math", "English", "Science", "Literature", "History"],
        college: ["Programming", "Algorithms", "Logic", "HTML", "CSS", "JavaScript"]
    };

    const LEVEL_LABELS = {
        elementary: "Elementary",
        jhs: "Junior High School",
        shs: "Senior High School",
        college: "College IT"
    };

    function normalizeAvatar(value) {
        const avatar = typeof value === "string" ? value.trim() : "";
        return AVATAR_OPTIONS.has(avatar) ? avatar : DEFAULT_AVATAR;
    }

    const ACHIEVEMENT_INFO = [
        {
            id: "first-quest",
            name: "First Quest",
            icon: "🗺️",
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
            icon: "🌟",
            description: "Reach Level 3."
        },
        {
            id: "quest-starter",
            name: "Quest Starter",
            icon: "🚀",
            description: "Complete 5 quests."
        },
        {
            id: "quest-master",
            name: "Quest Master",
            icon: "🏆",
            description: "Complete 10 quests."
        }
    ];

    window.EDUQUEST_SUBJECTS = EDUQUEST_SUBJECTS;
    window.EDUQUEST_LEVEL_LABELS = LEVEL_LABELS;
    window.ACHIEVEMENT_INFO = ACHIEVEMENT_INFO;

    function getCurrentUser() {
        return window.EduQuestAuth && typeof window.EduQuestAuth.getCurrentUser === "function"
            ? window.EduQuestAuth.getCurrentUser()
            : null;
    }

    function getProgressStorageKey() {
        const user = getCurrentUser();
        return user && user.id ? `eduquestPlayer_${user.id}` : "eduquestPlayer";
    }

    function normalizeLevel(value) {
        const level = String(value || "")
            .trim()
            .toLowerCase()
            .replace(/[_-]+/g, " ")
            .replace(/\s+/g, " ");

        if (level.includes("elementary") || level.includes("grade school")) {
            return "elementary";
        }

        if (
            level === "jhs" ||
            level.includes("jhs/shs") ||
            level.includes("junior high") ||
            level.includes("juniorhigh") ||
            level.includes("high school")
        ) {
            return "jhs";
        }

        if (
            level === "shs" ||
            level.includes("senior high") ||
            level.includes("seniorhigh")
        ) {
            return "shs";
        }

        if (
            level.includes("college") ||
            level === "it" ||
            level.includes("information technology")
        ) {
            return "college";
        }

        return "elementary";
    }

    function getLevelFromXp(xp) {
        const numericXP = Math.max(0, Number(xp) || 0);
        return Math.floor(numericXP / 100) + 1;
    }

    function getLevelProgress(xp) {
        const safeXP = Math.max(0, Number(xp) || 0);
        const level = getLevelFromXp(safeXP);
        const currentInLevel = safeXP - ((level - 1) * 100);
        const required = 100;
        const percent = Math.min(100, Math.max(0, (currentInLevel / required) * 100));

        return {
            level,
            current: currentInLevel,
            required,
            percent,
            xp: safeXP
        };
    }

    window.getLevelProgress = getLevelProgress;

    function getDefaultProgress() {
        return {
            xp: 0,
            points: 0,
            completed: [],
            completedQuests: [],
            unlockedQuests: [],
            level: "elementary",
            gradeLevel: "Elementary",
            name: "",
            title: "EduQuest Adventurer",
            avatar: DEFAULT_AVATAR,
            achievements: [],
            streak: 0,
            dailyChallenge: "math-explorer",
            rewardHistory: []
        };
    }

    function readProgress() {
        const defaults = getDefaultProgress();
        const storageKeys = [
            getProgressStorageKey(),
            STORAGE_KEY,
            "eduquestPlayer",
            "eduquest_progress_v1"
        ];

        let raw = null;

        for (const key of storageKeys) {
            if (!key) continue;
            try {
                const value = localStorage.getItem(key);
                if (value && value !== "null") {
                    raw = value;
                    break;
                }
            } catch (error) {
                continue;
            }
        }

        if (!raw) {
            return defaults;
        }

        try {
            const data = JSON.parse(raw);
            if (!data || typeof data !== "object") {
                return defaults;
            }

            const completed = Array.isArray(data.completed)
                ? data.completed
                : Array.isArray(data.completedQuests)
                    ? data.completedQuests
                    : [];

            const unlocked = Array.isArray(data.unlockedQuests)
                ? data.unlockedQuests
                : [];

            const normalizedLevel = normalizeLevel(
                data.level || data.gradeLevel || data.educationLevel || "elementary"
            );

            const player = {
                xp: Math.max(0, Number(data.xp) || 0),
                points: Math.max(0, Number(data.points) || 0),
                completed: [...new Set(completed.filter(item => typeof item === "string"))],
                completedQuests: [...new Set(completed.filter(item => typeof item === "string"))],
                unlockedQuests: [...new Set(unlocked.filter(item => typeof item === "string"))],
                level: normalizedLevel,
                gradeLevel: typeof data.gradeLevel === "string"
                    ? data.gradeLevel
                    : LEVEL_LABELS[normalizedLevel] || "Elementary",
                name: typeof data.name === "string" ? data.name : "",
                title: typeof data.title === "string" ? data.title : "EduQuest Adventurer",
                avatar: normalizeAvatar(data.avatar),
                achievements: Array.isArray(data.achievements) ? data.achievements : [],
                streak: Math.max(0, Number(data.streak) || 0),
                dailyChallenge: typeof data.dailyChallenge === "string" ? data.dailyChallenge : "math-explorer",
                rewardHistory: Array.isArray(data.rewardHistory) ? data.rewardHistory : []
            };

            return player;
        } catch (error) {
            console.error("EduQuest: Unable to load saved progress.", error);
            return defaults;
        }
    }

    function saveProgress(progress) {
        if (!progress || typeof progress !== "object") {
            return false;
        }

        const user = getCurrentUser();
        const storageKey = getProgressStorageKey();
        const payload = {
            ...progress,
            avatar: normalizeAvatar(progress.avatar),
            completed: Array.isArray(progress.completed) ? progress.completed : [],
            completedQuests: Array.isArray(progress.completedQuests) ? progress.completedQuests : progress.completed || [],
            unlockedQuests: Array.isArray(progress.unlockedQuests) ? progress.unlockedQuests : [],
            achievements: Array.isArray(progress.achievements) ? progress.achievements : [],
            gradeLevel: progress.gradeLevel || LEVEL_LABELS[progress.level] || "Elementary",
            level: progress.level || "elementary"
        };

        try {
            localStorage.setItem(storageKey, JSON.stringify(payload));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
            localStorage.setItem("eduquestPlayer", JSON.stringify(payload));
            if (user && user.id) {
                localStorage.setItem(`eduquestPlayer_${user.id}`, JSON.stringify(payload));
            }
            return true;
        } catch (error) {
            console.error("EduQuest: Unable to save progress.", error);
            return false;
        }
    }

    window.getPlayerData = function () {
        const progress = readProgress();
        const numericLevel = getLevelFromXp(progress.xp);

        return {
            xp: Math.max(0, Number(progress.xp) || 0),
            points: Math.max(0, Number(progress.points) || 0),
            completed: [...new Set((progress.completed || []).filter(item => typeof item === "string"))],
            completedQuests: [...new Set((progress.completedQuests || []).filter(item => typeof item === "string"))],
            level: numericLevel,
            gradeLevel: progress.gradeLevel || LEVEL_LABELS[progress.level] || "Elementary",
            educationLevel: progress.level,
            unlockedQuests: [...new Set((progress.unlockedQuests || []).filter(item => typeof item === "string"))],
            name: typeof progress.name === "string" && progress.name.trim() ? progress.name.trim() : "Player",
            title: typeof progress.title === "string" && progress.title.trim() ? progress.title.trim() : "EduQuest Adventurer",
            avatar: normalizeAvatar(progress.avatar),
            achievements: Array.isArray(progress.achievements) ? [...new Set(progress.achievements)] : [],
            streak: Math.max(0, Number(progress.streak) || 0),
            dailyChallenge: progress.dailyChallenge || "math-explorer",
            rewardHistory: Array.isArray(progress.rewardHistory) ? [...progress.rewardHistory] : []
        };
    };

    window.savePlayerData = function (player) {
        if (!player || typeof player !== "object") {
            return false;
        }

        const progress = readProgress();

        if (player.xp !== undefined) {
            progress.xp = Math.max(0, Number(player.xp) || 0);
        }

        if (player.points !== undefined) {
            progress.points = Math.max(0, Number(player.points) || 0);
        }

        const completed = Array.isArray(player.completed)
            ? player.completed
            : Array.isArray(player.completedQuests)
                ? player.completedQuests
                : progress.completed;

        if (Array.isArray(completed)) {
            progress.completed = [...new Set(completed.filter(item => typeof item === "string"))];
            progress.completedQuests = [...progress.completed];
        }

        if (Array.isArray(player.unlockedQuests)) {
            progress.unlockedQuests = [...new Set(player.unlockedQuests.filter(item => typeof item === "string"))];
        }

        if (player.gradeLevel) {
            progress.gradeLevel = String(player.gradeLevel);
            progress.level = normalizeLevel(player.gradeLevel);
        } else if (player.level) {
            progress.level = normalizeLevel(player.level);
        }

        if (typeof player.name === "string") {
            progress.name = player.name.trim() || "Player";
        }

        if (typeof player.title === "string") {
            progress.title = player.title.trim() || "EduQuest Adventurer";
        }

        if (typeof player.avatar === "string") {
            progress.avatar = normalizeAvatar(player.avatar);
        }

        if (Array.isArray(player.achievements)) {
            progress.achievements = [...new Set(player.achievements)];
        }

        if (player.streak !== undefined) {
            progress.streak = Math.max(0, Number(player.streak) || 0);
        }

        if (typeof player.dailyChallenge === "string") {
            progress.dailyChallenge = player.dailyChallenge;
        }

        if (Array.isArray(player.rewardHistory)) {
            progress.rewardHistory = player.rewardHistory.filter(item =>
                item && typeof item === "object" && typeof item.id === "string"
            );
        }

        const saved = saveProgress(progress);

        if (saved) {
            window.dispatchEvent(new CustomEvent("eduquest-data-changed"));
        }

        return saved;
    };

    window.getEduQuestLevel = function () {
        return readProgress().level;
    };

    window.getSubjectsForLevel = function (level) {
        const normalized = normalizeLevel(level);
        return [...EDUQUEST_SUBJECTS[normalized]];
    };

    window.getCurrentEduQuestSubjects = function () {
        const progress = readProgress();
        return [...EDUQUEST_SUBJECTS[progress.level]];
    };

    window.setEduQuestLevel = function (level) {
        const progress = readProgress();
        progress.level = normalizeLevel(level);
        progress.gradeLevel = LEVEL_LABELS[progress.level] || progress.gradeLevel || "Elementary";
        const saved = saveProgress(progress);

        if (saved) {
            window.dispatchEvent(new CustomEvent("eduquest-data-changed"));
        }

        return window.getPlayerData();
    };

    window.completeQuest = function (questId, xpReward = 20, pointsReward = 10) {
        if (typeof questId !== "string" || questId.trim() === "") {
            console.error("EduQuest: A valid quest ID is required.");
            return false;
        }

        const progress = readProgress();
        const id = questId.trim();

        if ((progress.completed || []).includes(id)) {
            return false;
        }

        progress.completed.push(id);
        progress.completedQuests = [...new Set(progress.completed)];
        progress.xp += Math.max(0, Number(xpReward) || 0);
        progress.points += Math.max(0, Number(pointsReward) || 0);

        const saved = saveProgress(progress);
        if (saved) {
            window.dispatchEvent(new CustomEvent("eduquest-data-changed"));
            window.dispatchEvent(new CustomEvent("eduquest-quest-completed"));
        }

        return saved;
    };

    window.isQuestCompleted = function (questId) {
        return readProgress().completed.includes(String(questId));
    };

    window.unlockEduQuest = function (questId) {
        if (typeof questId !== "string" || questId.trim() === "") {
            return false;
        }

        const progress = readProgress();
        const id = questId.trim();

        if (progress.unlockedQuests.includes(id)) {
            return false;
        }

        progress.unlockedQuests.push(id);
        const saved = saveProgress(progress);

        if (saved) {
            window.dispatchEvent(new CustomEvent("eduquest-data-changed"));
        }

        return saved;
    };

    window.isEduQuestUnlocked = function (questId) {
        const progress = readProgress();
        if (progress.unlockedQuests.length === 0) {
            return true;
        }

        return progress.unlockedQuests.includes(String(questId)) || progress.completed.includes(String(questId));
    };

    window.getEduQuestStats = function () {
        const progress = readProgress();
        return {
            xp: progress.xp,
            points: progress.points,
            completedCount: progress.completed.length,
            educationalLevel: progress.level,
            educationalLevelLabel: LEVEL_LABELS[progress.level],
            subjects: [...EDUQUEST_SUBJECTS[progress.level]]
        };
    };

    window.resetEduQuestProgress = function () {
        const confirmed = window.confirm("Reset all EduQuest XP, points, and completed quests?");
        if (!confirmed) {
            return false;
        }

        const defaults = getDefaultProgress();
        const saved = saveProgress(defaults);

        if (saved) {
            window.dispatchEvent(new CustomEvent("eduquest-data-changed"));
        }

        return saved;
    };

    window.updatePlayerDisplays = function () {
        const player = window.getPlayerData();
        const level = getLevelFromXp(player.xp);
        const levelProgress = getLevelProgress(player.xp);
        const neededXP = Math.max(0, 100 - levelProgress.current);

        document.querySelectorAll("[data-display='name']").forEach((el) => {
            el.textContent = player.name || "Player";
        });

        document.querySelectorAll("[data-display='title']").forEach((el) => {
            el.textContent = player.title || "EduQuest Adventurer";
        });

        document.querySelectorAll("[data-display='xp']").forEach((el) => {
            el.textContent = Number(player.xp).toLocaleString();
        });

        document.querySelectorAll("[data-display='points']").forEach((el) => {
            el.textContent = Number(player.points).toLocaleString();
        });

        document.querySelectorAll("[data-display='quests']").forEach((el) => {
            el.textContent = player.completedQuests.length;
        });

        document.querySelectorAll("[data-display='level']").forEach((el) => {
            el.textContent = level;
        });

        document.querySelectorAll("[data-display='gradeLevel']").forEach((el) => {
            el.textContent = player.gradeLevel || "Elementary";
        });

        document.querySelectorAll("[data-display='achievements']").forEach((el) => {
            el.textContent = player.achievements.length;
        });

        document.querySelectorAll("[data-levelbadge]").forEach((el) => {
            el.textContent = `Lv ${level}`;
        });

        document.querySelectorAll("[data-avatar]").forEach((el) => {
            el.textContent = player.avatar || "👤";
        });

        document.querySelectorAll("[data-progressbar]").forEach((el) => {
            const width = `${Math.max(0, Math.min(100, levelProgress.percent))}%`;
            el.style.width = width;
            el.setAttribute("aria-valuenow", String(Math.round(levelProgress.percent)));
        });

        document.querySelectorAll("[data-xptext]").forEach((el) => {
            el.textContent = `${levelProgress.current} / 100 XP`;
        });

        document.querySelectorAll("[data-xptonext]").forEach((el) => {
            el.textContent = `${neededXP} XP to Level ${level + 1}`;
        });
    };

    window.unlockAchievement = function (achievementId) {
        if (typeof achievementId !== "string" || !achievementId.trim()) {
            return false;
        }

        const player = window.getPlayerData();
        const id = achievementId.trim();

        if (player.achievements.includes(id)) {
            return false;
        }

        player.achievements.push(id);

        const saved = window.savePlayerData(player);
        if (saved) {
            window.dispatchEvent(new CustomEvent("eduquest-data-changed"));
        }

        return saved;
    };

    window.getAchievementInfo = function () {
        return [...ACHIEVEMENT_INFO];
    };

    async function syncProgressToServer() {
        const user = getCurrentUser();
        if (!user || !user.id || typeof fetch !== "function") {
            return;
        }

        const payload = readProgress();
        try {
            await fetch('/api/profile', {
                method: 'PUT',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...payload,
                    name: payload.name || user.name || 'Player',
                    category: payload.gradeLevel || user.category || 'Elementary',
                    gradeLevel: payload.gradeLevel || user.category || 'Elementary',
                    level: payload.level || normalizeLevel(payload.gradeLevel || user.category || 'Elementary')
                })
            });
        } catch (error) {
            console.warn('EduQuest: profile sync skipped.', error);
        }
    }

    async function hydrateProgressFromServer() {
        const user = getCurrentUser();
        if (!user || !user.id || typeof fetch !== "function") {
            return;
        }

        try {
            const response = await fetch('/api/profile', {
                credentials: 'same-origin'
            });
            if (!response.ok) {
                return;
            }
            const data = await response.json();
            const profile = data && data.profile ? data.profile : null;
            if (!profile) {
                return;
            }

            const merged = {
                ...readProgress(),
                ...profile,
                xp: Math.max(0, Number(profile.xp) || 0),
                points: Math.max(0, Number(profile.points) || 0),
                completed: Array.isArray(profile.completedQuests) ? profile.completedQuests : [],
                completedQuests: Array.isArray(profile.completedQuests) ? profile.completedQuests : [],
                unlockedQuests: Array.isArray(profile.unlockedQuests) ? profile.unlockedQuests : [],
                achievements: Array.isArray(profile.achievements) ? profile.achievements : [],
                gradeLevel: profile.gradeLevel || user.category || 'Elementary',
                level: normalizeLevel(profile.gradeLevel || user.category || profile.level || 'Elementary')
            };

            saveProgress(merged);
        } catch (error) {
            console.warn('EduQuest: progress hydration skipped.', error);
        }
    }

    async function initializeEduQuest() {
        if (window.EduQuestAuth && typeof window.EduQuestAuth.hydrateSession === "function") {
            await window.EduQuestAuth.hydrateSession();
        }

        const user = getCurrentUser();
        const isAuthScreen = /(?:^|\/)(login|register)\.html$/i.test(window.location.pathname);
        if (!user && !isAuthScreen) {
            window.location.replace("login.html");
            return;
        }

        await hydrateProgressFromServer();
        const progress = readProgress();

        if (!(progress.name || "").trim()) {
            const user = getCurrentUser();
            if (user && user.name) {
                progress.name = user.name;
                saveProgress(progress);
            }
        }

        window.updatePlayerDisplays();
    }

    window.addEventListener('eduquest-data-changed', function () {
        syncProgressToServer();
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeEduQuest, { once: true });
    } else {
        initializeEduQuest();
    }
})();
