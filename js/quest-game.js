document.addEventListener("DOMContentLoaded", function () {
    const quests = {
        "math-explorer": {
            title: "Math Explorer", icon: "🧮", xp: 20, points: 10,
            questions: [
                ["What is 5 + 7?", ["10","12","13","14"], 1],
                ["What is 9 × 3?", ["18","21","27","30"], 2],
                ["What is 20 − 8?", ["10","11","12","13"], 2],
                ["What is 36 ÷ 6?", ["5","6","7","8"], 1],
                ["What is 15 + 25?", ["30","35","40","45"], 2],
                ["What is 10% of 100?", ["5","10","20","50"], 1],
                ["Which number is even?", ["7","11","14","19"], 2],
                ["What is 8 × 4?", ["24","28","32","36"], 2],
                ["What is 50 − 17?", ["31","32","33","34"], 2],
                ["What is 3²?", ["6","8","9","12"], 2]
            ]
        },
        "code-apprentice": {
            title: "Code Apprentice", icon: "💻", xp: 30, points: 20,
            questions: [
                ["Which HTML tag creates a paragraph?", ["<p>","<h1>","<div>","<br>"], 0],
                ["Which CSS property changes text color?", ["font-size","color","background","display"], 1],
                ["Which symbol starts a JavaScript single-line comment?", ["<!--","//","#","**"], 1],
                ["Which HTML tag creates a link?", ["<a>","<link>","<url>","<href>"], 0],
                ["What does CSS mainly control?", ["Database data","Web page appearance","Computer hardware","Passwords"], 1],
                ["Which JavaScript keyword declares a variable?", ["let","style","html","print"], 0],
                ["What does HTML stand for?", ["HyperText Markup Language","HighText Machine Language","Home Tool Markup Language","Hyperlink Text Main Language"], 0],
                ["Which CSS property makes an element a flex container?", ["position","flex","display","align"], 2],
                ["What will console.log(2 + 3) output?", ["23","5","6","undefined"], 1],
                ["Which file extension is commonly used for JavaScript?", [".css",".html",".js",".java"], 2]
            ]
        },
        "world-explorer": {
            title: "World Explorer", icon: "🌎", xp: 30, points: 20,
            questions: [
                ["What is the largest continent?", ["Africa","Asia","Europe","Australia"], 1],
                ["What is the capital of Japan?", ["Kyoto","Osaka","Tokyo","Hiroshima"], 2],
                ["Which ocean is the largest?", ["Atlantic","Indian","Arctic","Pacific"], 3],
                ["Which country is known for the Eiffel Tower?", ["Italy","France","Spain","Germany"], 1],
                ["What is the capital of the Philippines?", ["Cebu City","Davao City","Manila","Baguio"], 2],
                ["Which continent is Egypt in?", ["Asia","Africa","Europe","South America"], 1],
                ["Which country is shaped like a boot?", ["Italy","Greece","Portugal","Chile"], 0],
                ["Mount Everest is in which mountain range?", ["Andes","Alps","Himalayas","Rockies"], 2],
                ["Which is the smallest continent?", ["Europe","Australia","Africa","Antarctica"], 1],
                ["Which country has the Great Wall?", ["China","India","Japan","Korea"], 0]
            ]
        },
        "science-master": {
            title: "Science Master", icon: "🔬", xp: 50, points: 30,
            questions: [
                ["What planet is known as the Red Planet?", ["Venus","Mars","Jupiter","Mercury"], 1],
                ["What gas do humans need to breathe?", ["Carbon dioxide","Oxygen","Helium","Hydrogen"], 1],
                ["What is H2O?", ["Salt","Oxygen","Water","Hydrogen"], 2],
                ["What force pulls objects toward Earth?", ["Friction","Gravity","Magnetism","Pressure"], 1],
                ["How many legs does an insect have?", ["4","6","8","10"], 1],
                ["Which organ pumps blood?", ["Lungs","Brain","Heart","Kidney"], 2],
                ["What is the center of an atom called?", ["Electron","Nucleus","Cell","Molecule"], 1],
                ["Which is the closest star to Earth?", ["Sirius","The Sun","Polaris","Vega"], 1],
                ["Plants make food through what process?", ["Respiration","Digestion","Photosynthesis","Evaporation"], 2],
                ["Which state of matter has a fixed shape?", ["Gas","Liquid","Solid","Plasma"], 2]
            ]
        }
    };

    const params = new URLSearchParams(window.location.search);
    const questId = params.get("quest");
    const quest = quests[questId];
    const gameCard = document.getElementById("gameCard");

    if (!quest) {
        gameCard.innerHTML = '<div class="result"><h1>Quest Not Found 😕</h1><p>Please choose a quest from the quest board.</p><a href="quests.html" class="next-btn show">Back to Quests</a></div>';
        return;
    }

    let current = 0;
    let score = 0;
    let answered = false;

    document.getElementById("questTitle").textContent = quest.title;
    document.getElementById("totalQuestions").textContent = quest.questions.length;
    document.getElementById("rewardText").textContent = `⭐ ${quest.xp} XP · 🎯 ${quest.points} Points`;

    function showQuestion() {
        const [question, choices, correct] = quest.questions[current];
        answered = false;
        document.getElementById("questionNumber").textContent = current + 1;
        document.getElementById("questionIcon").textContent = quest.icon;
        document.getElementById("questionText").textContent = question;
        document.getElementById("progressFill").style.width = ((current / quest.questions.length) * 100) + "%";
        const answers = document.getElementById("answers");
        const feedback = document.getElementById("feedback");
        const nextBtn = document.getElementById("nextBtn");
        answers.innerHTML = "";
        feedback.className = "feedback";
        feedback.textContent = "";
        nextBtn.classList.remove("show");

        choices.forEach((choice, index) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "answer-btn";
            btn.textContent = choice;
            btn.addEventListener("click", () => chooseAnswer(index, correct));
            answers.appendChild(btn);
        });
    }

    function chooseAnswer(selected, correct) {
        if (answered) return;
        answered = true;
        const buttons = document.querySelectorAll(".answer-btn");
        buttons.forEach(btn => btn.disabled = true);
        buttons[correct].classList.add("correct");
        const feedback = document.getElementById("feedback");
        if (selected === correct) {
            score++;
            feedback.className = "feedback show correct";
            feedback.textContent = "✅ Correct! Great job!";
        } else {
            buttons[selected].classList.add("wrong");
            feedback.className = "feedback show wrong";
            feedback.textContent = "❌ Not quite. The correct answer is highlighted.";
        }
        document.getElementById("nextBtn").classList.add("show");
    }

    document.getElementById("nextBtn").addEventListener("click", () => {
        if (current < quest.questions.length - 1) {
            current++;
            showQuestion();
        } else {
            finishQuest();
        }
    });

    function finishQuest() {
        document.getElementById("progressFill").style.width = "100%";
        let rewardGiven = false;
        if (typeof completeQuest === "function") {
            rewardGiven = completeQuest(questId, quest.xp, quest.points);
        }
        if (typeof unlockAchievement === "function") {
            if (rewardGiven) unlockAchievement("first-quest");
            const player = getPlayerData();
            if (player.xp >= 100) unlockAchievement("xp-hunter");
            if (player.level >= 3) unlockAchievement("rising-scholar");
        }
        const percent = Math.round((score / quest.questions.length) * 100);
        const rewardMessage = rewardGiven ? `You earned ⭐ ${quest.xp} XP and 🎯 ${quest.points} points!` : "This quest was already completed, so rewards were not given again.";
        gameCard.innerHTML = `<div class="result"><div class="question-icon">🏆</div><h1>Quest Complete!</h1><p class="score">${score}/${quest.questions.length}</p><p>${percent}% correct</p><p style="margin:18px 0">${rewardMessage}</p><a href="quests.html" class="next-btn show" style="text-decoration:none">Back to Quests</a> <a href="index.html" class="next-btn show" style="text-decoration:none;background:var(--blue)">Dashboard</a></div>`;
    }

    showQuestion();
});
