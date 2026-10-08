<<<<<<< HEAD
=======
/* =====================================================
   EDUQUEST - CENTRAL PLAYER DATA SYSTEM (js/app.js)
   =====================================================
   This is the SHARED player-data + XP/Level system for
   the whole EduQuest team.

   Load this file FIRST on every page:

     <script src="js/app.js"></script>

   It keeps ONE player object in ONE localStorage key, so
   every page always shows the same data.

   YOUR FEATURES (Profile, XP, Level, Saved Progress) live
   here. Groupmates can use these functions from their
   quest / reward / progress code:

     getPlayerData()             -> current player object
     savePlayerData(player)      -> save changes to localStorage
     resetPlayerData()           -> clear all saved progress
     addXP(amount)               -> add XP, auto-level-up
     addPoints(amount)           -> add points
     completeQuest(questId)      -> mark done + award once (no farming)
     isQuestCompleted(questId)   -> true if already completed
     unlockAchievement(id)       -> unlock an achievement once
     getLevelProgress(xp)        -> { current, required, percent }
     updatePlayerDisplays()      -> refresh all data displays on the page

   Example from a groupmate's quest system:
     addXP(20);        // updates level, XP bar, saved data
     addPoints(10);
     completeQuest("math-explorer");
   ===================================================== */

/* ------------------------------------------
   LEVEL REQUIREMENTS
   ------------------------------------------
   EASY TO EDIT: add or change rows here.
   XP required to REACH each level.
   ------------------------------------------ */

>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
const LEVELS = [
    { level: 1, xp: 0 },
    { level: 2, xp: 100 },
    { level: 3, xp: 250 },
    { level: 4, xp: 450 },
    { level: 5, xp: 700 },
    { level: 6, xp: 1000 }
];

<<<<<<< HEAD
const MAX_LEVEL = LEVELS[LEVELS.length - 1].level;


=======
/* Highest level currently supported */
const MAX_LEVEL = LEVELS[LEVELS.length - 1].level;


/* ------------------------------------------
   QUEST REWARD DATA (shared info)
   ------------------------------------------
   Just the reward/display info for the 4 existing
   quests. Groupmates may add more quest IDs here or
   pass explicit rewards to completeQuest().
   ------------------------------------------ */
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309

const QUESTS = {
    "math-explorer":    { name: "Math Explorer",    icon: "🧮", xp: 20, points: 10 },
    "code-apprentice":  { name: "Code Apprentice",  icon: "💻", xp: 30, points: 20 },
    "world-explorer":   { name: "World Explorer",   icon: "🌎", xp: 30, points: 20 },
    "science-master":   { name: "Science Master",   icon: "🔬", xp: 50, points: 30 }
};

<<<<<<< HEAD
=======

/* ------------------------------------------
   ACHIEVEMENT DISPLAY INFO (for the Profile page)
   ------------------------------------------
   Display-only names/icons for achievements.
   The unlock LOGIC belongs to the rewards feature,
   which will call unlockAchievement(id).
   ------------------------------------------ */

>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
const ACHIEVEMENT_INFO = [
    { id: "first-quest",     name: "First Quest",    icon: "🏅", description: "Complete your first quest." },
    { id: "xp-hunter",       name: "XP Hunter",      icon: "⭐", description: "Earn 100 XP." },
    { id: "rising-scholar",  name: "Rising Scholar", icon: "🛡️", description: "Reach Level 3." }
];

<<<<<<< HEAD
const STORAGE_KEY = "eduquestPlayer";


=======

/* ------------------------------------------
   PLAYER DATA
   ------------------------------------------
   The single source of truth for the player,
   saved under ONE localStorage key.
   ------------------------------------------ */

const STORAGE_KEY = "eduquestPlayer";


/* Default player data (used on the very first visit) */
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
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

<<<<<<< HEAD
=======

/* ------------------------------------------
   LOAD / SAVE (localStorage)
   ------------------------------------------ */

/* Get the current player data.
   Returns safe defaults if nothing is saved yet. */
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
function getPlayerData() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
        try {
            const data = JSON.parse(saved);
            const defaults = defaultPlayerData();

<<<<<<< HEAD
=======
            // Make sure every field exists, even for old saves
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
            const player = {
                ...defaults,
                ...data,
                completedQuests: data.completedQuests || [],
                achievements: data.achievements || []
            };

<<<<<<< HEAD
=======
            // Level is always derived from XP, so it can never be
            // stale, missing, or out of sync with the XP value.
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
            player.level = calculateLevel(player.xp);

            return player;
        } catch (error) {
            console.log("Could not read saved data, using defaults.");
            return defaultPlayerData();
        }
    }

    return defaultPlayerData();
}

<<<<<<< HEAD
=======

/* Save the current player data to localStorage */
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
function savePlayerData(player) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
    notifyDataChanged();
}
<<<<<<< HEAD
=======


/* Delete all saved player progress */
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
function resetPlayerData() {
    localStorage.removeItem(STORAGE_KEY);
}

<<<<<<< HEAD
=======

/* ------------------------------------------
   LEVEL CALCULATIONS
   ------------------------------------------ */

/* Calculate the player's level from XP.
   The highest level whose XP requirement is met wins. */
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
function calculateLevel(xp) {
    let level = 1;

    for (const entry of LEVELS) {
        if (xp >= entry.xp) {
            level = entry.level;
        }
    }

    return level;
}


<<<<<<< HEAD
=======
/* Minimum XP needed to BE the given level */
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
function levelMinXp(level) {
    const entry = LEVELS.find(function (e) { return e.level === level; });
    return entry ? entry.xp : 0;
}


<<<<<<< HEAD
=======
/* Minimum XP needed to reach the NEXT level (or null at max) */
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
function nextLevelMinXp(level) {
    const entry = LEVELS.find(function (e) { return e.level === level + 1; });
    return entry ? entry.xp : null;
}

<<<<<<< HEAD
=======

/* Get XP progress toward the NEXT level.
   Returns:
     current  -> XP earned inside the current level range
     required -> XP total needed to reach the next level
     percent  -> 0-100 fill for the progress bar

   Example at Level 2 with 150 XP:
     current = 50, required = 150, percent = 33
   The bar knows the current level's starting XP (100)
   and the next level's requirement (250). */
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
function getLevelProgress(xp) {
    const level = calculateLevel(xp);
    const currentMin = levelMinXp(level);
    const nextMin = nextLevelMinXp(level);

<<<<<<< HEAD
=======
    // Already at the highest level: full bar
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
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


<<<<<<< HEAD
=======
/* ------------------------------------------
   ADD XP / POINTS
   ------------------------------------------ */

/* Add XP, recalculate the level, save and update the UI.
   Automatically shows a "Level Up!" notification. */
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
function addXP(amount) {
    const player = getPlayerData();
    const oldLevel = calculateLevel(player.xp);

    player.xp += amount;
    player.level = calculateLevel(player.xp);

    savePlayerData(player);
    updatePlayerDisplays();

<<<<<<< HEAD
=======
    // Small celebration message - NOT a blocking alert
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
    if (player.level > oldLevel) {
        showLevelUp(oldLevel, player.level);
    }

    return player;
}

<<<<<<< HEAD
=======

/* Add points and save */
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
function addPoints(amount) {
    const player = getPlayerData();
    player.points += amount;

    savePlayerData(player);
    updatePlayerDisplays();

    return player;
}

<<<<<<< HEAD
=======

/* ------------------------------------------
   COMPLETE QUEST (shared helper for team)
   ------------------------------------------ */

/* Check if a quest was already completed */
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
function isQuestCompleted(questId) {
    return getPlayerData().completedQuests.includes(questId);
}

<<<<<<< HEAD
function completeQuest(questId, xpReward, pointReward) {
    var player = getPlayerData();

=======

/* Mark a quest completed and award its XP + points.
   A completed quest is NEVER rewarded twice.

   Optionally pass explicit rewards:
     completeQuest("my-quest", 25, 15);   // 25 XP, 15 points
   If omitted, the reward comes from QUESTS above.
   Returns true if the reward was given. */
function completeQuest(questId, xpReward, pointReward) {
    var player = getPlayerData();

    // Guard: no double rewards
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
    if (player.completedQuests.includes(questId)) {
        return false;
    }

    var quest = QUESTS[questId];
    var xp = (xpReward !== undefined) ? xpReward : (quest ? quest.xp : 0);
    var pts = (pointReward !== undefined) ? pointReward : (quest ? quest.points : 0);
<<<<<<< HEAD
    player.completedQuests.push(questId);
    savePlayerData(player);

=======

    // Mark completed FIRST and save, so a refresh cannot re-reward
    player.completedQuests.push(questId);
    savePlayerData(player);

    // Award the rewards (also saves + updates the UI)
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
    addXP(xp);
    addPoints(pts);

    return true;
}

<<<<<<< HEAD
=======

/* ------------------------------------------
   ACHIEVEMENTS (shared helper for team)
   ------------------------------------------ */

/* Unlock an achievement (adds its id to player data).
   Never unlocks the same one twice.
   Returns true if it was newly unlocked. */
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
function unlockAchievement(achievementId) {
    var player = getPlayerData();

    if (player.achievements.includes(achievementId)) {
        return false;
    }

    player.achievements.push(achievementId);
    savePlayerData(player);
    updatePlayerDisplays();
<<<<<<< HEAD
=======

    // Celebrate using the display info above (if known)
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
    var info = ACHIEVEMENT_INFO.find(function (a) {
        return a.id === achievementId;
    });
    showToast("Achievement Unlocked", info ? info.icon : "🏆");

    return true;
}

<<<<<<< HEAD
function updatePlayerDisplays() {
    var player = getPlayerData();

=======

/* ------------------------------------------
   UPDATE PLAYER DISPLAYS
   ------------------------------------------ */

/* Refresh every player-data element on the current page.
   Works via data attributes, so any team page can use it:

     <span data-display="name">Player</span>
     <h3 data-display="level">1</h3>
     <div data-progressbar></div>            <- XP bar fill
     <p data-xptext>0 / 100 XP</p>           <- progress text
     <p data-xptonext>100 XP to Level 2</p>  <- XP needed next
     <span data-levelbadge>Lv 1</span>
     <span data-avatar>👤</span>
   */
function updatePlayerDisplays() {
    var player = getPlayerData();

    // Simple text fields
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
    updateTextByDisplay("name", player.name);
    updateTextByDisplay("title", player.title);
    updateTextByDisplay("avatar", player.avatar);
    updateTextByDisplay("gradeLevel", player.gradeLevel);
    updateTextByDisplay("level", player.level);
    updateTextByDisplay("xp", player.xp);
    updateTextByDisplay("points", player.points);
    updateTextByDisplay("quests", player.completedQuests.length);
    updateTextByDisplay("achievements", player.achievements.length);

<<<<<<< HEAD
    var progress = getLevelProgress(player.xp);

=======
    // XP progress toward the next level
    var progress = getLevelProgress(player.xp);

    // "50 / 150 XP" style text
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
    document.querySelectorAll("[data-xptext]").forEach(function (el) {
        if (progress.required > 0) {
            el.textContent =
                progress.current + " / " + progress.required + " XP";
        } else {
            el.textContent = player.xp + " XP (Max Level)";
        }
    });

<<<<<<< HEAD
=======
    // "100 XP to Level 3" style text
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
    document.querySelectorAll("[data-xptonext]").forEach(function (el) {
        if (progress.required > 0) {
            el.textContent =
                (progress.required - progress.current) +
                " XP to Level " + (player.level + 1);
        } else {
            el.textContent = "Max Level reached!";
        }
    });

<<<<<<< HEAD
=======
    // XP progress bar fill
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
    document.querySelectorAll("[data-progressbar]").forEach(function (el) {
        el.style.width = progress.percent + "%";
    });

<<<<<<< HEAD
=======
    // Avatars displayed separately
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
    document.querySelectorAll("[data-avatar]").forEach(function (el) {
        el.textContent = player.avatar;
    });

<<<<<<< HEAD
=======
    // Level badge like "Lv 3"
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
    document.querySelectorAll("[data-levelbadge]").forEach(function (el) {
        el.textContent = "Lv " + player.level;
    });
}

<<<<<<< HEAD
=======

/* Helper: set text on every element with the given
   data-display value, e.g. data-display="points". */
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
function updateTextByDisplay(key, value) {
    document.querySelectorAll('[data-display="' + key + '"]').forEach(function (el) {
        el.textContent = value;
    });
}

<<<<<<< HEAD
=======

/* Fire an event so other pages (progress, rewards, etc.)
   can refresh their own lists when data changes. */
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
function notifyDataChanged() {
    window.dispatchEvent(new CustomEvent("eduquest-data-changed"));
}

<<<<<<< HEAD
=======

/* ------------------------------------------
   NOTIFICATIONS
   ------------------------------------------ */

/* Floating toast used for level-ups and achievements.
   Not a blocking popup - disappears on its own. */
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
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

<<<<<<< HEAD
=======

/* ------------------------------------------
   INITIALIZE ON PAGE LOAD
   ------------------------------------------ */

/* Whenever a page loads, resync every display from the
   saved localStorage data. Runs on every EduQuest page. */
>>>>>>> 90aa5515246b345564a22ef80f12b226ced9f309
document.addEventListener("DOMContentLoaded", function () {
    updatePlayerDisplays();
});