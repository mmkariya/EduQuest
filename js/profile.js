/* =====================================================
   EDUQUEST - PROFILE PAGE (js/profile.js)
   =====================================================
   Profile-specific UI only.

   It does NOT manage its own player data. All data work
   (XP, level, localStorage, saving) is handled by the
   shared js/app.js system.

     app.js       -> player data + localStorage + XP/level
     profile.js   -> profile displays + Edit Profile form

   The name / XP / level / points displays on this page
   are updated automatically by app.js updatePlayerDisplays()
   using data-display attributes.
   ===================================================== */

/* ---------- Get elements from the page ---------- */

const editButton = document.getElementById("edit-profile-btn");
const editForm = document.getElementById("edit-profile-form");

const saveButton = document.getElementById("save-profile-btn");
const cancelButton = document.getElementById("cancel-profile-btn");

const nameInput = document.getElementById("name-input");
const titleInput = document.getElementById("title-input");
const avatarInput = document.getElementById("avatar-input");
const gradeInput = document.getElementById("grade-input");


/* ---------- Render the achievements list ---------- */

function renderAchievements() {
    const container = document.getElementById("profile-achievements");
    if (!container) {
        return;
    }

    const player = getPlayerData();

    container.innerHTML = "";

    // Show every known achievement (locked ones are greyed out)
    ACHIEVEMENT_INFO.forEach(function (info) {
        const unlocked = player.achievements.includes(info.id);
        const lockClass = unlocked ? "" : "locked";
        const icon = unlocked ? info.icon : "🔒";

        container.innerHTML +=
            '<div class="achievement-slot ' + lockClass + '">' +
            '<span class="a-icon">' + icon + "</span>" +
            '<div class="a-detail"><strong>' + info.name + "</strong>" +
            "<span>" + info.description + "</span></div>" +
            "</div>";
    });

    // Friendly hint when nothing is unlocked yet
    if (player.achievements.length === 0) {
        container.innerHTML +=
            '<div class="achievement-slot locked">' +
            '<span class="a-icon">🗺️</span>' +
            '<div class="a-detail"><strong>No achievements yet</strong>' +
            "<span>Complete quests to unlock your first reward!</span></div>" +
            "</div>";
    }
}


/* ---------- Open Edit Profile ---------- */

editButton.addEventListener("click", function () {
    const player = getPlayerData();

    // Put the current information into the form
    nameInput.value = player.name;
    titleInput.value = player.title;
    avatarInput.value = player.avatar;
    gradeInput.value = player.gradeLevel || "College";

    // Show the form
    editForm.style.display = "block";

    nameInput.focus();
});


/* ---------- Save Profile ---------- */

saveButton.addEventListener("click", function () {
    const newName = nameInput.value.trim();
    const newTitle = titleInput.value.trim();
    const newAvatar = avatarInput.value;
    const newGrade = gradeInput.value;

    // Validate: the name cannot be empty
    if (newName === "") {
        alert("Please enter a player name.");
        nameInput.focus();
        return;
    }

    // Update the shared player data (single source of truth)
    const player = getPlayerData();
    player.name = newName;
    player.title = newTitle === "" ? "EduQuest Adventurer" : newTitle;
    player.avatar = newAvatar;
    player.gradeLevel = newGrade;

    // Save to localStorage through app.js
    savePlayerData(player);

    // Refresh every display on the page immediately
    updatePlayerDisplays();

    // Hide the form
    editForm.style.display = "none";
});


/* ---------- Cancel editing ---------- */

cancelButton.addEventListener("click", function () {
    // Just close the form - do not change any saved data
    editForm.style.display = "none";
});


/* ---------- Run on page load ---------- */

document.addEventListener("DOMContentLoaded", function () {
    renderAchievements();

    // Re-render achievements when data changes elsewhere
    // (e.g. a groupmate's feature calls unlockAchievement)
    window.addEventListener("eduquest-data-changed", renderAchievements);
});