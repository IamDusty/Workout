import React, { useState, useEffect } from 'react';

const exercises = {
  Monday: ['Bicep Curls', 'Hammer Curls', 'Concentration Curls', 'Zottman Curls'],
  Tuesday: ['Goblet Squats', 'Dumbbell Lunges', 'Romanian Deadlifts', 'Step-Ups'],
  Wednesday: ['Dumbbell Press', 'Lateral Raises', 'Front Raises', 'Reverse Flys'],
  Thursday: ['Russian Twists', 'Weighted Sit-ups', 'Dumbbell Side Bends', 'Leg Raises with Dumbbell'],
  Friday: ['Bicep Curls', 'Incline Curls', '21s', 'Cross-body Hammer Curls']
};

const instructions = {
  'Bicep Curls': 'Stand with a dumbbell in each hand. Curl the weights while keeping your elbows close to your torso.',
  'Hammer Curls': 'Hold the dumbbells with a neutral grip and curl upwards, keeping palms facing each other.',
  'Concentration Curls': 'Sit down and curl one dumbbell at a time with your elbow braced against your thigh.',
  'Zottman Curls': 'Curl the dumbbells up with a standard grip, then rotate wrists at the top and lower slowly with a reverse grip.',
  'Goblet Squats': 'Hold one dumbbell vertically at your chest and perform a squat.',
  'Dumbbell Lunges': 'Hold a dumbbell in each hand and take a big step forward, lowering until both knees are at 90 degrees.',
  'Romanian Deadlifts': 'Hold dumbbells in front and hinge at the hips, keeping your back straight and knees slightly bent.',
  'Step-Ups': 'Hold dumbbells and step up onto a bench or platform, then step back down.',
  'Dumbbell Press': 'Lie on a bench and press dumbbells upward from chest level.',
  'Lateral Raises': 'Raise the dumbbells out to your sides until they reach shoulder height.',
  'Front Raises': 'Lift the dumbbells in front of you until they reach shoulder height, keeping arms straight.',
  'Reverse Flys': 'Bend over slightly and raise the dumbbells out to your sides while squeezing your shoulder blades.',
  'Russian Twists': 'Sit and lean back slightly with a dumbbell, then twist your torso side to side.',
  'Weighted Sit-ups': 'Hold a dumbbell against your chest and perform a sit-up.',
  'Dumbbell Side Bends': 'Hold a dumbbell in one hand and bend sideways at the waist.',
  'Leg Raises with Dumbbell': 'Hold a dumbbell between your feet and raise your legs off the ground while lying on your back.',
  'Incline Curls': 'Sit on an incline bench and perform dumbbell curls with arms hanging down.',
  '21s': 'Perform 7 partial curls from bottom to halfway, 7 from halfway to top, then 7 full curls.',
  'Cross-body Hammer Curls': 'Curl the dumbbell across your body towards the opposite shoulder.'
};

const generateWorkout = (day, baseWeight) => {
  if (!exercises[day]) return [];
  return exercises[day].map((exercise, index) => ({
    name: exercise,
    sets: 4,
    reps: 10,
    weight: `${index % 2 === 0 ? baseWeight + 5 : baseWeight} lbs`
  }));
};

function App() {
  const [day, setDay] = useState('Monday');
  const [baseWeight, setBaseWeight] = useState(20);
  const [workout, setWorkout] = useState([]);
  const [active, setActive] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restCountdown, setRestCountdown] = useState(30);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    setWorkout(generateWorkout(day, baseWeight));
  }, [day, baseWeight]);

  useEffect(() => {
    let timer;
    if (showRestTimer && restCountdown > 0) {
      timer = setTimeout(() => setRestCountdown(prev => prev - 1), 1000);
    } else if (showRestTimer && restCountdown === 0) {
      setShowRestTimer(false);
      setRestCountdown(30);
      handleNext();
    }
    return () => clearTimeout(timer);
  }, [showRestTimer, restCountdown]);

  const handleStart = () => {
    setActive(true);
    setStartTime(Date.now());
    setCurrentSet(1);
    setCurrentExerciseIndex(0);
  };

  const handleNext = () => {
    const nextIndex = currentExerciseIndex + 1;
    if (nextIndex < workout.length) {
      setCurrentExerciseIndex(nextIndex);
    } else if (currentSet < 4) {
      setCurrentSet(currentSet + 1);
      setCurrentExerciseIndex(0);
    } else {
      setShowCongrats(true);
      setActive(false);
    }
  };

  const completeRep = () => {
    setShowRestTimer(true);
  };

  const closeCongrats = () => {
    setShowCongrats(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Dumbbell Workout Planner</h1>
      <label>
        Select Day:
        <select value={day} onChange={e => setDay(e.target.value)}>
          {Object.keys(exercises).map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Normal Dumbbell Weight (lbs):
        <input
          type="number"
          value={baseWeight}
          onChange={e => setBaseWeight(parseInt(e.target.value))}
        />
      </label>
      <br />
      {!active && <button onClick={handleStart}>Start Workout</button>}

      {active && workout.length > 0 && (
        <div>
          <h2>Set {currentSet} of 4</h2>
          <h3>{workout[currentExerciseIndex].name}</h3>
          <p>{workout[currentExerciseIndex].reps} reps @ {workout[currentExerciseIndex].weight}</p>
          {showInstructions && (
            <p><em>{instructions[workout[currentExerciseIndex].name]}</em></p>
          )}
          <button onClick={() => setShowInstructions(!showInstructions)}>
            {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
          </button>
          <br />
          <button onClick={completeRep}>Complete Rep</button>
        </div>
      )}

      {showRestTimer && (
        <div style={{ border: '2px solid #ccc', padding: '10px', marginTop: '20px', backgroundColor: '#f0f0f0' }}>
          <h3>Rest for {restCountdown} seconds...</h3>
        </div>
      )}

      {showCongrats && (
        <div style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'white',
          border: '3px solid #4caf50',
          padding: '30px',
          zIndex: 1000
        }}>
          <h2>🎉 Congrats! You finished your workout! 🎉</h2>
          <button onClick={closeCongrats}>Close</button>
        </div>
      )}
    </div>
  );
}

export default App;
