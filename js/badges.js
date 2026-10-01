let xp = Number(localStorage.getItem("eduquestXP")) || 0;

function updateXP() {

    document.getElementById("xp").textContent = xp;

    
    let level = Math.floor(xp / 100) + 1;

    document.getElementById("level").textContent = level;

    
    let currentLevelXP = xp % 100;

    document.getElementById("xpProgress").style.width =
        currentLevelXP + "%";

    
    if (xp >= 100) {
        unlockBadge("badge100");
    }

    if (xp >= 250) {
        unlockBadge("badge250");
    }

    if (xp >= 500) {
        unlockBadge("badge500");
    }

   
    if (xp >= 500) {
        document.getElementById("xpMessage").textContent =
            "🎉 You are an EduQuest Champion!";
    } else if (xp >= 250) {
        document.getElementById("xpMessage").textContent =
            "🔥 Great job! You are becoming a Quest Master!";
    } else if (xp >= 100) {
        document.getElementById("xpMessage").textContent =
            "⚡ You unlocked the XP Beginner badge!";
    }
}

function earnXP(amount) {

    xp += amount;

    localStorage.setItem("eduquestXP", xp);

    updateXP();
}

function unlockBadge(id) {

    const badge = document.getElementById(id);

    badge.classList.remove("locked");
    badge.classList.add("unlocked");
}

updateXP();