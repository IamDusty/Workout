import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const exercises = {
  Monday: ['Bicep Curls', 'Hammer Curls', 'Concentration Curls', 'Zottman Curls'],
  Tuesday: ['Goblet Squats', 'Dumbbell Lunges', 'Romanian Deadlifts', 'Step-Ups'],
  Wednesday: ['Dumbbell Press', 'Lateral Raises', 'Front Raises', 'Reverse Flys'],
  Thursday: ['Russian Twists', 'Weighted Sit-ups', 'Dumbbell Side Bends', 'Leg Raises with Dumbbell'],
  Friday: ['Bicep Curls', 'Incline Curls', '21s', 'Cross-body Hammer Curls'],
  Saturday: ['Full Body Circuit', 'Dumbbell Thrusters', 'Renegade Rows', 'Dumbbell Burpees'],
  Sunday: ['Active Recovery', 'Light Stretching', 'Foam Rolling', 'Mobility Work']
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
  'Cross-body Hammer Curls': 'Curl the dumbbell across your body towards the opposite shoulder.',
  'Full Body Circuit': 'Perform each exercise for 45 seconds with minimal rest between exercises, focusing on form and control.',
  'Dumbbell Thrusters': 'Hold dumbbells at shoulder height, squat down, then as you stand up, press the weights overhead in one fluid motion.',
  'Renegade Rows': 'In plank position with hands on dumbbells, row one dumbbell up while balancing on the other, then alternate.',
  'Dumbbell Burpees': 'With dumbbells in hand, perform a burpee and add a dumbbell curl and press at the top of the movement.',
  'Active Recovery': 'Light activity to promote blood flow and recovery without straining muscles.',
  'Light Stretching': 'Gentle stretching focusing on major muscle groups to improve flexibility and reduce soreness.',
  'Foam Rolling': 'Use a foam roller on tight muscles to release tension and improve recovery.',
  'Mobility Work': 'Exercises focusing on joint mobility to improve range of motion and prevent injury.'
};

const muscleGroups = {
  'Bicep Curls': 'Biceps',
  'Hammer Curls': 'Biceps, Forearms',
  'Concentration Curls': 'Biceps',
  'Zottman Curls': 'Biceps, Forearms',
  'Goblet Squats': 'Quadriceps, Glutes, Core',
  'Dumbbell Lunges': 'Quadriceps, Glutes, Hamstrings',
  'Romanian Deadlifts': 'Hamstrings, Lower Back, Glutes',
  'Step-Ups': 'Quadriceps, Glutes',
  'Dumbbell Press': 'Chest, Shoulders, Triceps',
  'Lateral Raises': 'Shoulders',
  'Front Raises': 'Shoulders',
  'Reverse Flys': 'Rear Deltoids, Upper Back',
  'Russian Twists': 'Obliques, Core',
  'Weighted Sit-ups': 'Abs, Core',
  'Dumbbell Side Bends': 'Obliques',
  'Leg Raises with Dumbbell': 'Lower Abs',
  'Incline Curls': 'Biceps',
  '21s': 'Biceps',
  'Cross-body Hammer Curls': 'Biceps, Forearms',
  'Full Body Circuit': 'Full Body',
  'Dumbbell Thrusters': 'Shoulders, Quadriceps, Glutes',
  'Renegade Rows': 'Back, Core, Chest',
  'Dumbbell Burpees': 'Full Body, Cardiovascular',
  'Active Recovery': 'Recovery',
  'Light Stretching': 'Flexibility',
  'Foam Rolling': 'Myofascial Release',
  'Mobility Work': 'Joint Mobility'
};

const difficultyLevels = {
  'Beginner': 0.8,
  'Intermediate': 1,
  'Advanced': 1.2
};

// Helper function to check if an exercise is core or recovery focused
const isWeightlessExercise = (exercise, day) => {
  return day === 'Thursday' || // Core day
         exercise.includes('Recovery') || 
         exercise.includes('Stretching') || 
         exercise.includes('Foam Rolling') || 
         exercise.includes('Mobility');
};

const generateWorkout = (day, baseWeight, difficultyLevel) => {
  if (!exercises[day]) return [];
  const modifier = difficultyLevels[difficultyLevel] || 1;
  
  return exercises[day].map((exercise, index) => {
    const isWeightless = isWeightlessExercise(exercise, day);
    
    return {
      name: exercise,
      sets: 4,
      reps: isWeightless ? (day === 'Thursday' ? 15 : 'N/A') : 10,
      weight: isWeightless ? 'Bodyweight' : `${Math.round((index % 2 === 0 ? baseWeight + 5 : baseWeight) * modifier)} lbs`,
      completed: false,
      muscleGroup: muscleGroups[exercise] || 'General'
    };
  });
};

function App() {
  const [day, setDay] = useState(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  });
  const [baseWeight, setBaseWeight] = useState(20);
  const [difficultyLevel, setDifficultyLevel] = useState('Intermediate');
  const [workout, setWorkout] = useState([]);
  const [active, setActive] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restCountdown, setRestCountdown] = useState(60);
  const [customRestTime, setCustomRestTime] = useState(60);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [menuOpen, setMenuOpen] = useState(false);

  // Generate workout whenever day, baseWeight, or difficulty changes
  useEffect(() => {
    setWorkout(generateWorkout(day, baseWeight, difficultyLevel));
  }, [day, baseWeight, difficultyLevel]);

  // Handle rest timer countdown
  useEffect(() => {
    let timer;
    if (showRestTimer && restCountdown > 0) {
      timer = setTimeout(() => setRestCountdown(prev => prev - 1), 1000);
    } else if (showRestTimer && restCountdown === 0) {
      setShowRestTimer(false);
      setRestCountdown(customRestTime); // Reset restCountdown to customRestTime
      handleNext();
    }
    return () => clearTimeout(timer);
  }, [showRestTimer, restCountdown]);

  // Track total workout time
  useEffect(() => {
    let timer;
    if (active && startTime) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [active, startTime]);

  // Save workout data to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem('workoutHistory');
      if (savedHistory) {
        setWorkoutHistory(JSON.parse(savedHistory));
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setActive(true);
    setStartTime(Date.now());
    setCurrentSet(1);
    setCurrentExerciseIndex(0);
    setElapsedTime(0);
    
    // Reset completion status
    setWorkout(workout.map(exercise => ({
      ...exercise,
      completed: false
    })));
  };

  const handleCancelWorkout = () => {
    setActive(false);
    setCurrentSet(1);
    setCurrentExerciseIndex(0);
    setElapsedTime(0);
    setShowRestTimer(false);
    setShowInstructions(false);
    setRestCountdown(customRestTime); // Reset rest timer
  };

  const handleNext = () => {
    // Mark current exercise as completed for the current set
    const updatedWorkout = [...workout];
    if (workout[currentExerciseIndex]) {
      updatedWorkout[currentExerciseIndex] = {
        ...updatedWorkout[currentExerciseIndex],
        completed: true
      };
      setWorkout(updatedWorkout);
    }

    const nextIndex = currentExerciseIndex + 1;
    if (nextIndex < workout.length) {
      setCurrentExerciseIndex(nextIndex);
    } else if (currentSet < 4) {
      setCurrentSet(currentSet + 1);
      setCurrentExerciseIndex(0);
      
      // Reset completion status for next set
      setWorkout(workout.map(exercise => ({
        ...exercise,
        completed: false
      })));
    } else {
      completeWorkout();
    }
    
    // Close instructions if they were open
    setShowInstructions(false);
  };

  const completeWorkout = () => {
    const endTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000);
    
    // Create workout summary
    const summary = {
      date: new Date().toISOString(),
      day,
      exercises: workout.map(ex => ex.name),
      duration,
      difficulty: difficultyLevel
    };
    
    const updatedHistory = [...workoutHistory, summary];
    setWorkoutHistory(updatedHistory);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('workoutHistory', JSON.stringify(updatedHistory));
    }
    
    setShowCongrats(true);
    setActive(false);
  };

  const completeRep = () => {
    setRestCountdown(customRestTime); // Set restCountdown to the selected customRestTime
    setShowRestTimer(true);
  };

  const skipRest = () => {
    setShowRestTimer(false);
    setRestCountdown(customRestTime);
    handleNext();
  };

  const closeCongrats = () => {
    setShowCongrats(false);
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  // Get current exercise
  const currentExercise = workout[currentExerciseIndex];

  // Progress calculation
  const totalExercises = workout.length * 4; // 4 sets
  const completedExercises = ((currentSet - 1) * workout.length) + currentExerciseIndex;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Dumbbell Workout Planner</h1>
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-800'}`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>

              {/* Hamburger Menu */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-800'}`}
                >
                  ☰
                </button>

                {menuOpen && (
                  <div className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg`}>
                    <ul className="py-2">
                      <li>
                        <a
                          href="./caltracker/index.html"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Calorie Tracker
                        </a>
                      </li>
                      <li>
                        <button
                          onClick={() => setMenuOpen(false)} // Close menu when returning to home
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Home
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {active && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-2.5 dark:bg-gray-700">
                <motion.div 
                  className="bg-blue-600 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
              <div className="text-right text-sm mt-1">
                <span className="font-mono">{formatTime(elapsedTime)}</span>
              </div>
            </div>
          )}
        </header>

        {active ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-6`}
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-1">Set {currentSet} of 4</h2>
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map(set => (
                  <div 
                    key={set}
                    className={`h-1 flex-1 rounded-full ${set === currentSet ? 'bg-blue-500' : set < currentSet ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                  ></div>
                ))}
              </div>
            </div>
            
            {currentExercise && (
              <motion.div
                key={`${currentExerciseIndex}-${currentSet}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-bold mb-2">{currentExercise.name}</h3>
                <div className="flex items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} mr-2`}>
                    {currentExercise.muscleGroup}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'}`}>
                    {currentExercise.reps === 'N/A' ? 'As needed' : `${currentExercise.reps} reps`} @ {currentExercise.weight}
                  </span>
                </div>
                
                {showInstructions && instructions[currentExercise.name] && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className={`mb-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}
                  >
                    <h4 className="font-medium mb-2">How to perform:</h4>
                    <p>{instructions[currentExercise.name]}</p>
                  </motion.div>
                )}
                
                <div className="flex space-x-2 mb-4">
                  <button 
                    onClick={toggleInstructions}
                    className={`flex-1 py-3 px-4 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} font-medium rounded-md shadow-sm transition-colors`}
                  >
                    {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
                  </button>
                  <button 
                    onClick={completeRep}
                    className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-colors"
                  >
                    Complete & Rest
                  </button>
                </div>
              </motion.div>
            )}

            <button
              onClick={handleCancelWorkout}
              className="mt-2 w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md shadow-sm transition-colors"
            >
              Cancel Workout
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-6`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  Select Day:
                  <select 
                    value={day} 
                    onChange={e => setDay(e.target.value)}
                    className={`mt-1 block w-full rounded-md border p-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  >
                    {Object.keys(exercises).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </label>
              
                <label className="block mb-2 font-medium">
                  Dumbbell Weight (lbs):
                  <input
                    type="number"
                    value={baseWeight}
                    onChange={e => setBaseWeight(parseInt(e.target.value) || 0)}
                    className={`mt-1 block w-full rounded-md border p-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    min="1"
                    disabled={day === 'Thursday' || day === 'Sunday'} // Disable for core day and recovery day
                  />
                  {day === 'Thursday' && (
                    <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">Core day - no weights needed</p>
                  )}
                  {day === 'Sunday' && (
                    <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">Recovery day - no weights needed</p>
                  )}
                </label>
              
                <label className="block mb-4 font-medium">
                  Difficulty Level:
                  <select 
                    value={difficultyLevel} 
                    onChange={e => setDifficultyLevel(e.target.value)}
                    className={`mt-1 block w-full rounded-md border p-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  >
                    {Object.keys(difficultyLevels).map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </label>
              
                <label className="block mb-6 font-medium">
                  Rest Between Sets (seconds):
                  <div className="mt-2 flex space-x-2">
                    {['15', '30', '45', '60'].map((time) => (
                      <button
                        key={time}
                        onClick={() => setCustomRestTime(parseInt(time))}
                        className={`px-4 py-2 rounded-md border font-medium ${
                          customRestTime === parseInt(time)
                            ? darkMode
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-blue-100 text-blue-800 border-blue-600'
                            : darkMode
                            ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300'
                        } transition-colors`}
                      >
                        {time}s
                      </button>
                    ))}
                  </div>
                </label>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-3">Today's Workout:</h3>
                {workout.length > 0 ? (
                  <ul className={`rounded-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {workout.map((exercise, idx) => (
                      <li key={idx} className="p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{exercise.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {exercise.reps === 'N/A' ? 'As needed' : `${exercise.sets} sets × ${exercise.reps} reps`} • {exercise.muscleGroup}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            {exercise.weight}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No exercises scheduled for today.</p>
                )}
              </div>
            </div>
            
            <button 
              onClick={handleStart}
              className="mt-6 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors"
            >
              Start Workout
            </button>
          </motion.div>
        )}
        
        {showRestTimer && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50`}
          >
            <div className={`p-8 rounded-xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} max-w-md w-full text-center`}>
              <h3 className="text-xl font-bold mb-2">Rest Time</h3>
              <div className="flex justify-center my-6">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${darkMode ? 'border-blue-500' : 'border-blue-600'}`}>
                  <span className="text-4xl font-mono">{restCountdown}</span>
                </div>
              </div>
              <p className="mb-6 text-gray-500 dark:text-gray-400">
                Coming up next: {workout[(currentExerciseIndex + 1) % workout.length]?.name || "Next set"}
              </p>
              <button 
                onClick={skipRest}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors"
              >
                Skip Rest
              </button>
            </div>
          </motion.div>
        )}
        
        {showCongrats && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50`}
          >
            <div className={`p-8 rounded-xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} max-w-md w-full text-center`}>
              <h2 className="text-2xl font-bold mb-4">🎉 Workout Complete! 🎉</h2>
              <div className="mb-6">
                <p className="text-lg mb-2">Great job!</p>
                <p className="text-gray-500 dark:text-gray-400">Workout Duration: {formatTime(elapsedTime)}</p>
              </div>
              <button 
                onClick={closeCongrats}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
        
        {!active && workoutHistory.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <h2 className="text-xl font-semibold mb-4">Recent Workouts</h2>
            <div className={`overflow-hidden rounded-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              {workoutHistory.slice(-5).reverse().map((workout, idx) => (
                <div key={idx} className={`p-4 ${idx !== 0 ? (darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200') : ''}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{new Date(workout.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{workout.day} • {workout.difficulty}</p>
                    </div>
                    <div className="text-right">
                      <span className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {formatTime(workout.duration)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;