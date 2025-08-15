let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let lapCount = 0;
let lapTimes = [];

const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapTimesContainer = document.getElementById('lapTimes');
const statusIndicator = document.getElementById('statusIndicator');

function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    if (isRunning) {
        const currentTime = Date.now();
        elapsedTime = currentTime - startTime;
    }
    display.textContent = formatTime(elapsedTime);
}

function startStopwatch() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateDisplay, 10);
        isRunning = true;

        startBtn.disabled = true;
        pauseBtn.disabled = false;
        lapBtn.disabled = false;

        statusIndicator.className = 'status-indicator running';


        startBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            startBtn.style.transform = '';
        }, 150);
    }
}

function pauseStopwatch() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;

        startBtn.disabled = false;
        pauseBtn.disabled = true;
        lapBtn.disabled = true;

        statusIndicator.className = 'status-indicator paused';


        pauseBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            pauseBtn.style.transform = '';
        }, 150);
    }
}

function resetStopwatch() {
    clearInterval(timerInterval);
    isRunning = false;
    elapsedTime = 0;
    lapCount = 0;
    lapTimes = [];

    updateDisplay();

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    lapBtn.disabled = true;

    statusIndicator.className = 'status-indicator';


    lapTimesContainer.innerHTML = '<div style="text-align: center; opacity: 0.7; font-style: italic;">No laps recorded yet</div>';


    resetBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        resetBtn.style.transform = '';
    }, 150);
}

function recordLap() {
    if (isRunning) {
        lapCount++;
        const currentLapTime = elapsedTime;
        const lapTime = lapCount === 1 ? currentLapTime : currentLapTime - (lapTimes[lapTimes.length - 1]?.totalTime || 0);

        lapTimes.push({
            number: lapCount,
            lapTime: lapTime,
            totalTime: currentLapTime
        });

        displayLapTimes();


        lapBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            lapBtn.style.transform = '';
        }, 150);
    }
}

function displayLapTimes() {
    if (lapTimes.length === 0) {
        lapTimesContainer.innerHTML = '<div style="text-align: center; opacity: 0.7; font-style: italic;">No laps recorded yet</div>';
        return;
    }

    lapTimesContainer.innerHTML = '';

    for (let i = lapTimes.length - 1; i >= 0; i--) {
        const lap = lapTimes[i];
        const lapElement = document.createElement('div');
        lapElement.className = 'lap-item';
        lapElement.innerHTML = `
                    <span class="lap-number">Lap ${lap.number}</span>
                    <span class="lap-time">${formatTime(lap.lapTime)}</span>
                `;
        lapTimesContainer.appendChild(lapElement);
    }
}

document.addEventListener('keydown', function (event) {
    switch (event.code) {
        case 'Space':
            event.preventDefault();
            if (!isRunning && !startBtn.disabled) {
                startStopwatch();
            } else if (isRunning && !pauseBtn.disabled) {
                pauseStopwatch();
            }
            break;
        case 'KeyL':
            if (!lapBtn.disabled) {
                recordLap();
            }
            break;
        case 'KeyR':
            resetStopwatch();
            break;
    }
});


updateDisplay();


setTimeout(() => {
    if (!isRunning && lapCount === 0) {
        const hint = document.createElement('div');
        hint.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    z-index: 1000;
                `;
        hint.textContent = 'Tip: Use Spacebar to start/pause, L for lap, R to reset';
        document.body.appendChild(hint);

        setTimeout(() => {
            hint.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            hint.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(hint);
            }, 300);
        }, 5000);
    }
}, 2000);