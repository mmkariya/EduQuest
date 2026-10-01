

const editButton = document.getElementById("edit-profile-btn");
const editForm = document.getElementById("edit-profile-form");

const saveButton = document.getElementById("save-profile-btn");
const cancelButton = document.getElementById("cancel-profile-btn");

const nameInput = document.getElementById("name-input");
const titleInput = document.getElementById("title-input");
const avatarInput = document.getElementById("avatar-input");
const gradeInput = document.getElementById("grade-input");




function renderAchievements() {
    const container = document.getElementById("profile-achievements");
    if (!container) {
        return;
    }

    const player = getPlayerData();

    container.innerHTML = "";

    
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

    if (player.achievements.length === 0) {
        container.innerHTML +=
            '<div class="achievement-slot locked">' +
            '<span class="a-icon">🗺️</span>' +
            '<div class="a-detail"><strong>No achievements yet</strong>' +
            "<span>Complete quests to unlock your first reward!</span></div>" +
            "</div>";
    }
}



editButton.addEventListener("click", function () {
    const player = getPlayerData();

   
    nameInput.value = player.name;
    titleInput.value = player.title;
    avatarInput.value = player.avatar;
    gradeInput.value = player.gradeLevel || "College";

  
    editForm.style.display = "block";

    nameInput.focus();
});



saveButton.addEventListener("click", function () {
    const newName = nameInput.value.trim();
    const newTitle = titleInput.value.trim();
    const newAvatar = avatarInput.value;
    const newGrade = gradeInput.value;

    if (newName === "") {
        alert("Please enter a player name.");
        nameInput.focus();
        return;
    }

    
    const player = getPlayerData();
    player.name = newName;
    player.title = newTitle === "" ? "EduQuest Adventurer" : newTitle;
    player.avatar = newAvatar;
    player.gradeLevel = newGrade;

   
    savePlayerData(player);

    
    updatePlayerDisplays();

  
    editForm.style.display = "none";
});



cancelButton.addEventListener("click", function () {
   
    editForm.style.display = "none";
});




document.addEventListener("DOMContentLoaded", function () {
    renderAchievements();

    
    window.addEventListener("eduquest-data-changed", renderAchievements);
});