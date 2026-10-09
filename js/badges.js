// ==========================================
// EDUQUEST - BADGES & XP JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ------------------------------------------
    // BADGE DATA
    // ------------------------------------------

    const badges = [
        {
            id: "first-quest",
            name: "First Quest",
            description: "Complete your first quest.",
            icon: "🎯",
            requirement: 1,
            xp: 50
        },
        {
            id: "quest-starter",
            name: "Quest Starter",
            description: "Complete 5 quests.",
            icon: "🚀",
            requirement: 5,
            xp: 100
        },
        {
            id: "quest-master",
            name: "Quest Master",
            description: "Complete 10 quests.",
            icon: "🏆",
            requirement: 10,
            xp: 200
        },
        {
            id: "knowledge-seeker",
            name: "Knowledge Seeker",
            description: "Earn 500 XP.",
            icon: "📚",
            requirement: 500,
            xp: 100
        },
        {
            id: "xp-champion",
            name: "XP Champion",
            description: "Earn 1,000 XP.",
            icon: "⭐",
            requirement: 1000,
            xp: 250
        },
        {
            id: "dedicated-learner",
            name: "Dedicated Learner",
            description: "Complete 25 quests.",
            icon: "🔥",
            requirement: 25,
            xp: 500
        }
    ];


    // ------------------------------------------
    // GET USER DATA
    // ------------------------------------------

    let userXP = parseInt(localStorage.getItem("eduquestXP")) || 0;
    let completedQuests =
        parseInt(localStorage.getItem("completedQuests")) || 0;


    // ------------------------------------------
    // XP LEVEL SYSTEM
    // ------------------------------------------

    function calculateLevel(xp) {
        return Math.floor(xp / 100) + 1;
    }

    function getXPForNextLevel(xp) {
        const level = calculateLevel(xp);
        return level * 100;
    }


    // ------------------------------------------
    // UPDATE XP DISPLAY
    // ------------------------------------------

    function updateXPDisplay() {

        const xpElements = document.querySelectorAll(
            "#xp-value, .xp-value, [data-xp]"
        );

        xpElements.forEach(element => {
            element.textContent = userXP;
        });


        // Level
        const levelElements = document.querySelectorAll(
            "#level-value, .level-value, [data-level]"
        );

        const currentLevel = calculateLevel(userXP);

        levelElements.forEach(element => {
            element.textContent = currentLevel;
        });


        // XP required for next level
        const nextLevelXP = getXPForNextLevel(userXP);

        const nextXPElements = document.querySelectorAll(
            "#next-xp, .next-xp, [data-next-xp]"
        );

        nextXPElements.forEach(element => {
            element.textContent = nextLevelXP;
        });


        // Progress bar
        const previousLevelXP = (currentLevel - 1) * 100;
        const progressXP = userXP - previousLevelXP;

        let percentage = progressXP;

        if (percentage < 0) {
            percentage = 0;
        }

        if (percentage > 100) {
            percentage = 100;
        }

        const progressBars = document.querySelectorAll(
            "#xp-progress, .xp-progress, .xp-progress-bar"
        );

        progressBars.forEach(bar => {
            bar.style.width = percentage + "%";
        });
    }


    // ------------------------------------------
    // CHECK BADGES
    // ------------------------------------------

    function checkBadgeUnlocked(badge) {

        if (badge.id === "knowledge-seeker") {
            return userXP >= badge.requirement;
        }

        if (badge.id === "xp-champion") {
            return userXP >= badge.requirement;
        }

        return completedQuests >= badge.requirement;
    }


    // ------------------------------------------
    // DISPLAY BADGES
    // ------------------------------------------

    function displayBadges() {

        const badgeContainer =
            document.querySelector("#badges-container") ||
            document.querySelector(".badges-container") ||
            document.querySelector(".badge-grid");

        if (!badgeContainer) {
            return;
        }

        badgeContainer.innerHTML = "";

        badges.forEach(badge => {

            const unlocked = checkBadgeUnlocked(badge);

            const badgeCard = document.createElement("div");

            badgeCard.className =
                unlocked
                    ? "badge-card unlocked"
                    : "badge-card locked";

            badgeCard.innerHTML = `
                <div class="badge-icon">
                    ${badge.icon}
                </div>

                <div class="badge-info">
                    <h3>${badge.name}</h3>

                    <p>${badge.description}</p>

                    <div class="badge-xp">
                        +${badge.xp} XP
                    </div>

                    ${
                        unlocked
                            ? `<span class="badge-status unlocked-status">
                                ✓ Unlocked
                               </span>`
                            : `<span class="badge-status locked-status">
                                🔒 Locked
                               </span>`
                    }
                </div>
            `;

            badgeContainer.appendChild(badgeCard);
        });
    }


    // ------------------------------------------
    // BADGE COUNTER
    // ------------------------------------------

    function updateBadgeCounter() {

        const unlockedCount = badges.filter(badge =>
            checkBadgeUnlocked(badge)
        ).length;

        const totalBadges = badges.length;

        const counterElements = document.querySelectorAll(
            "#badge-count, .badge-count, [data-badge-count]"
        );

        counterElements.forEach(element => {
            element.textContent =
                `${unlockedCount}/${totalBadges}`;
        });


        const unlockedElements = document.querySelectorAll(
            "#unlocked-count, .unlocked-count"
        );

        unlockedElements.forEach(element => {
            element.textContent = unlockedCount;
        });
    }


    // ------------------------------------------
    // SAVE XP
    // ------------------------------------------

    function saveXP() {
        localStorage.setItem("eduquestXP", userXP);
    }


    // ------------------------------------------
    // SAVE COMPLETED QUESTS
    // ------------------------------------------

    function saveCompletedQuests() {
        localStorage.setItem(
            "completedQuests",
            completedQuests
        );
    }


    // ------------------------------------------
    // ADD XP FUNCTION
    // ------------------------------------------

    window.addXP = function (amount) {

        amount = parseInt(amount);

        if (isNaN(amount) || amount <= 0) {
            return;
        }

        const oldLevel = calculateLevel(userXP);

        userXP += amount;

        saveXP();

        const newLevel = calculateLevel(userXP);

        updateXPDisplay();
        displayBadges();
        updateBadgeCounter();

        if (newLevel > oldLevel) {
            showNotification(
                `🎉 Level Up! You are now Level ${newLevel}!`
            );
        } else {
            showNotification(
                `⭐ +${amount} XP earned!`
            );
        }
    };


    // ------------------------------------------
    // COMPLETE QUEST FUNCTION
    // ------------------------------------------

    window.completeQuest = function () {

        completedQuests++;

        saveCompletedQuests();

        addXP(50);

        displayBadges();
        updateBadgeCounter();
    };


    // ------------------------------------------
    // NOTIFICATION
    // ------------------------------------------

    function showNotification(message) {

        const notification =
            document.createElement("div");

        notification.className = "xp-notification";

        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add("show");
        }, 10);

        setTimeout(() => {
            notification.classList.remove("show");

            setTimeout(() => {
                notification.remove();
            }, 300);

        }, 2500);
    }


    // ------------------------------------------
    // INITIALIZE
    // ------------------------------------------

    updateXPDisplay();
    displayBadges();
    updateBadgeCounter();

});