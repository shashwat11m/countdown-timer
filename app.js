var hiddenClock = document.getElementById("hidden-clock");
var hiddenSetting = document.getElementById("hidden-setting");

var startBtn = document.getElementById("start");
var resetBtn = document.getElementById("reset");
var pauseBtn = document.getElementById("pause");
var resumeBtn = document.getElementById("resume");
var restartBtn = document.getElementById("restart");
var cancelBtn = document.getElementById("cancel");
var stopAlarmBtn = document.getElementById("stop-alarm");

var r = document.querySelector(":root");
var circle = document.getElementById("circle");

var timeInput = document.getElementById("time-in");
var timerText = document.getElementById("timer-text");

var alarmSound = document.getElementById("alarm-sound");

let intervalId;

let settedTime = "00:00:00";
let timeRemaining = 0;
let totalTime = 0;

$(function() {
  $('#time-in').datetimepicker({
      format: 'HH:mm:ss'
  });
});

$('#time-in').val('00:00:00');

$('.time-in').on(
  'dp.show',
  function(e) {
  $(".bootstrap-datetimepicker-widget").css(
  "background-color", "#3c3e43");
  });

function setTimer() {
  settedTime = timeInput.value;
  var[hrs, mins, secs] = settedTime.split(":");
  timeRemaining = (parseInt(hrs) * 3600) + (parseInt(mins) * 60) + parseInt(secs);
  totalTime = timeRemaining;

  if (timeRemaining <= 0) {
    location.reload();
    alert("Please enter a time greater than 0.");
    return;
}
  r.style.setProperty('--d', ((parseInt(timeRemaining)) + 's'));
}

function startTimer() {    
  if (!intervalId) {
    pauseBtn.style.display = "inline-block";
    resumeBtn.style.display = "none";

    setTimeout(() => {
      circle.classList.add("switch");
    }, 100);

    startTimerAnim();

    intervalId = setInterval(() => {
     if (timeRemaining > 0) {
      timeRemaining -= 0.1;
      updateDisplay();
     } else {
      r.style.setProperty('--b', '100%');
      clearInterval(intervalId);
      intervalId = null;
      }
   }, 100);
  }
}

function pauseTimer() {
if (intervalId) {
  pauseBtn.style.display = "none";
  resumeBtn.style.display = "inline-block";
  clearInterval(intervalId);
  intervalId = null;
}
}

function resumeTimer() {
if (!intervalId) {
  startTimer();
}
}

function restartTimer() {
  pauseTimer();
  
  timeRemaining = totalTime+1;

  resetTimerAnim();

  setTimeout(() => {
    startTimerAnim();
    resumeTimer();
  }, 50);
}

function cancelTimer() {
  pauseTimer();
  toggleTimerClock();
}

function updateDisplay() {
  if (timeRemaining <= 0) {
    timerText.innerText = "00:00";
    triggerVisualEffect();
    return;
  }

  var seconds = Math.floor(timeRemaining);
  var minutes = Math.floor(timeRemaining / (60));
  var hours = Math.floor(timeRemaining / (3600));

  var hoursDisp = hours;
  var minutesDisp = minutes - (hours * 60);
  var secondsDisp = seconds - (minutes * 60);
  
  timerText.innerText = `${((hoursDisp > 0) ? hoursDisp.toString().padStart(2, '0')+':' : '')}${minutesDisp.toString().padStart(2, '0')}:${secondsDisp.toString().padStart(2, '0')}`;
}

function startTimerAnim() {
  r.style.setProperty('--d', ((timeRemaining).toFixed(1)) + 's');
  circle.style.setProperty('--b', '0%');
}

function pauseTimerAnim() {
  const percentLeft = (timeRemaining / totalTime) * 100;

  var computedStyle = window.getComputedStyle(circle)
  background = computedStyle.getPropertyValue('background');
  circle.style.background = background;

  circle.style.setProperty('--b', percentLeft + '%');
}

function resetTimerAnim() {
  circle.style.setProperty('--b', '100%');
  circle.style.setProperty('--d', '0s'); 

  setTimeout(() => {
    circle.style.setProperty('--d', ((parseInt(totalTime)) + 's')); // Set the correct duration again
  }, 50);
}

startBtn.addEventListener("click", () => {
  setTimer();

  toggleTimerSetting();
  toggleTimerClock();

  startTimer();
});

resetBtn.addEventListener("click", () => {
  timeInput.value = "00:00:00";
});

pauseBtn.addEventListener("click", () => {
  pauseTimerAnim();
  pauseTimer();
});

resumeBtn.addEventListener("click", () => {
  startTimerAnim();
  resumeTimer();
});

cancelBtn.addEventListener("click", () => {
  cancelTimer();
  setTimeout(() => {
    location.reload();
  }, 200);
});

restartBtn.addEventListener("click", () => {
  restartTimer();
});

stopAlarmBtn.addEventListener("click", () => {
  stopVisualEffect();
  enableButtons();
  document.getElementById("stop-alarm").style.display = "none";
  pauseBtn.style.display = "inline-block";
  
  setTimeout(() => {
    location.reload();
  }, 500);
});

function disableButtons() {
  startBtn.disabled = true;
  resetBtn.disabled = true;
  pauseBtn.disabled = true;
  resumeBtn.disabled = true;
  restartBtn.disabled = true;
  cancelBtn.disabled = true;
}

function enableButtons() {
  startBtn.disabled = false;
  resetBtn.disabled = false;
  pauseBtn.disabled = false;
  resumeBtn.disabled = false;
  restartBtn.disabled = false;
  cancelBtn.disabled = false;
}

function playAlarm() {
  const alarmSound = document.getElementById("alarm-sound");
  alarmSound.play();
}

function triggerVisualEffect() {
  document.body.classList.add("flash");
  playAlarm();
  disableButtons();
  pauseBtn.style.display = "none";
  resumeBtn.style.display = "none";
  document.getElementById("stop-alarm").style.display = "inline-block";
}

function stopAlarm() {
  const alarmSound = document.getElementById("alarm-sound");
  alarmSound.pause();
  alarmSound.currentTime = 0;
}

function stopVisualEffect() {
  document.body.classList.remove("flash");
  stopAlarm();
}

function toggleTimerSetting() {
    if (hiddenSetting.classList.contains('hidden')) {
        hiddenSetting.classList.remove('hidden');
        setTimeout(function () {
          hiddenSetting.classList.remove('visuallyhidden');
        }, 10);
      } else {
        hiddenSetting.classList.add('visuallyhidden');    
        hiddenSetting.addEventListener('transitionend', function(e) {
          hiddenSetting.classList.add('hidden');
        }, {
          capture: false,
          once: true,
          passive: false
        });
      }
}

function toggleTimerClock() {
    if (hiddenClock.classList.contains('hidden')) {
        hiddenClock.classList.remove('hidden');
        setTimeout(function () {
          hiddenClock.classList.remove('visuallyhidden');
        }, 10);
      } else {
        hiddenClock.classList.add('visuallyhidden');    
        hiddenClock.addEventListener('transitionend', function(e) {
          hiddenClock.classList.add('hidden');
        }, {
          capture: false,
          once: true,
          passive: false
        });
      }
}