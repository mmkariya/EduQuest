(function () {
  "use strict";

  const DEFAULTS = {
    musicEnabled: false,
    soundEffectsEnabled: true,
    musicVolume: 65,
    soundEffectsVolume: 75
  };
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("eduquestCurrentUser") || "null");
    } catch (error) {
      console.error("EduQuest: Could not load the audio preference account.", error);
      return null;
    }
  })();
  const settingsKey = user && user.id
    ? "eduquestSettings_" + user.id
    : "eduquestSettings_guest";
  let preferences = loadPreferences();
  let audioContext;
  let musicBus;
  let loopTimer;
  let musicNodes = [];

  function loadPreferences() {
    try {
      const saved = JSON.parse(localStorage.getItem(settingsKey) || "{}");
      return {
        musicEnabled: typeof saved.musicEnabled === "boolean"
          ? saved.musicEnabled
          : DEFAULTS.musicEnabled,
        soundEffectsEnabled: typeof saved.soundEffectsEnabled === "boolean"
          ? saved.soundEffectsEnabled
          : DEFAULTS.soundEffectsEnabled,
        musicVolume: normalizeVolume(saved.musicVolume, DEFAULTS.musicVolume),
        soundEffectsVolume: normalizeVolume(saved.soundEffectsVolume, DEFAULTS.soundEffectsVolume)
      };
    } catch (error) {
      console.error("EduQuest: Could not load audio preferences.", error);
      return { ...DEFAULTS };
    }
  }

  function normalizeVolume(value, fallback) {
    const volume = Number(value);
    return Number.isFinite(volume) ? Math.min(100, Math.max(0, volume)) : fallback;
  }

  function savePreferences() {
    try {
      const saved = JSON.parse(localStorage.getItem(settingsKey) || "{}");
      localStorage.setItem(settingsKey, JSON.stringify({
        ...saved,
        ...preferences
      }));
      window.dispatchEvent(new CustomEvent("eduquest-audio-settings-changed", {
        detail: { ...preferences }
      }));
    } catch (error) {
      console.error("EduQuest: Could not save audio preferences.", error);
      showStatus("Audio preference could not be saved.");
    }
    renderControls();
  }

  function createControls() {
    const style = document.createElement("style");
    style.textContent = `
      .eduquest-audio {
        position: fixed;
        z-index: 1000;
        right: 18px;
        bottom: 18px;
        display: flex;
        gap: 8px;
        padding: 8px;
        border: 1px solid #dcd5f1;
        border-radius: 18px;
        background: rgba(255, 255, 255, .94);
        box-shadow: 0 8px 28px rgba(41, 28, 91, .18);
        backdrop-filter: blur(12px);
      }
      .eduquest-audio button {
        min-height: 40px;
        padding: 9px 13px;
        border: 0;
        border-radius: 12px;
        background: #f0ebff;
        color: #382078;
        font: 700 13px/1.2 Inter, "Segoe UI", Arial, sans-serif;
        cursor: pointer;
      }
      .eduquest-audio button:hover { background: #e5dcff; }
      .eduquest-audio button:focus-visible {
        outline: 3px solid #7051e8;
        outline-offset: 2px;
      }
      .eduquest-audio button[aria-pressed="true"] {
        background: #5133c4;
        color: #fff;
      }
      .eduquest-audio-status {
        position: absolute;
        right: 8px;
        bottom: calc(100% + 8px);
        width: max-content;
        max-width: min(330px, calc(100vw - 36px));
        padding: 8px 12px;
        border-radius: 10px;
        background: #241b3c;
        color: white;
        font: 500 13px/1.4 Inter, "Segoe UI", Arial, sans-serif;
      }
      .eduquest-audio-status:empty { display: none; }
      html[data-theme="dark"] .eduquest-audio {
        border-color: #49415f;
        background: rgba(34, 30, 48, .95);
      }
      html[data-theme="dark"] .eduquest-audio button {
        background: #302a47;
        color: #f3efff;
      }
      html[data-theme="dark"] .eduquest-audio button[aria-pressed="true"] {
        background: #684fe0;
      }
      @media (max-width: 480px) {
        .eduquest-audio { right: 10px; bottom: 10px; }
        .eduquest-audio button { padding: 8px 10px; font-size: 12px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .eduquest-audio * { scroll-behavior: auto !important; }
      }
    `;
    document.head.appendChild(style);

    const controls = document.createElement("div");
    controls.className = "eduquest-audio";
    controls.setAttribute("aria-label", "Game audio controls");
    controls.innerHTML = `
      <button type="button" data-audio="music" aria-pressed="false"></button>
      <button type="button" data-audio="effects" aria-pressed="false"></button>
      <div class="eduquest-audio-status" role="status" aria-live="polite"></div>
    `;
    controls.querySelector('[data-audio="music"]').addEventListener("click", toggleMusic);
    controls.querySelector('[data-audio="effects"]').addEventListener("click", () => {
      preferences.soundEffectsEnabled = !preferences.soundEffectsEnabled;
      savePreferences();
    });
    document.body.appendChild(controls);
    renderControls();
  }

  function renderControls() {
    const musicButton = document.querySelector(".eduquest-audio [data-audio='music']");
    const effectsButton = document.querySelector(".eduquest-audio [data-audio='effects']");
    if (!musicButton || !effectsButton) return;
    musicButton.textContent = preferences.musicEnabled ? "♫ Music: On" : "♫ Music: Off";
    musicButton.setAttribute("aria-pressed", String(preferences.musicEnabled));
    musicButton.setAttribute("aria-label", preferences.musicEnabled ? "Turn music off" : "Turn music on");
    effectsButton.textContent = preferences.soundEffectsEnabled ? "✧ Effects: On" : "✧ Effects: Off";
    effectsButton.setAttribute("aria-pressed", String(preferences.soundEffectsEnabled));
    effectsButton.setAttribute("aria-label", preferences.soundEffectsEnabled
      ? "Turn sound effects off"
      : "Turn sound effects on");
  }

  function showStatus(message) {
    const status = document.querySelector(".eduquest-audio-status");
    if (!status) return;
    status.textContent = message;
    window.clearTimeout(showStatus.timeout);
    showStatus.timeout = window.setTimeout(() => {
      status.textContent = "";
    }, 6000);
  }

  function getAudioContext() {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) {
      throw new Error("This browser does not support game audio.");
    }
    if (!audioContext) {
      audioContext = new AudioContextConstructor();
      musicBus = audioContext.createGain();
      musicBus.gain.value = getMusicGain();
      musicBus.connect(audioContext.destination);
    }
    return audioContext;
  }

  function getMusicGain() {
    return 0.24 * (preferences.musicVolume / 100);
  }

  function addTone(frequency, startAt, duration, volume, type, destination, attack) {
    const context = getAudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(volume, startAt + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    oscillator.connect(gain);
    gain.connect(destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.03);
    musicNodes.push(oscillator);
    oscillator.addEventListener("ended", () => {
      oscillator.disconnect();
      gain.disconnect();
      musicNodes = musicNodes.filter(node => node !== oscillator);
    }, { once: true });
  }

  function playMusicLoop() {
    if (!preferences.musicEnabled || !audioContext || audioContext.state !== "running") return;
    const beat = 60 / 76;
    const cycleDuration = beat * 16;
    const startAt = audioContext.currentTime + 0.08;
    const chords = [
      [261.63, 329.63, 392.0],
      [196.0, 246.94, 293.66],
      [220.0, 261.63, 329.63],
      [174.61, 220.0, 261.63]
    ];
    const melody = [
      523.25, 392.0, 440.0, 523.25,
      587.33, 523.25, 440.0, 392.0,
      440.0, 523.25, 659.25, 523.25,
      493.88, 440.0, 392.0, 329.63
    ];

    chords.forEach((chord, index) => {
      const chordStart = startAt + index * beat * 4;
      chord.forEach((frequency, noteIndex) => {
        addTone(frequency, chordStart + noteIndex * 0.025, beat * 3.8, 0.075, "sine", musicBus, 0.65);
      });
    });
    melody.forEach((frequency, index) => {
      addTone(frequency, startAt + index * beat, beat * 0.72, 0.18, "triangle", musicBus, 0.035);
    });
    loopTimer = window.setTimeout(playMusicLoop, cycleDuration * 1000);
  }

  async function startMusic() {
    const context = getAudioContext();
    await context.resume();
    if (context.state !== "running") {
      throw new Error("Audio is blocked by the browser. Use the page audio controls to try again.");
    }
    window.clearTimeout(loopTimer);
    playMusicLoop();
  }

  function stopMusic() {
    window.clearTimeout(loopTimer);
    if (!audioContext || !musicBus) return;
    const now = audioContext.currentTime;
    musicBus.gain.cancelScheduledValues(now);
    musicBus.gain.setTargetAtTime(0, now, 0.12);
    window.setTimeout(() => {
      if (musicBus && audioContext && audioContext.state === "running") {
        musicBus.gain.setValueAtTime(getMusicGain(), audioContext.currentTime);
      }
    }, 500);
  }

  async function toggleMusic() {
    preferences.musicEnabled = !preferences.musicEnabled;
    savePreferences();
    if (!preferences.musicEnabled) {
      stopMusic();
      showStatus("Music paused.");
      return;
    }
    try {
      await startMusic();
      showStatus("Music is playing. Your choice is saved.");
    } catch (error) {
      preferences.musicEnabled = false;
      savePreferences();
      console.error("EduQuest: Could not start background music.", error);
      showStatus(error.message);
    }
  }

  async function playCompletionSound() {
    if (!preferences.soundEffectsEnabled) return;
    try {
      const context = getAudioContext();
      await context.resume();
      if (context.state !== "running") {
        throw new Error("Browser audio is not available for this interaction.");
      }
      const now = context.currentTime;
      const effectBus = context.createGain();
      effectBus.gain.value = 0.4 * (preferences.soundEffectsVolume / 100);
      effectBus.connect(context.destination);
      [523.25, 659.25, 783.99].forEach((frequency, index) => {
        addTone(frequency, now + index * 0.11, 0.34, 0.24, "sine", effectBus, 0.025);
      });
      window.setTimeout(() => effectBus.disconnect(), 1000);
    } catch (error) {
      console.error("EduQuest: Could not play the quest completion sound.", error);
    }
  }

  window.EduQuestAudio = {
    getPreferences: () => ({ ...preferences }),
    setPreferences(next = {}) {
      if (typeof next.musicEnabled === "boolean") {
        preferences.musicEnabled = next.musicEnabled;
      }
      if (typeof next.soundEffectsEnabled === "boolean") {
        preferences.soundEffectsEnabled = next.soundEffectsEnabled;
      }
      if (next.musicVolume !== undefined) {
        preferences.musicVolume = normalizeVolume(next.musicVolume, DEFAULTS.musicVolume);
      }
      if (next.soundEffectsVolume !== undefined) {
        preferences.soundEffectsVolume = normalizeVolume(
          next.soundEffectsVolume,
          DEFAULTS.soundEffectsVolume
        );
      }
      savePreferences();
      if (musicBus && audioContext && audioContext.state === "running") {
        musicBus.gain.setTargetAtTime(getMusicGain(), audioContext.currentTime, 0.08);
      }
      if (preferences.musicEnabled) {
        startMusic().catch(error => {
          preferences.musicEnabled = false;
          savePreferences();
          console.error("EduQuest: Could not start background music.", error);
          showStatus("Tap Music to start audio. " + error.message);
        });
      } else {
        stopMusic();
      }
    }
  };

  window.addEventListener("eduquest-quest-completed", playCompletionSound);
  window.addEventListener("storage", event => {
    if (event.key === settingsKey) {
      preferences = loadPreferences();
      renderControls();
      if (preferences.musicEnabled) {
        startMusic().catch(error => {
          console.error("EduQuest: Could not resume background music.", error);
          showStatus(error.message);
        });
      } else {
        stopMusic();
      }
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createControls, { once: true });
  } else {
    createControls();
  }

  if (preferences.musicEnabled) {
    startMusic().catch(error => {
      console.info("EduQuest: Background music requires a play gesture in this browser.", error);
      showStatus("Tap Music to start audio.");
    });
  }
})();
