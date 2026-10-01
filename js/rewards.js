// Starting points
let points = 100;

// Display points
const pointsDisplay = document.getElementById("points");

function updatePoints() {
    pointsDisplay.textContent = points;
}

// Claim reward
function claimReward(cost, rewardName) {

    if (points >= cost) {

        points -= cost;

        updatePoints();

        alert(
            "🎉 Congratulations!\n\n" +
            "You claimed: " + rewardName +
            "\n\nRemaining Points: " + points
        );

    } else {

        alert(
            "❌ Not enough points!\n\n" +
            "You need " + cost +
            " points to claim this reward.\n" +
            "Your current points: " + points
        );
    }
}

// Initial display
updatePoints();