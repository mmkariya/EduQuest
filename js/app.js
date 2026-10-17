
/* =========================================================
   EDUQUEST - MAIN APPLICATION
   Educational Levels, Subjects, Player Profile, XP,
   Points, Completed Quests, and Quest Unlocking
   ========================================================= */

"use strict";

(function () {
    const STORAGE_KEY = "eduquest_progress_v1";

    // -----------------------------------------------------
    // 1. EDUCATIONAL LEVELS AND SUBJECTS
    // -----------------------------------------------------

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

    window.EDUQUEST_SUBJECTS = EDUQUEST_SUBJECTS;
    window.EDUQUEST_LEVEL_LABELS = LEVEL_LABELS;

    // -----------------------------------------------------
    // 2. NORMALIZE EDUCATIONAL LEVEL
    // -----------------------------------------------------

    function normalizeLevel(value) {
        const level = String(value || "")
            .trim()
            .toLowerCase()
            .replace(/[_-]+/g, " ")
            .replace(/\s+/g, " ");

        if (
            level.includes("elementary") ||
            level.includes("grade school")
        ) {
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

    // -----------------------------------------------------
    // 3. DEFAULT PLAYER PROGRESS
    // -----------------------------------------------------

    function getDefaultProgress() {
        return {
            xp: 0,
            points: 0,
            completed: [],
            level: "elementary",
            unlockedQuests: [],
            name: "",
            title: "EduQuest Adventurer",
            avatar: "👤",
            achievements: []
        };
    }

    // -----------------------------------------------------
    // 4. LOAD AND VALIDATE SAVED PROGRESS
    // -----------------------------------------------------

    function readProgress() {
        const defaults = getDefaultProgress();

        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                return defaults;
            }

            const data = JSON.parse(saved);

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

            return {
                xp: Math.max(0, Number(data.xp) || 0),

                points: Math.max(0, Number(data.points) || 0),

                completed: [...new Set(
                    completed.filter(
                        item => typeof item === "string"
                    )
                )],

                level: normalizeLevel(
                    data.level || data.gradeLevel || "elementary"
                ),

                unlockedQuests: [...new Set(
                    unlocked.filter(
                        item => typeof item === "string"
                    )
                )],

                name: typeof data.name === "string"
                    ? data.name
                    : "",

                title: typeof data.title === "string"
                    ? data.title
                    : "EduQuest Adventurer",

                avatar: typeof data.avatar === "string"
                    ? data.avatar
                    : "👤",

                achievements: Array.isArray(data.achievements)
                    ? data.achievements
                    : []
            };
        } catch (error) {
            console.error(
                "EduQuest: Unable to load saved progress.",
                error
            );

            return defaults;
        }
    }

    // -----------------------------------------------------
    // 5. SAVE PROGRESS
    // -----------------------------------------------------

    function saveProgress(progress) {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(progress)
            );

            return true;
        } catch (error) {
            console.error(
                "EduQuest: Unable to save progress.",
                error
            );

            return false;
        }
    }

    // -----------------------------------------------------
    // 6. GET PLAYER DATA
    // -----------------------------------------------------

    window.getPlayerData = function () {
        const progress = readProgress();

        return {
            xp: progress.xp,
            points: progress.points,

            completed: [...progress.completed],
            completedQuests: [...progress.completed],

            level: progress.level,
            gradeLevel: LEVEL_LABELS[progress.level],

            unlockedQuests: [...progress.unlockedQuests],

            name: progress.name,
            title: progress.title,
            avatar: progress.avatar,

            achievements: [...progress.achievements]
        };
    };

    // -----------------------------------------------------
    // 7. SAVE PLAYER AND PROFILE DATA
    // -----------------------------------------------------

    window.savePlayerData = function (player) {
        if (!player || typeof player !== "object") {
            return false;
        }

        const progress = readProgress();

        // Preserve current values unless new values are supplied.
        if (player.xp !== undefined) {
            progress.xp = Math.max(0, Number(player.xp) || 0);
        }

        if (player.points !== undefined) {
            progress.points = Math.max(
                0,
                Number(player.points) || 0
            );
        }

        const completed = Array.isArray(player.completed)
            ? player.completed
            : player.completedQuests;

        if (Array.isArray(completed)) {
            progress.completed = [...new Set(
                completed.filter(
                    item => typeof item === "string"
                )
            )];
        }

        if (Array.isArray(player.unlockedQuests)) {
            progress.unlockedQuests = [...new Set(
                player.unlockedQuests.filter(
                    item => typeof item === "string"
                )
            )];
        }

        if (player.gradeLevel) {
            progress.level = normalizeLevel(player.gradeLevel);
        } else if (player.level) {
            progress.level = normalizeLevel(player.level);
        }

        if (typeof player.name === "string") {
            progress.name = player.name;
        }

        if (typeof player.title === "string") {
            progress.title = player.title;
        }

        if (typeof player.avatar === "string") {
            progress.avatar = player.avatar;
        }

        if (Array.isArray(player.achievements)) {
            progress.achievements = player.achievements;
        }

        const saved = saveProgress(progress);

        if (saved) {
            window.dispatchEvent(
                new CustomEvent("eduquest-data-changed")
            );
        }

        return saved;
    };

    // -----------------------------------------------------
    // 8. GET CURRENT EDUCATIONAL LEVEL
    // -----------------------------------------------------

    window.getEduQuestLevel = function () {
        return readProgress().level;
    };

    // -----------------------------------------------------
    // 9. GET SUBJECTS
    // -----------------------------------------------------

    window.getSubjectsForLevel = function (level) {
        const normalized = normalizeLevel(level);

        return [...EDUQUEST_SUBJECTS[normalized]];
    };

    window.getCurrentEduQuestSubjects = function () {
        const progress = readProgress();

        return [...EDUQUEST_SUBJECTS[progress.level]];
    };

    // -----------------------------------------------------
    // 10. CHANGE EDUCATIONAL LEVEL
    // -----------------------------------------------------

    window.setEduQuestLevel = function (level) {
        const progress = readProgress();

        progress.level = normalizeLevel(level);

        const saved = saveProgress(progress);

        if (saved) {
            window.dispatchEvent(
                new CustomEvent("eduquest-data-changed")
            );
        }

        return window.getPlayerData();
    };

    // -----------------------------------------------------
    // 11. COMPLETE A QUEST AND GIVE REWARDS
    // -----------------------------------------------------

    window.completeQuest = function (
        questId,
        xpReward = 20,
        pointsReward = 10
    ) {
        if (
            typeof questId !== "string" ||
            questId.trim() === ""
        ) {
            console.error(
                "EduQuest: A valid quest ID is required."
            );

            return false;
        }

        const progress = readProgress();
        const id = questId.trim();

        if (progress.completed.includes(id)) {
            return false;
        }

        progress.completed.push(id);

        progress.xp += Math.max(
            0,
            Number(xpReward) || 0
        );

        progress.points += Math.max(
            0,
            Number(pointsReward) || 0
        );

        const saved = saveProgress(progress);

        if (saved) {
            window.dispatchEvent(
                new CustomEvent("eduquest-data-changed")
            );
        }

        return saved;
    };

    // -----------------------------------------------------
    // 12. CHECK COMPLETED QUESTS
    // -----------------------------------------------------

    window.isQuestCompleted = function (questId) {
        return readProgress().completed.includes(
            String(questId)
        );
    };

    // -----------------------------------------------------
    // 13. QUEST UNLOCKING
    // -----------------------------------------------------

    window.unlockEduQuest = function (questId) {
        if (
            typeof questId !== "string" ||
            questId.trim() === ""
        ) {
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
            window.dispatchEvent(
                new CustomEvent("eduquest-data-changed")
            );
        }

        return saved;
    };

    window.isEduQuestUnlocked = function (questId) {
        const progress = readProgress();

        if (progress.unlockedQuests.length === 0) {
            return true;
        }

        return (
            progress.unlockedQuests.includes(String(questId)) ||
            progress.completed.includes(String(questId))
        );
    };

    // -----------------------------------------------------
    // 14. PLAYER STATISTICS
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // 15. RESET PROGRESS
    // -----------------------------------------------------

    window.resetEduQuestProgress = function () {
        const confirmed = window.confirm(
            "Reset all EduQuest XP, points, and completed quests?"
        );

        if (!confirmed) {
            return false;
        }

        const saved = saveProgress(getDefaultProgress());

        if (saved) {
            window.dispatchEvent(
                new CustomEvent("eduquest-data-changed")
            );
        }

        return saved;
    };

    // -----------------------------------------------------
    // 16. INITIALIZE
    // -----------------------------------------------------

    function initializeEduQuest() {
        const progress = readProgress();

        /*
         * Use the registered category when available.
         * Keep XP, points, and quest history unchanged.
         */
        let category = null;

        if (
            window.EduQuestAuth &&
            typeof window.EduQuestAuth.getCurrentUser === "function"
        ) {
            const user = window.EduQuestAuth.getCurrentUser();

            if (user && user.category) {
                category = user.category;
            }
        }

        if (category) {
            progress.level = normalizeLevel(category);
        }

        saveProgress(progress);

        console.log("EduQuest initialized.", {
            level: progress.level,
            subjects: EDUQUEST_SUBJECTS[progress.level],
            xp: progress.xp,
            points: progress.points,
            completedQuests: progress.completed.length
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeEduQuest,
            { once: true }
        );
    } else {
        initializeEduQuest();
    }
})();
