// ══════════════════════════════════════════════
//  NEON STRIKE — 완전 업그레이드 게임 엔진
// ══════════════════════════════════════════════

// ── 별 배경 ──────────────────────────────────
(function () {
    const sc = document.getElementById("star-canvas");
    const sx = sc.getContext("2d");
    let stars = [];

    function resize() {
        sc.width = window.innerWidth;
        sc.height = window.innerHeight;
        stars = [];
        for (let i = 0; i < 200; i++) {
            stars.push({
                x: Math.random() * sc.width,
                y: Math.random() * sc.height,
                r: Math.random() * 1.2 + 0.2,
                a: Math.random(),
                speed: Math.random() * 0.3 + 0.05,
                twinkle: Math.random() * Math.PI * 2,
            });
        }
    }

    function drawStars(t) {
        sx.clearRect(0, 0, sc.width, sc.height);
        stars.forEach((s) => {
            s.twinkle += s.speed * 0.04;
            const alpha = (Math.sin(s.twinkle) * 0.3 + 0.6) * s.a;
            sx.beginPath();
            sx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            sx.fillStyle = `rgba(200,230,255,${alpha})`;
            sx.fill();
        });
        requestAnimationFrame(drawStars);
    }

    window.addEventListener("resize", resize);
    resize();
    drawStars(0);
})();

// ── 게임 상수 ─────────────────────────────────
const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

// ── 곡 정의 ────────────────────────────────────
const SONGS = [
    {
        name: "Original Track",
        bpm: 142,
        chordRoots: [45, 50, 43, 48],
        src: null, // song.mp3 사용
        notesKey: "PRELOADED_NOTES",
    },
    {
        name: "ELECTRO PULSE",
        bpm: 160,
        chordRoots: [52, 55, 50, 57],
        src: null,
        notesKey: "ELECTRO_NOTES",
    },
    {
        name: "MIDNIGHT DRIFT",
        bpm: 95,
        chordRoots: [41, 43, 45, 48],
        src: null,
        notesKey: "DRIFT_NOTES",
    },
    {
        name: "INFERNO RUSH",
        bpm: 185,
        chordRoots: [36, 40, 43, 47],
        src: null,
        notesKey: "INFERNO_NOTES",
    },
];

// ── 곡별 노트 생성 함수 ─────────────────────────
function generateNotes(bpm, pattern) {
    const tpb = 96;
    const beatTicks = tpb;
    const notes = [];
    pattern.forEach(([beat, pitchOffset, durBeats]) => {
        const startTick = Math.round(beat * beatTicks);
        const endTick = Math.round((beat + (durBeats || 0.5)) * beatTicks);
        notes.push({ track: 0, start_tick: startTick, end_tick: endTick, pitch: 80 + pitchOffset, velocity: 100 });
    });
    return notes;
}

// ELECTRO PULSE — fast, dense 16th patterns
window.ELECTRO_NOTES = generateNotes(160, [
    [0, 7, 0.5],
    [0.5, 10, 0.5],
    [1, 5, 0.5],
    [1.5, 8, 0.5],
    [2, 12, 2],
    [4, 7, 0.5],
    [4.5, 5, 0.5],
    [5, 3, 0.5],
    [5.5, 7, 0.5],
    [6, 10, 0.5],
    [6.5, 12, 0.5],
    [7, 8, 2],
    [8, 5, 0.5],
    [8.25, 7, 0.5],
    [8.5, 10, 0.5],
    [8.75, 12, 0.5],
    [9, 14, 0.5],
    [9.5, 12, 0.5],
    [10, 10, 0.5],
    [10.5, 7, 0.5],
    [11, 5, 3],
    [14, 3, 0.5],
    [14.5, 5, 0.5],
    [15, 7, 0.5],
    [15.5, 10, 0.5],
    [16, 12, 2],
    [18, 7, 0.5],
    [18.5, 8, 0.5],
    [19, 10, 0.5],
    [19.5, 8, 0.5],
    [20, 7, 2],
    [22, 5, 0.5],
    [22.5, 7, 0.5],
    [23, 5, 0.5],
    [23.5, 3, 0.5],
    [24, 0, 4],
]);

// MIDNIGHT DRIFT — slow, long holds
window.DRIFT_NOTES = generateNotes(95, [
    [0, 5, 2],
    [2, 8, 1.5],
    [4, 10, 2],
    [6, 7, 1.5],
    [8, 12, 3],
    [12, 10, 2],
    [14, 8, 1.5],
    [16, 7, 2],
    [18, 5, 1.5],
    [20, 3, 2],
    [22, 5, 1.5],
    [24, 8, 4],
    [28, 10, 2],
    [30, 12, 2],
    [32, 10, 1.5],
    [34, 8, 2],
    [36, 7, 1.5],
    [38, 5, 2],
    [40, 3, 4],
]);

// INFERNO RUSH — blazing fast taps + some holds
window.INFERNO_NOTES = generateNotes(185, [
    [0, 7, 0.25],
    [0.25, 10, 0.25],
    [0.5, 12, 0.25],
    [0.75, 14, 0.25],
    [1, 10, 0.25],
    [1.25, 8, 0.25],
    [1.5, 7, 0.25],
    [1.75, 5, 0.25],
    [2, 3, 0.5],
    [2.5, 5, 0.5],
    [3, 7, 0.5],
    [3.5, 10, 0.5],
    [4, 12, 2],
    [6, 10, 0.25],
    [6.25, 8, 0.25],
    [6.5, 7, 0.25],
    [6.75, 5, 0.25],
    [7, 3, 0.25],
    [7.25, 5, 0.25],
    [7.5, 7, 0.25],
    [7.75, 10, 0.25],
    [8, 12, 0.5],
    [8.5, 14, 0.5],
    [9, 12, 0.5],
    [9.5, 10, 0.5],
    [10, 7, 1],
    [11, 5, 1],
    [12, 3, 2],
    [14, 14, 0.25],
    [14.25, 12, 0.25],
    [14.5, 10, 0.25],
    [14.75, 8, 0.25],
    [15, 7, 0.25],
    [15.25, 5, 0.25],
    [15.5, 3, 0.25],
    [15.75, 5, 0.25],
    [16, 7, 0.5],
    [16.5, 8, 0.5],
    [17, 10, 0.5],
    [17.5, 12, 0.5],
    [18, 14, 2],
    [20, 12, 0.25],
    [20.25, 10, 0.25],
    [20.5, 8, 0.25],
    [20.75, 7, 0.25],
    [21, 5, 2],
    [23, 3, 4],
]);

let selectedSongIdx = 0;

const BPM_BASE = 142;
let BPM = BPM_BASE;
let BEAT_SEC = 60 / BPM;
const LANE_COUNT = 3;
const LANE_WIDTH = 180;
const LANE_GAP = 16;
const TOTAL_LANE_WIDTH = LANE_COUNT * LANE_WIDTH + (LANE_COUNT - 1) * LANE_GAP;
const LANE_START_X = canvas.width / 2 - TOTAL_LANE_WIDTH / 2;

const JUDGE_Y = canvas.height - 80;
const NOTE_SPEED_BASE = 380;
let NOTE_SPEED = NOTE_SPEED_BASE;
const SPAWN_OFFSET = BEAT_SEC * 4.5;
const NOTE_W = 130;
const NOTE_H = 22;
const HOLD_MIN_TICKS = 192; // 롱 노트 최소 길이 (ticks)

const LANE_COLORS = ["#ff2d78", "#00f5ff", "#b44dff"];
const LANE_COLORS_GLOW = ["rgba(255,45,120,", "rgba(0,245,255,", "rgba(180,77,255,"];

const WINDOWS = { perfect: 0.044, great: 0.088, good: 0.14, miss: 0.22 };

const laneKeys = ["A", "S", "D"];
const keyEls = [document.getElementById("keyA"), document.getElementById("keyS"), document.getElementById("keyD")];

// ── HUD 엘리먼트 ──────────────────────────────
const bpmEl = document.getElementById("bpm");
const comboEl = document.getElementById("combo");
const scoreEl = document.getElementById("score");
const accuracyEl = document.getElementById("accuracy");
const lifeEl = document.getElementById("life");
const messageEl = document.getElementById("message");
const startBtn = document.getElementById("startBtn");

// ── 오디오 ─────────────────────────────────────
let audioCtx, masterGain, musicGain, sfxGain;
const musicAudio = new Audio("assets/song.mp3");
musicAudio.preload = "auto";

// ── 게임 상태 ──────────────────────────────────
const state = {
    running: false,
    startTime: 0,
    lastFrame: 0,
    chart: [],
    notes: [],
    nextIndex: 0,
    songDuration: 0,
    chartReady: false,
    notesReady: false,
    notesLoading: false,
    bpm: BPM,
    lastPulseBeat: -1,
    score: 0,
    combo: 0,
    maxCombo: 0,
    life: 100,
    totalHit: 0,
    weightedHit: 0,
    counts: { perfect: 0, great: 0, good: 0, miss: 0 },
    judgeText: "READY",
    judgeTimer: 0,
    judgeKind: "",
    finished: false,
    audioStartTime: 0,
    nextScheduledBeat: 0,
    nextScheduledNoteAudio: 0,
    chordRoots: [45, 50, 43, 48],
    hitFlash: 0,
    laneFlash: [0, 0, 0],
    cameraShake: 0,
    beatPulse: 0,
    particles: [],
    comboParticles: [],
    keyDown: [false, false, false],
    lastHitLane: null,
    musicBuffer: null,
    musicReady: false,
    musicSource: null,
    combo100Celebrated: false,
    combo50Celebrated: false,
    multiplier: 1,
    screenFlash: { r: 0, g: 0, b: 0, a: 0 },
    bgPulseHue: 220,
    // ── 피버 모드 ──
    feverGauge: 0, // 0~100
    feverActive: false,
    feverTimer: 0, // 피버 지속 시간
    consecutivePerfect: 0,
    // ── 홀드 노트 ──
    holdActive: [false, false, false], // 각 레인 홀드 중?
};

// ── 유틸 ──────────────────────────────────────
function midiToFreq(midi) {
    return 440 * 2 ** ((midi - 69) / 12);
}
function lerp(a, b, t) {
    return a + (b - a) * t;
}

function ensureAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
        masterGain = audioCtx.createGain();
        musicGain = audioCtx.createGain();
        sfxGain = audioCtx.createGain();
        masterGain.gain.value = 0.9;
        musicGain.gain.value = 0.38;
        sfxGain.gain.value = 0.35;
        musicGain.connect(masterGain);
        sfxGain.connect(masterGain);
        masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
}

function scheduleTone({ time, duration, freq, type = "sawtooth", gain = 0.1, target }) {
    if (!target) target = musicGain;
    const osc = audioCtx.createOscillator();
    const amp = audioCtx.createGain();
    const filt = audioCtx.createBiquadFilter();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    filt.type = "lowpass";
    filt.frequency.value = 2200;
    filt.Q.value = 0.8;
    amp.gain.setValueAtTime(0.0001, time);
    amp.gain.exponentialRampToValueAtTime(gain, time + 0.008);
    amp.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    osc.connect(filt);
    filt.connect(amp);
    amp.connect(target);
    osc.start(time);
    osc.stop(time + duration + 0.02);
}

function scheduleKick(time) {
    const osc = audioCtx.createOscillator();
    const amp = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.1);
    amp.gain.setValueAtTime(0.0001, time);
    amp.gain.exponentialRampToValueAtTime(0.28, time + 0.004);
    amp.gain.exponentialRampToValueAtTime(0.0001, time + 0.13);
    osc.connect(amp);
    amp.connect(musicGain);
    osc.start(time);
    osc.stop(time + 0.15);
}

function scheduleNoise(time, open = false) {
    const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.12, audioCtx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = audioCtx.createBufferSource();
    const bp = audioCtx.createBiquadFilter();
    const amp = audioCtx.createGain();
    src.buffer = buf;
    bp.type = "highpass";
    bp.frequency.value = 7000;
    const len = open ? 0.1 : 0.042;
    amp.gain.setValueAtTime(0.0001, time);
    amp.gain.exponentialRampToValueAtTime(0.065, time + 0.003);
    amp.gain.exponentialRampToValueAtTime(0.0001, time + len);
    src.connect(bp);
    bp.connect(amp);
    amp.connect(musicGain);
    src.start(time);
    src.stop(time + len + 0.02);
}

function scheduleSnare(time) {
    const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.18, audioCtx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = audioCtx.createBufferSource();
    const bp = audioCtx.createBiquadFilter();
    const amp = audioCtx.createGain();
    src.buffer = buf;
    bp.type = "bandpass";
    bp.frequency.value = 2000;
    bp.Q.value = 0.9;
    amp.gain.setValueAtTime(0.0001, time);
    amp.gain.exponentialRampToValueAtTime(0.14, time + 0.003);
    amp.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);
    src.connect(bp);
    bp.connect(amp);
    amp.connect(musicGain);
    src.start(time);
    src.stop(time + 0.14);
}

function playHitSfx(lane) {
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    const freqs = [880, 1046.5, 1318.5];
    const f = freqs[lane] || 1046.5;
    scheduleTone({ time: t, duration: 0.06, freq: f, type: "square", gain: 0.055, target: sfxGain });
    scheduleTone({ time: t + 0.015, duration: 0.07, freq: f * 1.5, type: "triangle", gain: 0.035, target: sfxGain });
}

function playMissSfx() {
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    scheduleTone({ time: t, duration: 0.12, freq: 180, type: "sawtooth", gain: 0.04, target: sfxGain });
}

function playCelebrationSfx() {
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    [523, 659, 784, 1046].forEach((f, i) => {
        scheduleTone({ time: t + i * 0.06, duration: 0.12, freq: f, type: "triangle", gain: 0.06, target: sfxGain });
    });
}

// ── 노트 데이터 ────────────────────────────────
function quantile(vals, q) {
    if (!vals.length) return 0;
    const sorted = [...vals].sort((a, b) => a - b);
    return sorted[Math.max(0, Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * q)))];
}

function buildChartFromNotes(rawNotes, tpb = 96) {
    if (!rawNotes?.length) return [];
    const notesSec = rawNotes.map((n) => ({
        pitch: n.pitch,
        start: (n.start_tick / tpb) * BEAT_SEC,
        duration: ((n.end_tick - n.start_tick) / tpb) * BEAT_SEC,
        isHold: n.end_tick - n.start_tick >= HOLD_MIN_TICKS,
    }));
    const pitches = notesSec.map((n) => n.pitch);
    const qLow = quantile(pitches, 0.33);
    const qHigh = quantile(pitches, 0.66);
    return notesSec.map((n) => ({
        lane: n.pitch < qLow ? 0 : n.pitch < qHigh ? 1 : 2,
        hitTime: Math.max(0, n.start),
        endTime: Math.max(0, n.start) + (n.isHold ? n.duration : 0),
        type: n.isHold ? "hold" : "tap",
    }));
}

async function loadNotesChart() {
    if (state.notesLoading || state.notesReady) return;
    state.notesLoading = true;
    try {
        const song = SONGS[selectedSongIdx];
        // BPM 업데이트
        BPM = song.bpm;
        BEAT_SEC = 60 / BPM;
        NOTE_SPEED = NOTE_SPEED_BASE;
        state.bpm = BPM;
        state.chordRoots = song.chordRoots;

        const json = window[song.notesKey] || (typeof PRELOADED_NOTES !== "undefined" ? PRELOADED_NOTES : null);
        if (!json) throw new Error("no notes");
        state.chart = buildChartFromNotes(json, 96);
        state.chartReady = true;
        state.notesReady = true;
    } catch {
        state.chart = [];
        state.chartReady = true;
        state.notesReady = true;
    }
    state.notesLoading = false;
    updateHud();
}

async function preloadMusic() {
    if (state.musicReady) return;
    try {
        ensureAudio();
    } catch {}
    if (audioCtx) {
        try {
            const resp = await fetch("song.mp3");
            const ab = await resp.arrayBuffer();
            const buf = await audioCtx.decodeAudioData(ab);
            state.musicBuffer = buf;
            state.songDuration = buf.duration;
            state.musicReady = true;
            return;
        } catch {}
    }
    try {
        musicAudio.load();
    } catch {}
}

// ── 파티클 ────────────────────────────────────
function spawnHitParticles(strength, lane) {
    const count = 12 + Math.floor(strength * 10);
    const bx = getLaneX(lane) + LANE_WIDTH / 2;
    const col = LANE_COLORS[lane];
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const speed = 140 + Math.random() * 250 * strength;
        state.particles.push({
            x: bx,
            y: JUDGE_Y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 60,
            life: 0.3 + Math.random() * 0.25,
            maxLife: 0.55,
            size: 2 + Math.random() * 3.5,
            color: col,
        });
    }
}

function spawnComboText(text, x, y, color) {
    state.comboParticles.push({ text, x, y, color, life: 0.7, maxLife: 0.7, vy: -1.5 });
}

// ── 상태 리셋 ──────────────────────────────────
function resetState() {
    state.running = true;
    state.startTime = performance.now() / 1000;
    state.lastFrame = state.startTime;
    state.chart = state.chartReady && state.chart.length ? [...state.chart] : [];
    state.notes = [];
    state.nextIndex = 0;
    state.score = 0;
    state.combo = 0;
    state.maxCombo = 0;
    state.life = 100;
    state.totalHit = 0;
    state.weightedHit = 0;
    state.counts = { perfect: 0, great: 0, good: 0, miss: 0 };
    state.judgeText = "START";
    state.judgeTimer = 0.5;
    state.judgeKind = "start";
    state.finished = false;
    state.nextScheduledBeat = 0;
    state.nextScheduledNoteAudio = 0;
    state.lastPulseBeat = -1;
    state.hitFlash = 0;
    state.laneFlash = [0, 0, 0];
    state.cameraShake = 0;
    state.beatPulse = 0;
    state.particles = [];
    state.comboParticles = [];
    state.keyDown = [false, false, false];
    state.lastHitLane = null;
    state.combo100Celebrated = false;
    state.combo50Celebrated = false;
    state.multiplier = 1;
    state.screenFlash = { r: 0, g: 0, b: 0, a: 0 };
    // 피버
    state.feverGauge = 0;
    state.feverActive = false;
    state.feverTimer = 0;
    state.consecutivePerfect = 0;
    // 홀드
    state.holdActive = [false, false, false];
    document.getElementById("fever-bar-fill").style.width = "0%";
    document.getElementById("fever-active-label").classList.remove("on");
}

// ── HUD 업데이트 ──────────────────────────────
function updateHud() {
    bpmEl.textContent = String(Math.round(state.bpm));
    comboEl.textContent = String(state.combo);
    const isBig = state.combo >= 50;
    comboEl.className = "hud-value" + (isBig ? " combo-big" : "");
    scoreEl.textContent = String(state.score);
    lifeEl.textContent = String(Math.max(0, Math.floor(state.life)));
    const acc = state.totalHit === 0 ? 100 : (state.weightedHit / state.totalHit) * 100;
    accuracyEl.textContent = acc.toFixed(1) + "%";
}

// ── 시간 ─────────────────────────────────────
function getSongTime() {
    if (state.running && audioCtx && Number.isFinite(state.audioStartTime)) {
        return Math.max(0, audioCtx.currentTime - state.audioStartTime);
    }
    if (state.running && musicAudio.currentTime > 0) return musicAudio.currentTime;
    return performance.now() / 1000 - state.startTime;
}

// ── 노트 스폰 ─────────────────────────────────
function spawnNotes(songTime) {
    while (state.nextIndex < state.chart.length) {
        const t = state.chart[state.nextIndex];
        if (t.hitTime - SPAWN_OFFSET > songTime) break;
        state.notes.push({ ...t, judgedStart: false, completed: false, failed: false, active: false });
        state.nextIndex++;
    }
}

// ── 판정 ──────────────────────────────────────
function getMultiplier(combo) {
    if (combo >= 100) return 2.0;
    if (combo >= 50) return 1.5;
    if (combo >= 20) return 1.2;
    return 1.0;
}

function pushJudge(text, lifeDelta = 0, kind = "") {
    state.judgeText = text;
    state.judgeTimer = 0.35;
    state.judgeKind = kind;
    state.life = Math.max(0, Math.min(100, state.life + lifeDelta));
}

function applyJudge(kind, lane = null) {
    state.totalHit++;
    state.lastHitLane = lane;
    state.multiplier = getMultiplier(state.combo);

    if (kind === "PERFECT") {
        state.counts.perfect++;
        const pts = Math.round((1000 + state.combo * 2) * state.multiplier);
        state.score += pts;
        state.combo++;
        state.weightedHit += 1;
        pushJudge("PERFECT", +1.5, "perfect");
        if (lane !== null) {
            state.laneFlash[lane] = 1.1;
        }
        state.cameraShake = 6;
        state.beatPulse = Math.max(state.beatPulse, 0.6);
        spawnHitParticles(1.1, lane !== null ? lane : 0);
        state.screenFlash = { r: 0, g: 220, b: 255, a: 0.12 };
    } else if (kind === "GREAT") {
        state.counts.great++;
        const pts = Math.round((700 + state.combo) * state.multiplier);
        state.score += pts;
        state.combo++;
        state.weightedHit += 0.75;
        pushJudge("GREAT", +0.7, "great");
        if (lane !== null) {
            state.laneFlash[lane] = 0.85;
        }
        state.cameraShake = 4;
        spawnHitParticles(0.85, lane !== null ? lane : 0);
    } else if (kind === "GOOD") {
        state.counts.good++;
        state.score += Math.round(400 * state.multiplier);
        state.combo++;
        state.weightedHit += 0.45;
        pushJudge("GOOD", +0.15, "good");
        if (lane !== null) {
            state.laneFlash[lane] = 0.6;
        }
        state.cameraShake = 2;
        spawnHitParticles(0.6, lane !== null ? lane : 0);
    } else {
        state.counts.miss++;
        state.combo = 0;
        state.multiplier = 1;
        pushJudge("MISS", -9, "miss");
        state.cameraShake = 3;
        state.screenFlash = { r: 255, g: 30, b: 70, a: 0.1 };
        playMissSfx();
    }

    if (state.combo > state.maxCombo) state.maxCombo = state.combo;

    // 피버 게이지 업데이트
    if (kind === "PERFECT") {
        state.consecutivePerfect++;
        state.feverGauge = Math.min(100, state.feverGauge + 8);
        if (state.feverGauge >= 100 && !state.feverActive) {
            state.feverActive = true;
            state.feverTimer = 8; // 8초 피버
            document.getElementById("fever-active-label").classList.add("on");
            spawnComboText("🔥 FEVER!", canvas.width / 2, JUDGE_Y - 160, "#ffd700");
            state.screenFlash = { r: 255, g: 200, b: 0, a: 0.18 };
            state.cameraShake = 16;
            playCelebrationSfx();
        }
    } else if (kind === "MISS") {
        state.consecutivePerfect = 0;
        state.feverGauge = Math.max(0, state.feverGauge - 20);
        if (state.feverActive) {
            state.feverActive = false;
            state.feverTimer = 0;
            NOTE_SPEED = NOTE_SPEED_BASE;
            document.getElementById("fever-active-label").classList.remove("on");
        }
    } else {
        state.consecutivePerfect = 0;
        state.feverGauge = Math.max(0, state.feverGauge - 5);
    }
    if (!state.feverActive) {
        document.getElementById("fever-bar-fill").style.width = state.feverGauge + "%";
    }

    // 콤보 마일스톤
    if (state.combo === 50 && !state.combo50Celebrated) {
        state.combo50Celebrated = true;
        playCelebrationSfx();
        spawnComboText("50 COMBO!", canvas.width / 2, JUDGE_Y - 120, "#ffd700");
    }
    if (state.combo === 100 && !state.combo100Celebrated) {
        state.combo100Celebrated = true;
        playCelebrationSfx();
        spawnComboText("100 COMBO!!", canvas.width / 2, JUDGE_Y - 120, "#00f5ff");
        state.cameraShake = 14;
    }

    updateHud();
}

function failNote(note) {
    if (note.completed || note.failed) return;
    note.failed = true;
    applyJudge("MISS");
}

function handleMissByTime(songTime) {
    state.notes.forEach((n) => {
        if (n.completed || n.failed || n.active) return;
        if (songTime - n.hitTime > WINDOWS.miss) failNote(n);
    });
    state.notes = state.notes.filter((n) => {
        if (n.failed) return songTime - n.hitTime < 1.0;
        if (n.completed) return songTime - n.hitTime < 0.9;
        return true;
    });
}

function findTarget(lane, songTime) {
    return state.notes.find(
        (n) =>
            n.lane === lane && !n.completed && !n.failed && !n.active && Math.abs(songTime - n.hitTime) <= WINDOWS.miss,
    );
}

function onLanePress(lane) {
    if (!state.running) return;
    const st = getSongTime();
    const target = findTarget(lane, st);
    if (!target) {
        applyJudge("MISS", lane);
        return;
    }
    playHitSfx(lane);
    const delta = Math.abs(st - target.hitTime);
    if (delta <= WINDOWS.perfect) {
        if (target.type === "hold") {
            target.active = true;
            state.holdActive[lane] = true;
            applyJudge("PERFECT", lane);
        } else {
            target.completed = true;
            applyJudge("PERFECT", lane);
        }
    } else if (delta <= WINDOWS.great) {
        if (target.type === "hold") {
            target.active = true;
            state.holdActive[lane] = true;
            applyJudge("GREAT", lane);
        } else {
            target.completed = true;
            applyJudge("GREAT", lane);
        }
    } else if (delta <= WINDOWS.good) {
        if (target.type === "hold") {
            target.active = true;
            state.holdActive[lane] = true;
            applyJudge("GOOD", lane);
        } else {
            target.completed = true;
            applyJudge("GOOD", lane);
        }
    } else {
        applyJudge("MISS", lane);
    }
}

function onLaneRelease(lane) {
    if (!state.running) return;
    const st = getSongTime();
    const holdNote = state.notes.find(
        (n) => n.lane === lane && n.type === "hold" && n.active && !n.completed && !n.failed,
    );
    if (holdNote) {
        const remaining = holdNote.endTime - st;
        if (remaining > 0.1) {
            // 너무 일찍 놓음 → MISS
            holdNote.failed = true;
            state.holdActive[lane] = false;
            applyJudge("MISS", lane);
        } else {
            // 정상 완료
            holdNote.completed = true;
            state.holdActive[lane] = false;
            applyJudge("PERFECT", lane);
        }
    } else {
        state.holdActive[lane] = false;
    }
}

// ── 레인 X 좌표 ───────────────────────────────
function getLaneX(lane) {
    return LANE_START_X + lane * (LANE_WIDTH + LANE_GAP);
}

// ── 음악 스케줄링 ─────────────────────────────
function scheduleMusic(songTime) {
    if (!audioCtx) return;
    const ahead = 0.22;
    const nowAudio = audioCtx.currentTime;

    while (state.nextScheduledBeat * BEAT_SEC < songTime + ahead) {
        const beat = state.nextScheduledBeat;
        const t = state.audioStartTime + beat * BEAT_SEC;
        if (t < nowAudio - 0.02) {
            state.nextScheduledBeat++;
            continue;
        }
        const bb = beat % 4;
        if (bb === 0 || bb === 2) scheduleKick(t);
        if (bb === 1 || bb === 3) scheduleSnare(t);
        scheduleNoise(t + BEAT_SEC * 0.5, bb === 3);

        const root = state.chordRoots[Math.floor(beat / 4) % state.chordRoots.length];
        if (bb === 0) {
            scheduleTone({ time: t, duration: BEAT_SEC * 3.5, freq: midiToFreq(root), type: "triangle", gain: 0.055 });
            scheduleTone({
                time: t,
                duration: BEAT_SEC * 3.5,
                freq: midiToFreq(root + 7),
                type: "triangle",
                gain: 0.03,
            });
            scheduleTone({
                time: t,
                duration: BEAT_SEC * 3.5,
                freq: midiToFreq(root + 12),
                type: "triangle",
                gain: 0.025,
            });
        }
        state.beatPulse = Math.max(state.beatPulse, 0.4);
        state.nextScheduledBeat++;
    }

    while (state.nextScheduledNoteAudio < state.chart.length) {
        const note = state.chart[state.nextScheduledNoteAudio];
        if (note.hitTime > songTime + ahead) break;
        const t = state.audioStartTime + note.hitTime;
        if (t >= nowAudio - 0.02) {
            const laneOffsets = [0, 4, 7];
            const midi = 74 + laneOffsets[note.lane];
            scheduleTone({ time: t, duration: BEAT_SEC * 0.2, freq: midiToFreq(midi), type: "square", gain: 0.03 });
        }
        state.nextScheduledNoteAudio++;
    }
}

// ── 파티클 업데이트 ───────────────────────────
function updateParticles(dt) {
    const damp = Math.exp(-3 * dt);
    for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.life -= dt;
        p.vx *= damp;
        p.vy = p.vy * damp + 440 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.life <= 0) state.particles.splice(i, 1);
    }
    for (let i = state.comboParticles.length - 1; i >= 0; i--) {
        const c = state.comboParticles[i];
        c.life -= dt;
        c.y += c.vy;
        if (c.life <= 0) state.comboParticles.splice(i, 1);
    }
}

// ── 둥근 사각형 ───────────────────────────────
function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
}

// ── 라이프 바 ─────────────────────────────────
function drawLifeBar() {
    const bx = 16,
        by = canvas.height - 18;
    const bw = canvas.width - 32,
        bh = 6;
    const pct = state.life / 100;

    ctx.fillStyle = "rgba(255,255,255,0.07)";
    roundRect(bx, by, bw, bh, 3);
    ctx.fill();

    const lifeColor = pct > 0.5 ? "#00f5ff" : pct > 0.25 ? "#ffd700" : "#ff2d78";
    const lg = ctx.createLinearGradient(bx, by, bx + bw * pct, by);
    lg.addColorStop(0, lifeColor + "aa");
    lg.addColorStop(1, lifeColor);
    ctx.fillStyle = lg;
    roundRect(bx, by, bw * pct, bh, 3);
    ctx.fill();

    if (pct <= 0.25) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#ff2d78";
        roundRect(bx, by, bw * pct, bh, 3);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// ── 멀티플라이어 표시 ─────────────────────────
function drawMultiplier() {
    if (state.multiplier <= 1) return;
    const mx = state.multiplier;
    const col = mx >= 2.0 ? "#ffd700" : mx >= 1.5 ? "#ff2d78" : "#b44dff";
    ctx.save();
    ctx.font = "bold 13px 'Orbitron', sans-serif";
    ctx.fillStyle = col;
    ctx.shadowBlur = 10;
    ctx.shadowColor = col;
    ctx.textAlign = "right";
    ctx.fillText(`×${mx.toFixed(1)}`, canvas.width - 16, 28);
    ctx.restore();
}

// ── 진행 바 ───────────────────────────────────
function drawProgressBar(songTime) {
    if (!state.chart.length) return;
    const last = state.chart[state.chart.length - 1].hitTime + 1;
    const pct = Math.min(1, songTime / last);
    const bx = 16,
        by = 10,
        bw = canvas.width - 32,
        bh = 3;
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    roundRect(bx, by, bw, bh, 1.5);
    ctx.fill();
    const pg = ctx.createLinearGradient(bx, by, bx + bw * pct, by);
    pg.addColorStop(0, "#b44dff88");
    pg.addColorStop(1, "#00f5ff");
    ctx.fillStyle = pg;
    roundRect(bx, by, bw * pct, bh, 1.5);
    ctx.fill();
}

// ── 메인 드로우 ───────────────────────────────
function drawStage(songTime) {
    const shake = state.cameraShake;
    const ox = shake > 0 ? (Math.random() * 2 - 1) * shake : 0;
    const oy = shake > 0 ? (Math.random() * 2 - 1) * shake * 0.55 : 0;

    ctx.save();
    ctx.translate(ox, oy);

    // 배경
    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, "#040610");
    bg.addColorStop(0.55, "#071020");
    bg.addColorStop(1, "#020508");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 비트 펄스 배경
    if (state.beatPulse > 0) {
        const pw = canvas.width * 1.2;
        const pg = ctx.createRadialGradient(canvas.width / 2, JUDGE_Y, 0, canvas.width / 2, JUDGE_Y, pw);
        pg.addColorStop(0, `rgba(0,180,255,${0.1 * state.beatPulse})`);
        pg.addColorStop(0.6, `rgba(80,0,160,${0.04 * state.beatPulse})`);
        pg.addColorStop(1, "transparent");
        ctx.fillStyle = pg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 진행 바
    drawProgressBar(songTime);

    // 레인 그리기
    for (let lane = 0; lane < LANE_COUNT; lane++) {
        const lx = getLaneX(lane);
        const col = LANE_COLORS[lane];
        const colGlow = LANE_COLORS_GLOW[lane];
        const isDown = state.keyDown[lane];
        const lf = state.laneFlash[lane];

        // 레인 배경
        ctx.fillStyle = `rgba(255,255,255,${isDown ? 0.04 : 0.015})`;
        ctx.fillRect(lx, 18, LANE_WIDTH, JUDGE_Y - 18);

        // 레인 글로우 (히트 시)
        if (lf > 0) {
            const lg = ctx.createLinearGradient(lx, JUDGE_Y, lx, 18);
            lg.addColorStop(0, colGlow + 0.45 * lf + ")");
            lg.addColorStop(0.5, colGlow + 0.1 * lf + ")");
            lg.addColorStop(1, "transparent");
            ctx.fillStyle = lg;
            ctx.fillRect(lx, 18, LANE_WIDTH, JUDGE_Y - 18);
        }

        // 레인 경계선 (글로우 포함)
        ctx.shadowBlur = isDown ? 15 : 4;
        ctx.shadowColor = col;
        ctx.strokeStyle = isDown ? col : col + "55";
        ctx.lineWidth = isDown ? 1.5 : 0.8;
        ctx.strokeRect(lx, 18, LANE_WIDTH, JUDGE_Y - 18);
        ctx.shadowBlur = 0;

        // 판정선
        const jy = JUDGE_Y;
        ctx.save();
        if (isDown) {
            ctx.shadowBlur = 25;
            ctx.shadowColor = col;
        }
        const jGrad = ctx.createLinearGradient(lx, jy, lx + LANE_WIDTH, jy);
        jGrad.addColorStop(0, "transparent");
        jGrad.addColorStop(0.5, isDown ? col : col + "88");
        jGrad.addColorStop(1, "transparent");
        ctx.fillStyle = jGrad;
        ctx.fillRect(lx, jy - (isDown ? 2 : 1), LANE_WIDTH, isDown ? 5 : 2);
        ctx.shadowBlur = 0;
        ctx.restore();

        // 키 라벨
        ctx.font = `bold 16px 'Orbitron', sans-serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = isDown ? col : col + "88";
        ctx.shadowBlur = isDown ? 12 : 0;
        ctx.shadowColor = col;
        ctx.fillText(laneKeys[lane], lx + LANE_WIDTH / 2, JUDGE_Y + 30);
        ctx.shadowBlur = 0;
    }

    // ── 노트 그리기 ──────────────────────────
    state.notes.forEach((note) => {
        if (note.completed || note.failed) return;
        const lx = getLaneX(note.lane);
        const yHead = JUDGE_Y - (note.hitTime - songTime) * NOTE_SPEED;
        if (yHead < -300 || yHead > canvas.height + 60) return;

        const nw = NOTE_W;
        const nh = NOTE_H;
        const nx = lx + (LANE_WIDTH - nw) / 2;
        const ny = yHead - nh / 2;
        const col = LANE_COLORS[note.lane];
        const cg = LANE_COLORS_GLOW[note.lane];

        // ── 홀드 노트 꼬리 그리기 ──
        if (note.type === "hold") {
            const holdDuration = note.endTime - note.hitTime;
            const yTail = JUDGE_Y - (note.endTime - songTime) * NOTE_SPEED;
            const tailTop = Math.max(18, Math.min(yTail, yHead - nh));
            const tailBot = Math.min(JUDGE_Y, yHead);
            if (tailBot > tailTop) {
                // 꼬리 배경
                const tg = ctx.createLinearGradient(0, tailTop, 0, tailBot);
                tg.addColorStop(0, col + "99");
                tg.addColorStop(1, col + "33");
                ctx.fillStyle = tg;
                ctx.shadowBlur = 10;
                ctx.shadowColor = col;
                roundRect(nx + nw * 0.35, tailTop, nw * 0.3, tailBot - tailTop, 4);
                ctx.fill();
                // 꼬리 테두리선
                ctx.strokeStyle = col + "aa";
                ctx.lineWidth = 1;
                roundRect(nx + nw * 0.35, tailTop, nw * 0.3, tailBot - tailTop, 4);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }

        // 접근도 (판정선에 가까울수록 밝아짐)
        const dist = Math.abs(note.hitTime - songTime);
        const proximity = Math.max(0, 1 - dist / 0.5);

        // 노트 글로우
        ctx.shadowBlur = 8 + proximity * 20;
        ctx.shadowColor = col;

        // 홀드 활성 중인 경우 머리 강조
        const isHoldActive = note.type === "hold" && note.active;
        if (isHoldActive) {
            ctx.shadowBlur = 30;
            ctx.shadowColor = "#ffd700";
        }

        // 노트 바디
        const ng = ctx.createLinearGradient(nx, ny, nx, ny + nh);
        ng.addColorStop(0, "#ffffff");
        ng.addColorStop(0.15, col + "ee");
        ng.addColorStop(1, col + "55");
        ctx.fillStyle = ng;
        roundRect(nx, ny, nw, nh, 5);
        ctx.fill();

        // 홀드 노트 표시 [HOLD]
        if (note.type === "hold" && !note.active) {
            ctx.save();
            ctx.font = "bold 9px 'Orbitron', sans-serif";
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.shadowBlur = 0;
            ctx.fillText("HOLD", nx + nw / 2, ny + nh - 5);
            ctx.restore();
        }

        // 노트 상단 하이라이트
        ctx.strokeStyle = "rgba(255,255,255," + (0.6 + proximity * 0.4) + ")";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(nx + 10, ny + 4);
        ctx.lineTo(nx + nw - 10, ny + 4);
        ctx.stroke();

        // 판정선 근접 시 추가 링 이펙트
        if (proximity > 0.7) {
            ctx.strokeStyle = col;
            ctx.lineWidth = 1;
            ctx.globalAlpha = (proximity - 0.7) * 3;
            roundRect(nx - 3, ny - 3, nw + 6, nh + 6, 7);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        ctx.shadowBlur = 0;
    });

    // ── 파티클 ───────────────────────────────
    state.particles.forEach((p) => {
        const a = Math.max(0, p.life / p.maxLife);
        ctx.fillStyle =
            p.color +
            Math.floor(a * 255)
                .toString(16)
                .padStart(2, "0");
        ctx.shadowBlur = 8 * a;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.shadowBlur = 0;

    // 콤보 텍스트 파티클
    state.comboParticles.forEach((c) => {
        const a = Math.min(1, (c.life / c.maxLife) * 2);
        ctx.save();
        ctx.globalAlpha = a;
        ctx.font = "bold 24px 'Orbitron', sans-serif";
        ctx.fillStyle = c.color;
        ctx.shadowBlur = 16;
        ctx.shadowColor = c.color;
        ctx.textAlign = "center";
        ctx.fillText(c.text, c.x, c.y);
        ctx.restore();
    });

    // ── 판정 텍스트 ──────────────────────────
    if (state.judgeTimer > 0) {
        const scale = 1 + state.judgeTimer * 0.15;
        ctx.save();
        ctx.translate(canvas.width / 2, JUDGE_Y - 65);
        ctx.scale(scale, scale);
        ctx.font = "italic bold 40px 'Orbitron', sans-serif";
        ctx.textAlign = "center";

        const cols = {
            perfect: "#00f5ff",
            great: "#ffd700",
            good: "#39ff14",
            miss: "#ff2d78",
            start: "#ffffff",
        };
        const c = cols[state.judgeKind] || "#ffffff";
        ctx.fillStyle = c;
        ctx.shadowBlur = 20;
        ctx.shadowColor = c;
        ctx.fillText(state.judgeText, 0, 0);

        // 판정 서브텍스트 (멀티플라이어)
        if (state.judgeKind !== "miss" && state.multiplier > 1) {
            ctx.font = "12px 'Orbitron', sans-serif";
            ctx.fillStyle = "rgba(255,255,255,0.6)";
            ctx.shadowBlur = 0;
            ctx.fillText(`×${state.multiplier.toFixed(1)}`, 0, 22);
        }
        ctx.restore();
    }

    // ── 화면 플래시 ──────────────────────────
    if (state.screenFlash.a > 0) {
        const { r, g, b, a } = state.screenFlash;
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // ── 피버 모드 가장자리 글로우 ─────────────
    if (state.feverActive) {
        const feverRatio = Math.max(0, state.feverTimer / 8);
        const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 120);
        const edgeAlpha = (0.3 + pulse * 0.2) * feverRatio;
        const eg = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            canvas.height * 0.3,
            canvas.width / 2,
            canvas.height / 2,
            canvas.width * 0.9,
        );
        eg.addColorStop(0, "transparent");
        eg.addColorStop(0.8, `rgba(255,150,0,0)`);
        eg.addColorStop(1, `rgba(255,80,0,${edgeAlpha})`);
        ctx.fillStyle = eg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // FEVER 텍스트 오른쪽 상단
        ctx.save();
        ctx.font = "bold 11px 'Orbitron', sans-serif";
        ctx.fillStyle = `rgba(255,200,0,${0.7 + pulse * 0.3})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#ff8c00";
        ctx.textAlign = "right";
        ctx.fillText("🔥 FEVER MODE", canvas.width - 16, 44);
        ctx.restore();
    }

    // ── 멀티플라이어 표시 ─────────────────────
    drawMultiplier();

    // ── 라이프 바 ─────────────────────────────
    drawLifeBar();

    ctx.restore();
}

// ── 결과 화면 ─────────────────────────────────
function getGrade(acc) {
    if (acc >= 99) return "SS";
    if (acc >= 95) return "S";
    if (acc >= 88) return "A";
    if (acc >= 78) return "B";
    if (acc >= 65) return "C";
    return "F";
}

function showResultScreen(clear) {
    const acc = state.totalHit === 0 ? 100 : (state.weightedHit / state.totalHit) * 100;
    const grade = clear ? getGrade(acc) : "F";

    document.getElementById("result-grade").textContent = grade;
    document.getElementById("result-grade").className = "result-grade " + grade;
    document.getElementById("result-title").textContent = clear ? "— STAGE CLEAR —" : "— STAGE FAILED —";
    document.getElementById("res-perfect").textContent = state.counts.perfect;
    document.getElementById("res-great").textContent = state.counts.great;
    document.getElementById("res-good").textContent = state.counts.good;
    document.getElementById("res-miss").textContent = state.counts.miss;
    document.getElementById("res-score").textContent = state.score.toLocaleString();
    document.getElementById("res-combo").textContent = state.maxCombo;
    document.getElementById("res-acc").textContent = acc.toFixed(1) + "%";
    document.getElementById("res-multi").textContent = "×" + state.multiplier.toFixed(1);

    document.getElementById("result-overlay").classList.add("show");
}

function hideResultScreen() {
    document.getElementById("result-overlay").classList.remove("show");
}

// ── 게임 종료 ─────────────────────────────────
function finishGame(clear) {
    state.running = false;
    state.finished = true;
    startBtn.disabled = false;
    startBtn.textContent = "▶ RESTART";
    document.getElementById("songSelect").disabled = false;

    if (state.musicSource) {
        try {
            state.musicSource.stop();
        } catch {}
        try {
            state.musicSource.disconnect();
        } catch {}
        state.musicSource = null;
    }
    try {
        musicAudio.pause();
    } catch {}

    setTimeout(() => showResultScreen(clear), 400);
}

// ── 메인 루프 ─────────────────────────────────
function tick() {
    const now = performance.now() / 1000;
    const dt = Math.min(now - state.lastFrame, 0.05);
    state.lastFrame = now;

    if (state.running) {
        const songTime = getSongTime();

        // 비트 인덱스
        const beatIdx = Math.floor(songTime / BEAT_SEC);
        if (beatIdx !== state.lastPulseBeat) {
            state.lastPulseBeat = beatIdx;
            state.beatPulse = Math.max(state.beatPulse, 0.4);
        }

        spawnNotes(songTime);
        handleMissByTime(songTime);
        scheduleMusic(songTime);
        updateParticles(dt);

        // 홀드 노트 시간 기반 자동완료
        state.notes.forEach((n) => {
            if (n.type === "hold" && n.active && !n.completed && !n.failed) {
                if (songTime >= n.endTime) {
                    n.completed = true;
                    state.holdActive[n.lane] = false;
                    // 완주 보너스 파티클
                    spawnHitParticles(1.0, n.lane);
                }
            }
        });

        // 피버 타이머
        if (state.feverActive) {
            state.feverTimer -= dt;
            // 속도 점점 빨라짐 (피버 중 최대 1.6배)
            const feverRatio = Math.max(0, state.feverTimer / 8);
            NOTE_SPEED = NOTE_SPEED_BASE * (1 + (1 - feverRatio) * 0.6);
            // 피버 바 시각화 (남은 시간으로)
            document.getElementById("fever-bar-fill").style.width = (state.feverTimer / 8) * 100 + "%";

            if (state.feverTimer <= 0) {
                state.feverActive = false;
                state.feverGauge = 0;
                NOTE_SPEED = NOTE_SPEED_BASE;
                document.getElementById("fever-bar-fill").style.width = "0%";
                document.getElementById("fever-active-label").classList.remove("on");
                spawnComboText("FEVER END", canvas.width / 2, JUDGE_Y - 140, "#b44dff");
            }
        }

        drawStage(songTime);

        // 감쇠
        state.judgeTimer = Math.max(0, state.judgeTimer - dt);
        state.screenFlash.a = Math.max(0, state.screenFlash.a - dt * 5);
        for (let i = 0; i < 3; i++) state.laneFlash[i] = Math.max(0, state.laneFlash[i] - dt * 3.5);
        state.cameraShake = Math.max(0, state.cameraShake - dt * 30);
        state.beatPulse = Math.max(0, state.beatPulse - dt * 2.2);

        // 종료 체크
        const last = state.chart[state.chart.length - 1];
        const endTime = (last ? last.hitTime : 0) + 2.5;
        if (state.life <= 0) {
            finishGame(false);
        } else if (songTime > endTime && state.notes.every((n) => n.completed || n.failed)) {
            finishGame(true);
        }
    } else {
        drawStage(0);
        if (!state.finished) {
            // 대기 화면
            ctx.save();
            const pulse = 0.5 + 0.5 * Math.sin(now * 2);
            ctx.font = "bold 28px 'Orbitron', sans-serif";
            ctx.textAlign = "center";
            ctx.fillStyle = `rgba(0,200,255,${0.6 + pulse * 0.4})`;
            ctx.shadowBlur = 20 * pulse;
            ctx.shadowColor = "#00f5ff";
            ctx.fillText("PRESS START", canvas.width / 2, canvas.height / 2 - 10);
            ctx.font = "12px 'Orbitron', sans-serif";
            ctx.fillStyle = "rgba(150,200,255,0.4)";
            ctx.shadowBlur = 0;
            ctx.fillText("A · S · D  OR  TAP KEYS", canvas.width / 2, canvas.height / 2 + 20);
            ctx.restore();
        }
    }

    requestAnimationFrame(tick);
}

// ── 카운트다운 ─────────────────────────────────
function showCountdown(count, onDone) {
    const overlay = document.getElementById("countdown-overlay");
    const numEl = document.getElementById("countdown-num");
    overlay.classList.add("show");

    function step(n) {
        if (n <= 0) {
            overlay.classList.remove("show");
            onDone();
            return;
        }
        numEl.textContent = n;
        // 애니메이션 재시작
        numEl.style.animation = "none";
        void numEl.offsetWidth;
        numEl.style.animation = "countPop 0.85s ease-out forwards";
        setTimeout(() => step(n - 1), 900);
    }
    step(count);
}

// ── 게임 시작 ─────────────────────────────────
async function startGame() {
    hideResultScreen();
    ensureAudio();

    if (state.musicSource) {
        try {
            state.musicSource.stop();
        } catch {}
        try {
            state.musicSource.disconnect();
        } catch {}
        state.musicSource = null;
    }
    try {
        musicAudio.pause();
        musicAudio.currentTime = 0;
    } catch {}

    if (!state.musicReady) preloadMusic();

    if (!state.notesReady) {
        if (!state.notesLoading) {
            loadNotesChart();
            messageEl.textContent = "노트 데이터 로드 중... 잠시 후 START를 다시 눌러주세요.";
        } else {
            messageEl.textContent = "로드 중입니다...";
        }
        return;
    }

    startBtn.disabled = true;
    document.getElementById("songSelect").disabled = true;
    messageEl.textContent = "준비하세요...";

    showCountdown(3, () => {
        resetState();

        const delay = 1.2; // 카운트다운 후 음악 지연
        state.startTime = performance.now() / 1000 + delay;
        if (audioCtx) state.audioStartTime = audioCtx.currentTime + delay;
        else state.audioStartTime = delay;

        if (audioCtx && state.musicBuffer) {
            const src = audioCtx.createBufferSource();
            src.buffer = state.musicBuffer;
            src.connect(musicGain);
            src.onended = () => {
                if (state.running) finishGame(true);
            };
            state.musicSource = src;
            try {
                src.start(state.audioStartTime);
            } catch {
                setTimeout(() => {
                    musicAudio.currentTime = 0;
                    musicAudio.play().catch(() => {});
                }, delay * 1000);
            }
        } else {
            setTimeout(() => {
                musicAudio.currentTime = 0;
                musicAudio.play().catch(() => {
                    messageEl.textContent = "오디오 차단됨. START를 다시 눌러주세요.";
                });
            }, delay * 1000);
        }

        updateHud();
        messageEl.textContent = "A · S · D  |  HOLD 노트는 꾹 눌러요!  |  PERFECT 연속→ 🔥 FEVER MODE";
        state.finished = false;
    });
}

// ── 이벤트 리스너 ─────────────────────────────
startBtn.addEventListener("click", startGame);
document.getElementById("result-restart-btn").addEventListener("click", () => {
    hideResultScreen();
    startGame();
});

const KEY_MAP = { KeyA: 0, KeyS: 1, KeyD: 2 };

window.addEventListener("keydown", (e) => {
    if (!(e.code in KEY_MAP)) return;
    e.preventDefault();
    const lane = KEY_MAP[e.code];
    if (!state.keyDown[lane]) {
        state.keyDown[lane] = true;
        onLanePress(lane);
    }
    keyEls[lane].classList.add("is-down");
});

window.addEventListener("keyup", (e) => {
    if (!(e.code in KEY_MAP)) return;
    e.preventDefault();
    const lane = KEY_MAP[e.code];
    state.keyDown[lane] = false;
    keyEls[lane].classList.remove("is-down");
    onLaneRelease(lane);
});

// 곡 선택 변경
document.getElementById("songSelect").addEventListener("change", (e) => {
    if (state.running) return;
    selectedSongIdx = parseInt(e.target.value);
    state.notesReady = false;
    state.notesLoading = false;
    state.chartReady = false;
    state.musicReady = false;
    loadNotesChart();
    preloadMusic();
    messageEl.textContent = `${SONGS[selectedSongIdx].name} 선택됨 — START를 눌러 시작!`;
});

// 터치 입력 (모바일)
keyEls.forEach((el, lane) => {
    el.addEventListener(
        "touchstart",
        (e) => {
            e.preventDefault();
            if (!state.keyDown[lane]) {
                state.keyDown[lane] = true;
                onLanePress(lane);
            }
            el.classList.add("is-down");
        },
        { passive: false },
    );

    el.addEventListener(
        "touchend",
        (e) => {
            e.preventDefault();
            state.keyDown[lane] = false;
            el.classList.remove("is-down");
            onLaneRelease(lane);
        },
        { passive: false },
    );

    // 마우스 클릭도 지원
    el.addEventListener("mousedown", (e) => {
        if (!state.keyDown[lane]) {
            state.keyDown[lane] = true;
            onLanePress(lane);
        }
        el.classList.add("is-down");
    });
    el.addEventListener("mouseup", () => {
        state.keyDown[lane] = false;
        el.classList.remove("is-down");
        onLaneRelease(lane);
    });
});

musicAudio.addEventListener("loadedmetadata", () => {
    state.songDuration = musicAudio.duration || 0;
    if (!state.notesLoading && !state.notesReady) loadNotesChart();
});
musicAudio.addEventListener("ended", () => {
    if (state.running) finishGame(true);
});

// ── 초기화 ────────────────────────────────────
updateHud();
loadNotesChart();
preloadMusic();
tick();
