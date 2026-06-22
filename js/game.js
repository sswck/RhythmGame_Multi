// js/game.js
const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

const bpmEl = document.getElementById("bpm");
const comboEl = document.getElementById("combo");
const scoreEl = document.getElementById("score");
const lifeEl = document.getElementById("life");
const messageEl = document.getElementById("message");
const startBtn = document.getElementById("startBtn");

// 5키 요소 바인딩
const keyEls = {
    0: document.getElementById("keyA"),
    1: document.getElementById("keyS"),
    2: document.getElementById("keyD"),
    3: document.getElementById("keyF"),
    4: document.getElementById("keyG")
};

// 게임 환경 설정
let BPM = 175;
let LANE_COUNT = 3; // 현재 3키 모드 기준
let LANE_WIDTH = 80;
const LANE_GAP = 10;
let TOTAL_LANE_WIDTH = LANE_COUNT * LANE_WIDTH + (LANE_COUNT - 1) * LANE_GAP;
let LANE_START_X = 0;
let TICKS_PER_BEAT = 384;

const HIT_Y_OFFSET = 80; 
let HIT_Y = 0; 
const NOTE_APPEAR_TIME = 1.5; 

// 게임 상태
let state = {
    running: false,
    combo: 0,
    score: 0,
    life: 100,
    keyDown: [false, false, false, false, false]
};

// 리소스
const musicAudio = new Audio('assets/music.mp3'); 
let notes = []; 

// 화면 크기 조정에 따른 캔버스 대응
function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    LANE_START_X = (canvas.width / 2) - (TOTAL_LANE_WIDTH / 2);
    HIT_Y = canvas.height - HIT_Y_OFFSET;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Notes 데이터 불러오기 및 계산
function loadNotesChart() {
    if (window.PRELOADED_NOTES) {
        BPM = window.PRELOADED_NOTES.bpm;
        TICKS_PER_BEAT = window.PRELOADED_NOTES.ticksPerBeat;
        if (bpmEl) bpmEl.textContent = Math.round(BPM);

        const rawNotes = window.PRELOADED_NOTES.notes;
        notes = rawNotes.map(n => {
            const beat = n.start_tick / TICKS_PER_BEAT;
            const time = beat * (60 / BPM);
            const lane = n.pitch % LANE_COUNT; // 피치 값을 레인 개수에 맞춰 분배
            
            return { time: time, lane: lane, hit: false, missed: false };
        });
        
        notes.sort((a, b) => a.time - b.time);
        if (messageEl) messageEl.textContent = "준비 완료! START를 누르세요.";
        if (startBtn) startBtn.disabled = false;
    }
}

// 게임 시작
function startGame() {
    if (state.running) return;
    state = { ...state, running: true, combo: 0, score: 0, life: 100 };
    notes.forEach(n => { n.hit = false; n.missed = false; });
    
    if (startBtn) startBtn.disabled = true;
    if (messageEl) messageEl.textContent = "";
    
    musicAudio.currentTime = 0;
    musicAudio.play().then(() => {
        requestAnimationFrame(gameLoop);
    }).catch(err => {
        console.error("Audio play failed:", err);
        if (messageEl) messageEl.textContent = "오디오 재생 권한이 없거나 파일을 찾을 수 없습니다.";
        requestAnimationFrame(gameLoop);
    });
}

// 메인 게임 루프
function gameLoop() {
    if (!state.running) return;
    update();
    draw();
    
    if (!musicAudio.ended) {
        requestAnimationFrame(gameLoop);
    } else {
        finishGame();
    }
}

// 상태 업데이트 (Miss 판정 등)
function update() {
    // 음악이 멈춰있을 경우 임시 폴백 타이머 (테스트용)
    const currentTime = musicAudio.currentTime > 0 ? musicAudio.currentTime : (performance.now() / 1000) % 5;

    notes.forEach(note => {
        if (!note.hit && !note.missed) {
            // 시간이 지나쳐버린 노트 Miss 처리
            if (currentTime > note.time + 0.2) {
                note.missed = true;
                handleMiss();
            }
        }
    });
}

// 화면 렌더링
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const currentTime = musicAudio.currentTime > 0 ? musicAudio.currentTime : (performance.now() / 1000) % 5;

    drawLanes();

    ctx.fillStyle = "#64c8ff"; 
    
    // 떨어지는 노트 그리기
    notes.forEach(note => {
        if (!note.hit && !note.missed) {
            // 화면에 보여야 할 시간대에 진입한 노트만 그리기
            if (note.time - currentTime <= NOTE_APPEAR_TIME && note.time >= currentTime - 0.5) {
                const timeDiff = note.time - currentTime;
                const yPos = HIT_Y - (timeDiff / NOTE_APPEAR_TIME) * HIT_Y;
                const xPos = LANE_START_X + (note.lane * (LANE_WIDTH + LANE_GAP));
                
                // 노트 박스 정렬하여 그리기
                ctx.fillRect(xPos, yPos - 10, LANE_WIDTH, 20); 
            }
        }
    });
}

// 레인 및 판정선 렌더링
function drawLanes() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;

    for (let i = 0; i < LANE_COUNT; i++) {
        const xPos = LANE_START_X + (i * (LANE_WIDTH + LANE_GAP));
        
        // 레인 배경
        ctx.fillRect(xPos, 0, LANE_WIDTH, canvas.height);
        
        // 판정선
        ctx.beginPath();
        ctx.moveTo(xPos, HIT_Y);
        ctx.lineTo(xPos + LANE_WIDTH, HIT_Y);
        ctx.stroke();
    }
}

// 놓쳤을 때 로직
function handleMiss() {
    state.combo = 0;
    state.life = Math.max(0, state.life - 5);
    updateUI();
}

// 정확히 맞췄을 때 로직
function handleHit(lane) {
    const currentTime = musicAudio.currentTime > 0 ? musicAudio.currentTime : (performance.now() / 1000) % 5;
    
    // 현재 레인에 속하고 오차범위(0.2초) 안에 들어온 노트를 찾음
    const validNotes = notes.filter(n => !n.hit && !n.missed && n.lane === lane && Math.abs(n.time - currentTime) < 0.2);
    
    if (validNotes.length > 0) {
        const note = validNotes[0];
        note.hit = true;
        state.combo++;
        state.score += 100;
        updateUI();
    }
}

// UI 텍스트 업데이트
function updateUI() {
    if (comboEl) comboEl.textContent = state.combo;
    if (scoreEl) scoreEl.textContent = state.score;
    if (lifeEl) lifeEl.textContent = state.life;
}

// 게임 종료 시
function finishGame() {
    state.running = false;
    if (messageEl) messageEl.textContent = "게임 종료!";
    if (startBtn) startBtn.disabled = false;
}

// --- Keyboard Events ---
window.addEventListener("keydown", (event) => {
    if(!state.running) return;
    const codeToLane = { KeyA: 0, KeyS: 1, KeyD: 2, KeyF: 3, KeyG: 4 };
    
    if (!(event.code in codeToLane)) return;
    const lane = codeToLane[event.code];
    
    if (lane >= LANE_COUNT) return; // 현재 활성화된 키 개수 방어

    if (!state.keyDown[lane]) {
        state.keyDown[lane] = true;
        if(keyEls[lane]) keyEls[lane].classList.add("is-down");
        handleHit(lane);
    }
});

window.addEventListener("keyup", (event) => {
    const codeToLane = { KeyA: 0, KeyS: 1, KeyD: 2, KeyF: 3, KeyG: 4 };
    
    if (!(event.code in codeToLane)) return;
    const lane = codeToLane[event.code];
    
    if (lane >= LANE_COUNT) return;

    state.keyDown[lane] = false;
    if(keyEls[lane]) keyEls[lane].classList.remove("is-down");
});

if (startBtn) startBtn.addEventListener("click", startGame);

// 스크립트 로드 0.5초 후 초기화
setTimeout(loadNotesChart, 500);