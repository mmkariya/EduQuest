
/* =====================================================
   EDUQUEST - PROFILE PAGE
   Profile education level follows the logged-in account.
   ===================================================== */

(function () {
    "use strict";

    const editButton = document.getElementById("edit-profile-btn");
    const editForm = document.getElementById("edit-profile-form");
    const saveButton = document.getElementById("save-profile-btn");
    const cancelButton = document.getElementById("cancel-profile-btn");

    const nameInput = document.getElementById("name-input");
    const titleInput = document.getElementById("title-input");
    const avatarInput = document.getElementById("avatar-input");
    const gradeInput = document.getElementById("grade-input");

    function getCurrentUser() {
        return window.EduQuestAuth?.getCurrentUser?.() || null;
    }

    function getPlayer() {
        return window.getPlayerData?.() || {};
    }

    function savePlayer(player) {
        if (typeof window.savePlayerData !== "function") {
            console.error("EduQuest: savePlayerData() is missing from app.js.");
            return false;
        }

        return window.savePlayerData(player);
    }

    // Convert registration categories to consistent display labels.
    function formatCategory(category) {
        const value = String(category || "").trim().toLowerCase();

        if (value === "college (it)" || value === "college it" ||
            value === "college") {
            return "College IT";
        }

        if (value === "jhs/shs" || value === "high school" ||
            value === "junior high school" ||
            value === "senior high school") {
            return "JHS/SHS";
        }

        if (value === "elementary") {
            return "Elementary";
        }

        return category || "Elementary";
    }

    function renderAchievements() {
        const container = document.getElementById("profile-achievements");
        if (!container) return;

        const player = getPlayer();
        const achievements = Array.isArray(player.achievements)
            ? player.achievements
            : [];
        const achievementInfo = window.ACHIEVEMENT_INFO || [];

        container.innerHTML = "";

        achievementInfo.forEach(function (info) {
            const unlocked = achievements.includes(info.id);
            const slot = document.createElement("div");
            slot.className = "achievement-slot" +
                (unlocked ? "" : " locked");

            const icon = document.createElement("span");
            icon.className = "a-icon";
            icon.textContent = unlocked ? info.icon : "🔒";

            const detail = document.createElement("div");
            detail.className = "a-detail";

            const title = document.createElement("strong");
            title.textContent = info.name;

            const description = document.createElement("span");
            description.textContent = info.description;

            detail.append(title, description);
            slot.append(icon, detail);
            container.appendChild(slot);
        });

        if (achievements.length === 0) {
            const slot = document.createElement("div");
            slot.className = "achievement-slot locked";
            slot.innerHTML =
                '<span class="a-icon">🗺️</span>' +
                '<div class="a-detail">' +
                '<strong>No achievements yet</strong>' +
                '<span>Complete quests to unlock your first reward!</span>' +
                '</div>';
            container.appendChild(slot);
        }
    }

    function renderProfile() {
        const player = getPlayer();
        const user = getCurrentUser();

        // Account category takes priority over stale saved player data.
        const grade = formatCategory(player.gradeLevel || user?.category);

        const gradeElement =
            document.querySelector('[data-display="gradeLevel"]');

        if (gradeElement) {
            gradeElement.textContent = grade;
        }

        // Update other profile fields if matching elements exist.
        const nameElement = document.querySelector('[data-display="name"]');
        if (nameElement) {
            nameElement.textContent = player.name || user?.name || "";
        }

        const titleElement = document.querySelector('[data-display="title"]');
        if (titleElement) {
            titleElement.textContent =
                player.title || "EduQuest Adventurer";
        }

        const avatarElement = document.querySelector('[data-display="avatar"]');
        if (avatarElement) {
            avatarElement.textContent = player.avatar || "👤";
        }
    }

    // Open edit form.
    if (editButton && editForm) {
        editButton.addEventListener("click", function () {
            const player = getPlayer();
            const user = getCurrentUser();

            if (nameInput) {
                nameInput.value = player.name || user?.name || "";
            }

            if (titleInput) {
                titleInput.value = player.title || "EduQuest Adventurer";
            }

            if (avatarInput) {
                avatarInput.value = player.avatar || "👤";
            }

            if (gradeInput) {
                gradeInput.value = formatCategory(player.gradeLevel || user?.category);
            }

            editForm.style.display = "block";
            nameInput?.focus();
        });
    }

    // Save profile.
    if (saveButton) {
        saveButton.addEventListener("click", function () {
            const user = getCurrentUser();
            const player = getPlayer();

            const newName = nameInput?.value.trim() || "";
            const newTitle =
                titleInput?.value.trim() || "EduQuest Adventurer";
            const newAvatar = avatarInput?.value || "👤";

            const newGrade = formatCategory(
                gradeInput?.value || player.gradeLevel || user?.category
            );

            if (!newName) {
                alert("Please enter a player name.");
                nameInput?.focus();
                return;
            }

            player.name = newName;
            player.title = newTitle;
            player.avatar = newAvatar;
            player.gradeLevel = newGrade;

            if (!savePlayer(player)) {
                alert("Could not save your profile. Please try again.");
                return;
            }

            if (typeof window.updatePlayerDisplays === "function") {
                window.updatePlayerDisplays();
            }

            renderProfile();
            renderAchievements();

            if (editForm) editForm.style.display = "none";
        });
    }

    if (cancelButton && editForm) {
        cancelButton.addEventListener("click", function () {
            editForm.style.display = "none";
        });
    }

    function initProfile() {
        const player = getPlayer();
        const user = getCurrentUser();

        if (user?.name && !player.name) {
            player.name = user.name;
        }

        if (!player.gradeLevel && user?.category) {
            player.gradeLevel = formatCategory(user.category);
        }

        savePlayer(player);
        renderProfile();
        renderAchievements();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initProfile);
    } else {
        initProfile();
    }

    window.addEventListener("eduquest-data-changed", function () {
        renderProfile();
        renderAchievements();
    });
})();
