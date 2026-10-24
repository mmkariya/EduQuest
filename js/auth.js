
/* =====================================================
   EDUQUEST ACCOUNT STORAGE
   Browser-based app state for the local web experience.
   ===================================================== */

const AUTH_USERS_KEY = "eduquestUsers";
const AUTH_SESSION_KEY = "eduquestSession";
const AUTH_CACHE_KEY = "eduquestCurrentUser";

function readLegacyAuthValue(primaryKey, fallbackKey) {
    const primaryValue = localStorage.getItem(primaryKey);
    if (primaryValue !== null) {
        return primaryValue;
    }
    return localStorage.getItem(fallbackKey) || "[]";
}

function persistCachedUser(user) {
    if (!user || !user.id) {
        localStorage.removeItem(AUTH_CACHE_KEY);
        return;
    }

    localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        category: normalizeCategory(user.category)
    }));
}

function normalizeCategory(category) {
    const value = String(category || "").trim().toLowerCase();

    if (!value || value === "elementary") {
        return "Elementary";
    }

    if (
        value === "jhs/shs" ||
        value === "junior high school" ||
        value === "senior high school" ||
        value === "junior/senior high school" ||
        value === "high school"
    ) {
        return "JHS/SHS";
    }

    if (
        value === "college it" ||
        value === "college (it)" ||
        value === "college"
    ) {
        return "College IT";
    }

    return "Elementary";
}

function getUsers() {
    try {
        const users = JSON.parse(
            readLegacyAuthValue(AUTH_USERS_KEY, "eduquestDemoUsers")
        );

        return Array.isArray(users) ? users : [];
    } catch (error) {
        return [];
    }
}

function getCurrentUser() {
    try {
        const cached = localStorage.getItem(AUTH_CACHE_KEY);
        if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.id) {
                return parsed;
            }
        }

        const sessionValue = readLegacyAuthValue(AUTH_SESSION_KEY, "eduquestDemoSession");
        const session = JSON.parse(sessionValue || "null");

        if (!session || !session.userId) {
            return null;
        }

        const user = getUsers().find(
            item => item.id === session.userId
        );

        if (!user) {
            return null;
        }

        const normalUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            category: normalizeCategory(user.category)
        };

        persistCachedUser(normalUser);
        return normalUser;
    } catch (error) {
        return null;
    }
}


async function hydrateSession() {
    if (!window.fetch) {
        return getCurrentUser();
    }

    try {
        const response = await fetch('/api/me', { credentials: 'same-origin' });
        if (!response.ok) {
            const cached = localStorage.getItem(AUTH_CACHE_KEY);
            if (cached) {
                try {
                    return JSON.parse(cached);
                } catch (error) {
                    localStorage.removeItem(AUTH_CACHE_KEY);
                }
            }
            localStorage.removeItem(AUTH_CACHE_KEY);
            return null;
        }

        const data = await response.json();
        const user = data && data.user ? data.user : null;
        if (!user) {
            const cached = localStorage.getItem(AUTH_CACHE_KEY);
            if (cached) {
                try {
                    return JSON.parse(cached);
                } catch (error) {
                    localStorage.removeItem(AUTH_CACHE_KEY);
                }
            }
            localStorage.removeItem(AUTH_CACHE_KEY);
            return null;
        }

        const normalizedUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            category: normalizeCategory(user.category)
        };

        persistCachedUser(normalizedUser);
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ userId: normalizedUser.id }));
        return normalizedUser;
    } catch (error) {
        return getCurrentUser();
    }
}

function registerUser(name, email, password, category) {
  const users = getUsers();

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedCategory = normalizeCategory(category);

  if (users.some(user => user.email.toLowerCase() === normalizedEmail)) {
    throw new Error("An account with this email already exists.");
  }

  const user = {
    id: Date.now().toString(),
    name: name.trim(),
    email: normalizedEmail,
    password: password,
    category: normalizedCategory,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
  localStorage.setItem("eduquestDemoUsers", JSON.stringify(users));
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ userId: user.id }));
  localStorage.setItem("eduquestDemoSession", JSON.stringify({ userId: user.id }));
  persistCachedUser({
    id: user.id,
    name: user.name,
    email: user.email,
    category: normalizedCategory
  });

  const playerKey = "eduquestPlayer_" + user.id;

  if (!localStorage.getItem(playerKey)) {
    const legacyData = localStorage.getItem("eduquestPlayer");
    let playerData = null;

    if (legacyData && users.length === 1) {
      try {
        playerData = JSON.parse(legacyData);
      } catch {
        playerData = null;
      }
    }

    playerData = {
      ...(playerData || {}),
      name: user.name,
      gradeLevel: normalizedCategory,
      xp: playerData?.xp ?? 0,
      level: playerData?.level ?? 1,
      points: playerData?.points ?? 0,
      completedQuests: playerData?.completedQuests ?? [],
      achievements: playerData?.achievements ?? []
    };

    localStorage.setItem(playerKey, JSON.stringify(playerData));
  }

  return user;

}

function loginUser(email, password) {
    email = email.trim().toLowerCase();

    const user = getUsers().find(
        item => item.email === email &&
                item.password === password
    );

    if (!user) {
        throw new Error("Incorrect email or password.");
    }

    const normalizedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        category: normalizeCategory(user.category)
    };

    localStorage.setItem(
        AUTH_SESSION_KEY,
        JSON.stringify({ userId: user.id })
    );
    localStorage.setItem(
        "eduquestDemoSession",
        JSON.stringify({ userId: user.id })
    );
    persistCachedUser(normalizedUser);

    return normalizedUser;
}

function logoutUser() {
    localStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem("eduquestDemoSession");
    localStorage.removeItem(AUTH_CACHE_KEY);
    window.location.href = "login.html";
}

function requireLogin() {
    if (!getCurrentUser()) {
        window.location.href = "login.html";
        return false;
    }

    return true;
}

window.EduQuestAuth = {
    getCurrentUser,
    hydrateSession,
    registerUser,
    loginUser,
    logoutUser,
    requireLogin
};
