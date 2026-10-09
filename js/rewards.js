// ==========================================
// EDUQUEST - REWARDS SYSTEM
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ----------------------------------------
    // REWARDS
    // ----------------------------------------

    const rewards = [
        {
            id: "bronze",
            name: "Bronze Reward",
            description: "A reward for starting your EduQuest journey.",
            icon: "🥉",
            cost: 100
        },

        {
            id: "silver",
            name: "Silver Reward",
            description: "Keep learning and earn this special reward.",
            icon: "🥈",
            cost: 250
        },

        {
            id: "gold",
            name: "Gold Reward",
            description: "A reward for dedicated EduQuest learners.",
            icon: "🥇",
            cost: 500
        },

        {
            id: "scholar",
            name: "Scholar Reward",
            description: "For students who continue to improve their knowledge.",
            icon: "🎓",
            cost: 750
        },

        {
            id: "champion",
            name: "Champion Reward",
            description: "The ultimate reward for EduQuest champions.",
            icon: "🏆",
            cost: 1000
        }
    ];


    // ----------------------------------------
    // GET XP
    // ----------------------------------------

    let xp = parseInt(
        localStorage.getItem("eduquestXP")
    );

    if (isNaN(xp)) {
        xp = 0;
    }


    // ----------------------------------------
    // ELEMENTS
    // ----------------------------------------

    const xpDisplay =
        document.getElementById("xp-value");

    const rewardsContainer =
        document.getElementById("rewards-container");

    const historyContainer =
        document.getElementById("reward-history");

    const notification =
        document.getElementById("notification");


    // ----------------------------------------
    // UPDATE XP
    // ----------------------------------------

    function updateXP() {

        xpDisplay.textContent = xp;

        localStorage.setItem(
            "eduquestXP",
            xp
        );
    }


    // ----------------------------------------
    // DISPLAY REWARDS
    // ----------------------------------------

    function displayRewards() {

        rewardsContainer.innerHTML = "";

        rewards.forEach(reward => {

            const canRedeem =
                xp >= reward.cost;


            const card =
                document.createElement("div");

            card.className = "reward-card";


            card.innerHTML = `

                <div class="reward-icon">
                    ${reward.icon}
                </div>

                <h3>
                    ${reward.name}
                </h3>

                <p>
                    ${reward.description}
                </p>

                <div class="reward-cost">
                    ⭐ ${reward.cost} XP
                </div>

                <button
                    class="redeem-btn"
                    data-reward="${reward.id}"
                    ${canRedeem ? "" : "disabled"}
                >
                    ${
                        canRedeem
                        ? "Redeem Reward"
                        : "Not Enough XP"
                    }
                </button>

            `;


            rewardsContainer.appendChild(card);
        });


        addButtonEvents();
    }


    // ----------------------------------------
    // BUTTON EVENTS
    // ----------------------------------------

    function addButtonEvents() {

        const buttons =
            document.querySelectorAll(
                ".redeem-btn"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const rewardId =
                        button.dataset.reward;

                    redeemReward(
                        rewardId
                    );
                }
            );

        });
    }


    // ----------------------------------------
    // REDEEM REWARD
    // ----------------------------------------

    function redeemReward(rewardId) {

        const reward =
            rewards.find(
                item => item.id === rewardId
            );


        if (!reward) {
            return;
        }


        // Check XP

        if (xp < reward.cost) {

            showNotification(
                "❌ You don't have enough XP."
            );

            return;
        }


        // Confirmation

        const confirmed =
            confirm(
                `Redeem ${reward.name} for ${reward.cost} XP?`
            );


        if (!confirmed) {
            return;
        }


        // Remove XP

        xp -= reward.cost;


        // Save XP

        localStorage.setItem(
            "eduquestXP",
            xp
        );


        // Save history

        saveHistory(reward);


        // Update page

        updateXP();

        displayRewards();

        displayHistory();


        // Message

        showNotification(
            `🎉 ${reward.name} redeemed successfully!`
        );
    }


    // ----------------------------------------
    // SAVE HISTORY
    // ----------------------------------------

    function saveHistory(reward) {

        let history =
            JSON.parse(
                localStorage.getItem(
                    "eduquestRewardHistory"
                )
            );


        if (!Array.isArray(history)) {
            history = [];
        }


        history.push({

            id: reward.id,

            name: reward.name,

            cost: reward.cost,

            date:
                new Date()
                .toLocaleString()

        });


        localStorage.setItem(
            "eduquestRewardHistory",
            JSON.stringify(history)
        );
    }


    // ----------------------------------------
    // DISPLAY HISTORY
    // ----------------------------------------

    function displayHistory() {

        const history =
            JSON.parse(
                localStorage.getItem(
                    "eduquestRewardHistory"
                )
            );


        if (
            !Array.isArray(history) ||
            history.length === 0
        ) {

            historyContainer.innerHTML = `
                <div class="empty">
                    You have not redeemed any rewards yet.
                </div>
            `;

            return;
        }


        historyContainer.innerHTML = "";


        history
            .slice()
            .reverse()
            .forEach(item => {

                const historyItem =
                    document.createElement("div");

                historyItem.className =
                    "history-item";


                historyItem.innerHTML = `

                    <div>

                        <div class="history-name">
                            🎁 ${item.name}
                        </div>

                        <span class="history-date">
                            ${item.date}
                        </span>

                    </div>

                    <div class="history-xp">
                        -${item.cost} XP
                    </div>

                `;


                historyContainer.appendChild(
                    historyItem
                );
            });
    }


    // ----------------------------------------
    // NOTIFICATION
    // ----------------------------------------

    function showNotification(message) {

        notification.textContent =
            message;

        notification.classList.add(
            "show"
        );


        setTimeout(() => {

            notification.classList.remove(
                "show"
            );

        }, 2500);
    }


    // ----------------------------------------
    // LISTEN FOR XP CHANGES
    // ----------------------------------------

    window.addEventListener(
        "storage",
        event => {

            if (
                event.key ===
                "eduquestXP"
            ) {

                xp =
                    parseInt(
                        event.newValue
                    ) || 0;


                updateXP();

                displayRewards();
            }
        }
    );


    // ----------------------------------------
    // START
    // ----------------------------------------

    updateXP();

    displayRewards();

    displayHistory();

});