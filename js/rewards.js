"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const rewards = [
        {
            id: "bronze-frame",
            name: "Bronze Adventurer Frame",
            description: "A warm bronze keepsake for your profile collection.",
            icon: "🥉",
            cost: 30
        },
        {
            id: "silver-scholar",
            name: "Silver Scholar Badge",
            description: "Celebrate your steady progress with a silver badge.",
            icon: "🎓",
            cost: 60
        },
        {
            id: "gold-trophy",
            name: "Golden Quest Trophy",
            description: "A golden trophy for a dedicated learner.",
            icon: "🏆",
            cost: 100
        },
        {
            id: "cosmic-compass",
            name: "Cosmic Explorer Compass",
            description: "A rare keepsake for your EduQuest collection.",
            icon: "🧭",
            cost: 150
        }
    ];

    const pointsDisplay = document.getElementById("points-value");
    const rewardsContainer = document.getElementById("rewards-container");
    const historyContainer = document.getElementById("reward-history");
    const notification = document.getElementById("notification");
    let notificationTimeout;

    function getPlayer() {
        return typeof window.getPlayerData === "function"
            ? window.getPlayerData()
            : null;
    }

    function getHistory(player) {
        return Array.isArray(player.rewardHistory) ? player.rewardHistory : [];
    }

    function savePlayer(player) {
        if (typeof window.savePlayerData !== "function" || !window.savePlayerData(player)) {
            showNotification("Your reward could not be saved. Please try again.");
            return false;
        }
        return true;
    }

    function renderRewards() {
        const player = getPlayer();
        if (!player) {
            rewardsContainer.textContent = "Player data is unavailable. Refresh the page and try again.";
            return;
        }

        const history = getHistory(player);
        const redeemedIds = new Set(history.map(item => item.id));
        pointsDisplay.textContent = Number(player.points || 0).toLocaleString();
        rewardsContainer.replaceChildren();

        rewards.forEach(reward => {
            const redeemed = redeemedIds.has(reward.id);
            const canRedeem = Number(player.points || 0) >= reward.cost;
            const card = document.createElement("article");
            card.className = "reward-card";

            const icon = document.createElement("div");
            icon.className = "reward-icon";
            icon.setAttribute("aria-hidden", "true");
            icon.textContent = reward.icon;

            const title = document.createElement("h3");
            title.textContent = reward.name;

            const description = document.createElement("p");
            description.textContent = reward.description;

            const cost = document.createElement("div");
            cost.className = "reward-cost";
            cost.textContent = `⭐ ${reward.cost} points`;

            const button = document.createElement("button");
            button.type = "button";
            button.className = "redeem-btn";
            button.disabled = redeemed || !canRedeem;
            button.textContent = redeemed ? "In your collection" : canRedeem ? "Redeem reward" : "Not enough points";
            button.addEventListener("click", () => redeemReward(reward));

            card.append(icon, title, description, cost, button);
            rewardsContainer.appendChild(card);
        });

        renderHistory(history);
    }

    function renderHistory(history) {
        historyContainer.replaceChildren();
        if (!history.length) {
            const empty = document.createElement("p");
            empty.className = "empty-history";
            empty.textContent = "No rewards redeemed yet. Complete quests to earn points.";
            historyContainer.appendChild(empty);
            return;
        }

        history.slice().reverse().forEach(item => {
            const row = document.createElement("div");
            row.className = "history-item";

            const details = document.createElement("div");
            const name = document.createElement("div");
            name.className = "history-name";
            name.textContent = `🎁 ${item.name}`;
            const date = document.createElement("span");
            date.className = "history-date";
            const redeemedAt = new Date(item.redeemedAt);
            date.textContent = Number.isNaN(redeemedAt.getTime())
                ? "Redeemed"
                : `Redeemed ${redeemedAt.toLocaleString()}`;
            details.append(name, date);

            const cost = document.createElement("div");
            cost.className = "history-cost";
            cost.textContent = `−${Number(item.cost || 0)} points`;
            row.append(details, cost);
            historyContainer.appendChild(row);
        });
    }

    function redeemReward(reward) {
        const player = getPlayer();
        if (!player) {
            showNotification("Player data is unavailable. Refresh the page and try again.");
            return;
        }

        const history = getHistory(player);
        if (history.some(item => item.id === reward.id)) {
            showNotification("This reward is already in your collection.");
            return;
        }

        if (Number(player.points || 0) < reward.cost) {
            showNotification("You need more points to redeem this reward.");
            return;
        }

        if (!window.confirm(`Redeem ${reward.name} for ${reward.cost} points?`)) {
            return;
        }

        const updatedPlayer = {
            ...player,
            points: Number(player.points || 0) - reward.cost,
            rewardHistory: [
                ...history,
                {
                    id: reward.id,
                    name: reward.name,
                    cost: reward.cost,
                    redeemedAt: new Date().toISOString()
                }
            ]
        };

        if (savePlayer(updatedPlayer)) {
            renderRewards();
            showNotification(`${reward.name} was added to your collection.`);
        }
    }

    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add("show");
        window.clearTimeout(notificationTimeout);
        notificationTimeout = window.setTimeout(() => {
            notification.classList.remove("show");
        }, 2800);
    }

    window.addEventListener("eduquest-data-changed", renderRewards);
    renderRewards();
});
