"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("badges-container");
    const summary = document.getElementById("badge-summary");

    function renderBadges() {
        const player = typeof window.getPlayerData === "function"
            ? window.getPlayerData()
            : null;
        const achievements = window.getAchievementInfo?.() || [];

        if (!player) {
            container.textContent = "Player data is unavailable. Refresh the page and try again.";
            summary.textContent = "";
            return;
        }

        const unlocked = new Set(Array.isArray(player.achievements) ? player.achievements : []);
        const count = achievements.filter(item => unlocked.has(item.id)).length;
        summary.textContent = `${count} of ${achievements.length} badges unlocked`;
        container.replaceChildren();

        achievements.forEach(item => {
            const isUnlocked = unlocked.has(item.id);
            const card = document.createElement("article");
            card.className = `badge-card ${isUnlocked ? "unlocked" : "locked"}`;

            const icon = document.createElement("div");
            icon.className = "badge-icon";
            icon.setAttribute("aria-hidden", "true");
            icon.textContent = isUnlocked ? item.icon : "🔒";

            const title = document.createElement("h2");
            title.textContent = item.name;

            const description = document.createElement("p");
            description.textContent = item.description;

            const status = document.createElement("span");
            status.className = "badge-status";
            status.textContent = isUnlocked ? "✓ Unlocked" : "🔒 In progress";

            card.append(icon, title, description, status);
            container.appendChild(card);
        });
    }

    window.addEventListener("eduquest-data-changed", renderBadges);
    renderBadges();
});
