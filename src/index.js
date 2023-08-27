import * as ReactDOM from "react-dom";
import * as React from "react";
import { BsFillArrowDownCircleFill, BsFillArrowUpCircleFill, BsPlayCircleFill, BsPauseCircleFill } from "react-icons/bs";
import { FaArrowsRotate } from "react-icons/fa6";
import './index.css';

function App() {
  const [breakLength, setBreakLength] = React.useState(5);
  const [sessionLength, setSessionLength] = React.useState(25);
  const [timeLeft, setTimeLeft] = React.useState(1500);
  const [timingType, setTimingType] = React.useState("SESSION");
  const [play, setPlay] = React.useState(false);
  const timeout = React.useRef();

  function handleBreakIncrease() {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  }

  function handleBreakDecrease() {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  }

  function handleSessionIncrease() {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      setTimeLeft(timeLeft + 60);
    }
  }

  function handleSessionDecrease() {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setTimeLeft(timeLeft - 60);
    }
  }

  function handleReset() {
    clearTimeout(timeout.current);
    setPlay(false);
    setTimeLeft(1500);
    setBreakLength(5);
    setSessionLength(25);
    setTimingType("SESSION");
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
  }

  function handlePlay() {
    clearTimeout(timeout.current);
    setPlay(!play);
  }

  function resetTimer() {
    const audio = document.getElementById("beep");
    if (!timeLeft && timingType === "SESSION") {
      setTimeLeft(breakLength * 60);
      setTimingType("BREAK");
      audio.play();
    }
    if (!timeLeft && timingType === "BREAK") {
      setTimeLeft(sessionLength * 60);
      setTimingType("SESSION");
      audio.pause();
      audio.currentTime = 0;
    }
  }

  function clock() {
    if (play) {
      resetTimer();
    } else {
      clearTimeout(timeout.current);
    }
  }

  React.useEffect(() => {
    timeout.current = setTimeout(() => {
      if (timeLeft && play) {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    clock();

    return () => clearTimeout(timeout.current);
  }, [play, timeLeft]);

  function timeFormatter() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft - minutes * 60;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  const title = timingType === "SESSION" ? "Session" : "Break";
  return (
   <div>
    <div className="wrapper">
      <h2>25 + 5 Clock</h2>
      <div className="break-session-length">
        <div>
          <h3 id="break-label">Break Length</h3>
          <div className="break button-wrapper">
            <button disabled={play} onClick={handleBreakIncrease} id="break-increment"><BsFillArrowUpCircleFill/></button>
              <strong id="break-length">{breakLength}</strong>
            <button disabled={play} onClick={handleBreakDecrease} id="break-decrement"><BsFillArrowDownCircleFill/></button>
          </div>
         </div>
         <div>
           <h3 id="session-label">Session Length</h3>
           <div className="session button-wrapper">
            <button disabled={play} onClick={handleSessionIncrease} id="session-increment"><BsFillArrowUpCircleFill/></button>
              <strong id="session-length">{sessionLength}</strong>
            <button disabled={play} onClick={handleSessionDecrease} id="session-decrement"><BsFillArrowDownCircleFill/></button>
          </div>
         </div>
      </div>
      <div className="timer-wrapper">
        <div className="timer">
           <h2 id="timer-label">{title}</h2>
           <h3 id="time-left">{timeFormatter()}</h3>
        </div>
        <button onClick={handlePlay} id="start_stop"><BsPlayCircleFill/><BsPauseCircleFill/></button>
        <button onClick={handleReset} id="reset"><FaArrowsRotate /></button>
      </div>
    </div>
    <audio
      id="beep" 
      preload="auto"
      src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
    />
    </div>);
}

ReactDOM.render(<App />, document.getElementById("root"))
