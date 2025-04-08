import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

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

function generateWorkout(day, baseWeight) {
  if (!exercises[day]) return [];
  return exercises[day].map((exercise, index) => {
    const weight = index % 2 === 0 ? baseWeight + 5 : baseWeight;
    return {
      name: exercise,
      sets: 4,
      weight: `${weight} lbs`
    };
  });
}

export default function WorkoutPlanner() {
  const [day, setDay] = useState('Monday');
  const [baseWeight, setBaseWeight] = useState(20);
  const [workout, setWorkout] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [totalExercisesCompleted, setTotalExercisesCompleted] = useState(0);
  const [history, setHistory] = useState([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restCountdown, setRestCountdown] = useState(30);
  const [showHistory, setShowHistory] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    setWorkout(generateWorkout(day, baseWeight));
  }, [day, baseWeight]);

  useEffect(() => {
    let timer;
    if (showRestTimer && restCountdown > 0) {
      timer = setTimeout(() => setRestCountdown(restCountdown - 1), 1000);
    } else if (showRestTimer && restCountdown === 0) {
      setShowRestTimer(false);
      setRestCountdown(30);
    }
    return () => clearTimeout(timer);
  }, [showRestTimer, restCountdown]);

  const startWorkout = () => {
    setActiveWorkout(workout);
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setStartTime(Date.now());
    setEndTime(null);
    setTotalExercisesCompleted(0);
    setShowCongrats(false);
  };

  const nextRep = () => {
    if (!activeWorkout || showRestTimer) return;

    setTotalExercisesCompleted((prev) => prev + 1);
    setShowRestTimer(true);

    if (currentExerciseIndex < activeWorkout.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else if (currentSet < 4) {
      setCurrentExerciseIndex(0);
      setCurrentSet(currentSet + 1);
    } else {
      const workoutDuration = Date.now() - startTime;
      const completedWorkout = {
        day,
        duration: workoutDuration,
        totalExercisesCompleted: totalExercisesCompleted + 1,
        date: new Date().toLocaleString()
      };
      setHistory((prev) => [completedWorkout, ...prev]);
      setEndTime(Date.now());
      setActiveWorkout(null);
      setShowCongrats(true);
    }
  };

  const getWorkoutDuration = () => {
    if (!startTime || !endTime) return '';
    const duration = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="p-6 max-w-xl mx-auto relative">
      <h1 className="text-3xl font-bold mb-4">Weekly Dumbbell Workout</h1>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Your Normal Dumbbell Weight (lbs):</label>
        <Input
          type="number"
          value={baseWeight}
          onChange={(e) => setBaseWeight(Number(e.target.value))}
        />
      </div>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {Object.keys(exercises).map((d) => (
          <Button key={d} variant={day === d ? 'default' : 'outline'} onClick={() => setDay(d)}>
            {d}
          </Button>
        ))}
      </div>
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">Workout for {day}</h2>
          {!activeWorkout && !showCongrats && (
            <>
              <ul className="space-y-2 mb-4">
                {workout.map((ex, idx) => (
                  <li key={idx} className="border p-2 rounded-lg shadow">
                    <strong>{ex.name}</strong> — {ex.sets} sets @ {ex.weight}
                  </li>
                ))}
              </ul>
              <Button onClick={startWorkout}>Start Workout</Button>
            </>
          )}

          {activeWorkout && (
            <div className="mt-4">
              <h3 className="text-lg font-bold">Current Rep Cycle:</h3>
              <p className="text-md mb-2">
                Set {currentSet} of 4 — <strong>{activeWorkout[currentExerciseIndex].name}</strong> @ {activeWorkout[currentExerciseIndex].weight}
              </p>
              {showInstructions && (
                <p className="text-sm italic mb-4 text-gray-700">
                  {instructions[activeWorkout[currentExerciseIndex].name] || 'Exercise instructions coming soon...'}
                </p>
              )}
              <div className="flex gap-2">
                <Button onClick={nextRep} disabled={showRestTimer}>Complete Rep</Button>
                <Button variant="outline" onClick={() => setShowInstructions(!showInstructions)}>
                  {showInstructions ? 'Hide' : 'Show'} Instructions
                </Button>
              </div>
            </div>
          )}

          <AnimatePresence>
            {showCongrats && (
              <motion.div
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-100 p-6 rounded-xl shadow-xl z-50 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold text-green-700 mb-2">🎉 Congrats! Workout Complete!</h3>
                <p className="text-md mb-1">Total Time: <strong>{getWorkoutDuration()}</strong></p>
                <p className="text-md mb-4">Total Exercises Completed: <strong>{totalExercisesCompleted}</strong></p>
                <Button onClick={() => setShowCongrats(false)}>Close</Button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showRestTimer && (
              <motion.div
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border p-6 rounded-xl shadow-xl z-50 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-xl font-bold">Rest Time</p>
                <p className="text-4xl text-red-600">{restCountdown}s</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button variant="outline" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? 'Hide' : 'Show'} Workout History
        </Button>
      </div>

      <AnimatePresence>
        {showHistory && history.length > 0 && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-2xl font-bold mb-2">Workout History</h2>
            <ul className="space-y-2">
              {history.map((entry, idx) => (
                <li key={idx} className="p-3 bg-gray-100 rounded-lg shadow">
                  <div className="font-semibold">{entry.date}</div>
                  <div>Day: {entry.day}</div>
                  <div>Duration: {Math.floor(entry.duration / 60000)}m {Math.floor((entry.duration % 60000) / 1000)}s</div>
                  <div>Exercises Completed: {entry.totalExercisesCompleted}</div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
