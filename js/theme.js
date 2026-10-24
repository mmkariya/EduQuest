(function () {
    "use strict";

    function getTheme() {
        try {
            const cachedUser = JSON.parse(localStorage.getItem("eduquestCurrentUser") || "null");
            const settingsKey = cachedUser && cachedUser.id
                ? "eduquestSettings_" + cachedUser.id
                : "eduquestSettings_guest";
            const settings = JSON.parse(localStorage.getItem(settingsKey) || "{}");
            return settings.themePreference === "dark" ? "dark" : "light";
        } catch (error) {
            console.error("EduQuest: Unable to load appearance preference.", error);
            return "light";
        }
    }

    function applyTheme() {
        document.documentElement.dataset.theme = getTheme();
    }

    applyTheme();
    window.addEventListener("storage", event => {
        if (!event.key || event.key.startsWith("eduquestSettings_")) {
            applyTheme();
        }
    });

    window.applyEduQuestTheme = function (theme) {
        document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
    };
})();
