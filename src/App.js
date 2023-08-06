import "./styles.css";
import { useEffect, useReducer } from "react";

// default state
const internalState = {
  sessionDuration: 1500,
  breakDuration: 300,
  isActive: false,
  countdown: 1500,
  isSession: true
};

// Action list
const ACTION = {
  START_TIMER: "startTimer",
  STOP_TIMER: "stopTimer",
  RESET_TIMER: "resetTimer",
  DECREMENT_COUNTDOWN: "decrementCountdown",
  BREAK_LENGTH_INC: "incBreakLength",
  BREAK_LENGTH_DEC: "decBreakLength",
  SESSION_LENGTH_INC: "incSessionLength",
  SESSION_LENGTH_DEC: "decSessionLength",
  CHANGE_SESSION: "changeSession"
};

// reducer
function reducer(state, action) {
  switch (action.type) {
    case ACTION.START_TIMER: {
      // console.log(state)
      return { ...state, isActive: true };
    }
    case ACTION.STOP_TIMER: {
      // console.log(state)
      return { ...state, isActive: false };
    }
    case ACTION.RESET_TIMER:
      return internalState;
    case ACTION.DECREMENT_COUNTDOWN:
      return { ...state, countdown: state.countdown - 1 };
    case ACTION.SESSION_LENGTH_INC:
      if (!state.isActive && state.sessionDuration < 3600) {
        let newCountdown = state.sessionDuration + 60;
        return {
          ...state,
          sessionDuration: newCountdown,
          countdown: state.isSession ? newCountdown : state.countdown
        };
      } else {
        return state;
      }
    case ACTION.SESSION_LENGTH_DEC:
      if (!state.isActive && state.sessionDuration >= 120) {
        let newCountdown = state.sessionDuration - 60;
        return {
          ...state,
          sessionDuration: newCountdown,
          countdown: state.isSession ? newCountdown : state.countdown
        };
      } else {
        return state;
      }
    case ACTION.BREAK_LENGTH_INC:
      if (!state.isActive && state.breakDuration < 3600) {
        let newCountdown = state.breakDuration + 60;
        return {
          ...state,
          breakDuration: newCountdown,
          countdown: state.isSession ? state.countdown : newCountdown
        };
      } else {
        return state;
      }
    case ACTION.BREAK_LENGTH_DEC:
      if (!state.isActive && state.breakDuration >= 120) {
        let newCountdown = state.breakDuration - 60;
        return {
          ...state,
          breakDuration: newCountdown,
          countdown: state.isSession ? state.countdown : newCountdown
        };
      } else {
        return state;
      }
    case ACTION.CHANGE_SESSION:
      return {
        ...state,
        countdown: state.isSession
          ? state.breakDuration
          : state.sessionDuration,
        isSession: !state.isSession
      };
    default:
      return state;
  }
}

// main app
export default function App() {
  const [state, dispatch] = useReducer(reducer, internalState);

  // if countdown === 0
  function handleCountdownCompletion() {
    // Play sound or trigger notification
    const audio = new Audio(
      "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
    );
    audio.play();

    // Stop the timer
    dispatch({ type: ACTION.STOP_TIMER });

    // change session
    dispatch({ type: ACTION.CHANGE_SESSION });

    // Start timer again
    dispatch({ type: ACTION.START_TIMER });
  }

  // reduce countdown
  useEffect(() => {
    let interval = null;

    if (state.isActive) {
      interval = setInterval(() => {
        dispatch({ type: ACTION.DECREMENT_COUNTDOWN });
      }, 1000);
    } else clearInterval(interval);
    return () => clearInterval(interval);
  }, [state.isActive]);

  // Countdown to 0
  useEffect(() => {
    if (state.countdown === 0) {
      handleCountdownCompletion();
    }
  }, [state.countdown]);

  //funtion to format in minute and minute + second
  const formatTimeMinute = (time) => {
    const minutes = Math.floor(time / 60);

    return `${minutes.toString()}`;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes.toString()}:${seconds.toString().padStart(2, "0")}`;
  };
  return (
    <div className="App">
      <h1>Pomodoro Clock</h1>
      <div id="wapperCounter">
        <div id="left">
          <h1 id="break-label">Break Length</h1>
          <button
            onClick={() => dispatch({ type: ACTION.BREAK_LENGTH_DEC })}
            id="break-decrement"
          >
            -
          </button>
          {formatTimeMinute(state.breakDuration)}
          <button
            onClick={() => dispatch({ type: ACTION.BREAK_LENGTH_INC })}
            id="break-increment"
          >
            +
          </button>
        </div>
        <div id="right">
          <h1 id="session-label">Session Length</h1>
          <button
            onClick={() => dispatch({ type: ACTION.SESSION_LENGTH_DEC })}
            id="session-decrement"
          >
            -
          </button>
          {formatTimeMinute(state.sessionDuration)}
          <button
            onClick={() => dispatch({ type: ACTION.SESSION_LENGTH_INC })}
            id="session-increment"
          >
            +
          </button>
        </div>
      </div>
      <h1>{state.isSession ? "Session" : "Break"} </h1>
      <h2>{formatTime(state.countdown)}</h2>
      <div>
        <button onClick={() => dispatch({ type: ACTION.START_TIMER })}>
          Play
        </button>
        <button onClick={() => dispatch({ type: ACTION.STOP_TIMER })}>
          Stop
        </button>
        <button onClick={() => dispatch({ type: ACTION.RESET_TIMER })}>
          Reset
        </button>
      </div>
      <p>
        What i have use: useEffect(reduce countdown)
        <br /> useReducer(manage mutiple states through dispatch)
      </p>
    </div>
  );
}
