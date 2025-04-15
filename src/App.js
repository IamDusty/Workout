import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ExerciseLibrary, { exercisesByMuscleGroup, muscleGroups } from './ExerciseLibrary';

// Day-to-muscle group mapping
const dayMuscleGroupMap = {
  Monday: 'Arms',         // Arm Day
  Tuesday: 'Legs',        // Leg Day
  Wednesday: 'Shoulders', // Shoulder Day
  Thursday: 'Core',       // Core Day
  Friday: 'Arms',         // Arm Day (advanced)
  Saturday: 'FullBody',   // Full Body Day
  Sunday: 'Recovery'      // Recovery Day
};

// Function to get random items from an array
const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Day information for tooltips
const dayInfo = {
  Monday: "Arm Day - Focus on biceps and forearm strength",
  Tuesday: "Leg Day - Lower body strength and stability",
  Wednesday: "Shoulder Day - Upper body pushing movements",
  Thursday: "Core Day - Abdominal and trunk exercises",
  Friday: "Arm Day - Advanced bicep techniques",
  Saturday: "Full Body - Compound movements and cardio",
  Sunday: "Recovery - Light activity to promote healing"
};

// Difficulty level modifiers
const difficultyLevels = {
  'Beginner': 0.8,
  'Intermediate': 1,
  'Advanced': 1.2,
  'Expert': 1.4
};

// Helper function to check if an exercise is core or recovery focused
const isWeightlessExercise = (exercise, day) => {
  return day === 'Thursday' || // Core day
         day === 'Sunday' || // Recovery day
         exercise.includes('Recovery') || 
         exercise.includes('Stretching') || 
         exercise.includes('Foam Rolling') || 
         exercise.includes('Mobility') ||
         exercise.includes('Plank') ||
         exercise.includes('Bicycle');
};

// Generate workout based on selected day, weight and difficulty
const generateWorkout = (day, baseWeight, difficultyLevel) => {
  const muscleGroup = dayMuscleGroupMap[day];
  if (!muscleGroup || !exercisesByMuscleGroup[muscleGroup]) return [];
  
  const exercisesForDay = getRandomItems(exercisesByMuscleGroup[muscleGroup], 4);
  const modifier = difficultyLevels[difficultyLevel] || 1;
  
  return exercisesForDay.map((exercise, index) => {
    const isWeightless = isWeightlessExercise(exercise.name, day);
    const repsFromRange = exercise.reps.includes('-') 
      ? parseInt(exercise.reps.split('-')[1]) 
      : (exercise.reps.includes('per') ? 10 : (isNaN(parseInt(exercise.reps)) ? 'N/A' : parseInt(exercise.reps)));
    
    return {
      name: exercise.name,
      sets: 4,
      reps: isWeightless ? (day === 'Thursday' ? 15 : 'N/A') : (isNaN(repsFromRange) ? 10 : repsFromRange),
      weight: isWeightless ? 'Bodyweight' : `${Math.round((index % 2 === 0 ? baseWeight + 5 : baseWeight) * modifier)} lbs`,
      completed: false,
      muscleGroup: exercise.muscles
    };
  });
};

// Format time helper function
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Component for rest timer
const RestTimer = ({ restCountdown, customRestTime, skipRest, nextExercise }) => {
  const progressPercentage = (customRestTime - restCountdown) / customRestTime * 100;
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70"
    >
      <div className="p-8 rounded-xl shadow-xl bg-gray-800 max-w-md w-full text-center">
        <h3 className="text-xl font-bold mb-2 text-white">Rest Time</h3>
        <div className="flex justify-center my-6">
          <div className="w-40 h-40 rounded-full flex items-center justify-center border-8 border-blue-500 relative">
            <div 
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{ 
                background: `conic-gradient(#3b82f6 ${progressPercentage}%, transparent ${progressPercentage}%)`,
                transform: "rotate(-90deg)" 
              }}
            />
            <div className="absolute inset-2 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-5xl font-mono text-white z-10">{restCountdown}</span>
            </div>
          </div>
        </div>
        <p className="mb-2 text-gray-300">
          Coming up next:
        </p>
        <p className="mb-6 text-xl font-semibold text-white">
          {nextExercise || "Next set"}
        </p>
        <button 
          onClick={skipRest}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors"
        >
          Skip Rest
        </button>
      </div>
    </motion.div>
  );
};

// Component for congratulations modal
const CongratsModal = ({ elapsedTime, workoutStats, closeCongrats, darkMode }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70"
    >
      <div className={`p-8 rounded-xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} max-w-md w-full text-center`}>
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-4 text-5xl"
        >
          🏆
        </motion.div>
        <h2 className="text-2xl font-bold mb-4">Workout Complete!</h2>
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
              <p className="text-xl font-mono font-semibold">{formatTime(elapsedTime)}</p>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <p className="text-sm text-gray-500 dark:text-gray-400">Exercises</p>
              <p className="text-xl font-semibold">{workoutStats.exercises}</p>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <p className="text-sm text-gray-500 dark:text-gray-400">Sets</p>
              <p className="text-xl font-semibold">{workoutStats.sets}</p>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <p className="text-sm text-gray-500 dark:text-gray-400">Calories</p>
              <p className="text-xl font-semibold">~{workoutStats.calories}</p>
            </div>
          </div>
          <p className="text-lg font-medium mb-2">Great job! Keep it up!</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your consistency is building a stronger you.</p>
        </div>
        <button 
          onClick={closeCongrats}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-colors"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};

// Main workout component
const ActiveWorkout = ({ 
  workout, 
  currentSet, 
  currentExerciseIndex, 
  elapsedTime, 
  progressPercentage, 
  showInstructions, 
  toggleInstructions, 
  completeRep, 
  handleCancelWorkout, 
  darkMode
}) => {
  const currentExercise = workout[currentExerciseIndex];
  
  if (!currentExercise) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-6`}
    >
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-1">Set {currentSet} of 4</h2>
        <div className="flex space-x-1">
          {[1, 2, 3, 4].map(set => (
            <div 
              key={set}
              className={`h-2 flex-1 rounded-full ${
                set === currentSet 
                  ? 'bg-blue-500' 
                  : set < currentSet 
                    ? 'bg-green-500' 
                    : darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            ></div>
          ))}
        </div>
      </div>
      
      <motion.div
        key={`${currentExerciseIndex}-${currentSet}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h3 className="text-2xl font-bold mb-3">{currentExercise.name}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
          }`}>
            {currentExercise.muscleGroup}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
          }`}>
            {currentExercise.reps === 'N/A' ? 'As needed' : `${currentExercise.reps} reps`}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800'
          }`}>
            {currentExercise.weight}
          </span>
        </div>
        
        {showInstructions && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className={`mb-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}
          >
            <h4 className="font-medium mb-2">How to perform:</h4>
            <p>{exercisesByMuscleGroup[dayMuscleGroupMap[currentExercise.day] || dayMuscleGroupMap[Object.keys(dayMuscleGroupMap).find(day => 
              exercisesByMuscleGroup[dayMuscleGroupMap[day]].some(ex => ex.name === currentExercise.name)
            )]]?.find(ex => ex.name === currentExercise.name)?.instructions || 
              "Perform this exercise with proper form, focusing on controlled movements."}</p>
          </motion.div>
        )}
        
        <div className="flex mt-4 space-x-3">
          <button 
            onClick={toggleInstructions}
            className={`flex-1 py-4 px-4 font-medium rounded-lg shadow-sm transition-colors ${
              darkMode 
                ? showInstructions ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white' 
                : showInstructions ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            {showInstructions ? 'Hide Guide' : 'Show Guide'}
          </button>
          <button 
            onClick={completeRep}
            className="flex-1 py-4 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
          >
            Complete & Rest
          </button>
        </div>
      </motion.div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-1 text-sm">
          <span>Workout Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
          <motion.div 
            className="bg-blue-600 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>Elapsed: {formatTime(elapsedTime)}</span>
          <span>Set {currentSet}/4, Exercise {currentExerciseIndex + 1}/{workout.length}</span>
        </div>
      </div>
      
      <button
        onClick={handleCancelWorkout}
        className="mt-6 w-full py-3 px-4 border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium rounded-lg transition-colors"
      >
        End Workout
      </button>
    </motion.div>
  );
};

// Setup workout component
const SetupWorkout = ({
  day,
  setDay,
  baseWeight,
  setBaseWeight,
  difficultyLevel,
  setDifficultyLevel,
  customRestTime,
  setCustomRestTime,
  workout,
  handleStart,
  darkMode
}) => {
  const [viewMode, setViewMode] = useState('setup'); // 'setup' or 'calendar'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-6`}
    >
      <div className="mb-4 flex border-b border-gray-200 dark:border-gray-700">
        <button 
          onClick={() => setViewMode('setup')}
          className={`pb-3 px-4 font-medium text-sm ${
            viewMode === 'setup' 
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          Workout Setup
        </button>
        <button 
          onClick={() => setViewMode('calendar')}
          className={`pb-3 px-4 font-medium text-sm ${
            viewMode === 'calendar' 
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          Weekly Calendar
        </button>
      </div>
    
      {viewMode === 'setup' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-5">
              <label className="block mb-2 font-medium text-sm">
                Select Day
                <div className="flex mt-2 flex-wrap gap-2">
                  {Object.keys(dayMuscleGroupMap).map(d => (
                    <button
                      key={d}
                      onClick={() => setDay(d)}
                      className={`py-2 px-3 rounded-md text-sm font-medium ${
                        day === d
                          ? 'bg-blue-600 text-white'
                          : darkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {dayInfo[day]}
                </div>
              </label>
            </div>
          
            <div className="mb-5">
              <label className="block mb-2 font-medium text-sm">
                Dumbbell Weight (lbs)
                <div className="mt-2">
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={baseWeight}
                    onChange={e => setBaseWeight(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    disabled={isWeightlessExercise('', day)}
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>5</span>
                    <span>15</span>
                    <span>25</span>
                    <span>35</span>
                    <span>45</span>
                  </div>
                  <div className="mt-3 text-center">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{baseWeight} lbs</span>
                  </div>
                </div>
                {isWeightlessExercise('', day) && (
                  <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                    {day === 'Thursday' ? 'Core day - no weights needed' : 'Recovery day - no weights needed'}
                  </p>
                )}
              </label>
            </div>
          
            <div className="mb-5">
              <label className="block mb-2 font-medium text-sm">
                Difficulty Level
                <select 
                  value={difficultyLevel} 
                  onChange={e => setDifficultyLevel(e.target.value)}
                  className={`mt-2 block w-full rounded-md border p-2 text-sm ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                >
                  {Object.keys(difficultyLevels).map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </label>
            </div>
          
            <div className="mb-5">
              <label className="block mb-2 font-medium text-sm">
                Rest Between Sets (seconds)
                <div className="mt-2 flex space-x-2">
                  {[30, 45, 60, 90].map((time) => (
                    <button
                      key={time}
                      onClick={() => setCustomRestTime(time)}
                      className={`flex-1 px-2 py-2 rounded-md border text-sm font-medium ${
                        customRestTime === time
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
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3">Today's Workout</h3>
            {workout.length > 0 ? (
              <ul className={`rounded-lg overflow-hidden border ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                {workout.map((exercise, idx) => (
                  <li 
                    key={idx} 
                    className={`p-3 ${
                      idx !== workout.length - 1 
                        ? `border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}` 
                        : ''
                    } ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{exercise.name}</p>
                        <div className="flex items-center text-xs mt-1">
                          <span className={`mr-2 px-2 py-0.5 rounded-full ${
                            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {exercise.sets} sets
                          </span>
                          <span className={`mr-2 px-2 py-0.5 rounded-full ${
                            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {exercise.reps === 'N/A' ? 'As needed' : `${exercise.reps} reps`}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {exercise.muscleGroup}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {exercise.weight}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={`p-6 rounded-lg border border-dashed text-center ${
                darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'
              }`}>
                <p>No exercises scheduled for today.</p>
              </div>
            )}
            
            <button 
              onClick={handleStart}
              disabled={workout.length === 0}
              className={`mt-6 w-full py-4 px-4 ${
                workout.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-medium rounded-lg shadow-sm transition-colors`}
            >
              Start Workout
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                <th className="px-4 py-3 text-left">Day</th>
                <th className="px-4 py-3 text-left">Focus</th>
                <th className="px-4 py-3 text-left">Muscle Group</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Object.keys(dayMuscleGroupMap).map(d => (
                <tr 
                  key={d} 
                  className={`${
                    d === day 
                      ? darkMode ? 'bg-blue-900/20' : 'bg-blue-50' 
                      : ''
                  }`}
                >
                  <td className="px-4 py-3 font-medium">
                    {d}
                  </td>
                  <td className="px-4 py-3">
                    {dayInfo[d].split(' - ')[0]}
                  </td>
                  <td className="px-4 py-3">
                    {dayMuscleGroupMap[d]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

// History component
const WorkoutHistory = ({ workoutHistory, darkMode }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!workoutHistory.length) return null;
  
  const displayHistory = expanded ? workoutHistory : workoutHistory.slice(-3);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-6`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Workout History</h2>
        {workoutHistory.length > 3 && (
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {expanded ? 'Show Less' : 'Show All'}
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {displayHistory.reverse().map((workout, idx) => (
          <div 
            key={idx} 
            className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">
                {new Date(workout.date).toLocaleDateString(undefined, { 
                  weekday: 'short',
                  month: 'short', 
                  day: 'numeric'
                })}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
              }`}>
                {workout.day}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <span className={`mr-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {workout.difficulty}
                </span>
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {workout.exercises.length} exercises
                </span>
              </div>
              <span className="font-mono font-medium">
                {formatTime(workout.duration)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Statistics component
const WorkoutStats = ({ workoutHistory, darkMode }) => {
  if (!workoutHistory.length) return null;
  
  // Calculate statistics
  const totalWorkouts = workoutHistory.length;
  const totalTime = workoutHistory.reduce((sum, workout) => sum + workout.duration, 0);
  const avgTime = Math.round(totalTime / totalWorkouts);
  
  // Count workouts by day
  const workoutsByDay = Object.keys(dayMuscleGroupMap).reduce((acc, day) => {
    acc[day] = workoutHistory.filter(w => w.day === day).length;
    return acc;
  }, {});
  
  // Find most frequent day
  const mostFrequentDay = Object.entries(workoutsByDay)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  // Find longest streak
  let currentStreak = 0;
  let longestStreak = 0;
  
  // Sort workouts by date
  const sortedWorkouts = [...workoutHistory].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Calculate longest streak
  for (let i = 0; i < sortedWorkouts.length; i++) {
    if (i === 0) {
      currentStreak = 1;
      longestStreak = 1;
    } else {
      const prevDate = new Date(sortedWorkouts[i-1].date);
      const currDate = new Date(sortedWorkouts[i].date);
      
      // Check if days are consecutive
      const diffTime = Math.abs(currDate - prevDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    }
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-6`}
    >
      <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Workouts</p>
          <p className="text-2xl font-bold">{totalWorkouts}</p>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Average Time</p>
          <p className="text-2xl font-bold">{formatTime(avgTime)}</p>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Longest Streak</p>
          <p className="text-2xl font-bold">{longestStreak} days</p>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Favorite Day</p>
          <p className="text-2xl font-bold">{mostFrequentDay}</p>
        </div>
      </div>
      
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h3 className="text-sm font-medium mb-3">Workouts by Day</h3>
        <div className="space-y-2">
          {Object.entries(workoutsByDay).map(([day, count]) => (
            <div key={day} className="flex items-center">
              <span className="w-20 text-sm">{day}</span>
              <div className="flex-1">
                <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(count / totalWorkouts) * 100}%` }}
                  ></div>
                </div>
              </div>
              <span className="ml-2 text-sm font-medium">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// This snippet focuses on the part with the potential error - the Header component
// Likely in the menu section

const Header = ({ 
  darkMode, 
  setDarkMode, 
  active, 
  progressPercentage, 
  elapsedTime 
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <header className="mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dumbbell Workout</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your personal fitness companion
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${
              darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-800'
            }`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-2 rounded-full ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
              }`}
              aria-label="Menu"
            >
              ☰
            </button>

            {menuOpen && (
              <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden z-10 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <ul>
                  <li>
                    <a
                      href="https://iamdusty.github.io/CalTracker/"
                      className={`block px-4 py-3 text-sm ${
                        darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Calorie Tracker
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={() => setMenuOpen(false)} 
                      className={`block w-full text-left px-4 py-3 text-sm ${
                        darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
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
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Workout Progress</span>
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
  );
};

// Main App Component
function App() {
  // State for workout settings
  const [day, setDay] = useState(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  });
  const [baseWeight, setBaseWeight] = useState(20);
  const [difficultyLevel, setDifficultyLevel] = useState('Intermediate');
  const [workout, setWorkout] = useState([]);
  
  // State for active workout
  const [active, setActive] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // State for rest timer
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restCountdown, setRestCountdown] = useState(60);
  const [customRestTime, setCustomRestTime] = useState(60);
  
  // UI state
  const [showCongrats, setShowCongrats] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [workoutStats, setWorkoutStats] = useState({ exercises: 0, sets: 0, calories: 0 });
  
  // History and preferences
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

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

  // Click outside handler for menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        // Close any open menu when clicking outside
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Are you sure you want to end your workout?")) {
      setActive(false);
      setCurrentSet(1);
      setCurrentExerciseIndex(0);
      setElapsedTime(0);
      setShowRestTimer(false);
      setShowInstructions(false);
      setRestCountdown(customRestTime); // Reset rest timer
    }
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
    
    // Calculate approximate calories burned (very rough estimate)
    // Formula: calories = duration (min) × MET × weight (kg) / 60
    // Where MET is metabolic equivalent (around 4-6 for moderate dumbbell training)
    const MET = difficultyLevel === 'Beginner' ? 4 : 
                difficultyLevel === 'Intermediate' ? 5 : 
                difficultyLevel === 'Advanced' ? 6 : 7;
    const userWeight = 70; // Default assumption in kg
    const caloriesBurned = Math.round((duration / 60) * MET * userWeight / 60 * 100);
    
    // Set workout stats for display in congrats modal
    setWorkoutStats({
      exercises: workout.length,
      sets: 4,
      calories: caloriesBurned
    });
    
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

  // Progress calculation
  const totalExercises = workout.length * 4; // 4 sets
  const completedExercises = ((currentSet - 1) * workout.length) + currentExerciseIndex;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  // Get next exercise for rest timer
  const nextExercise = workout[(currentExerciseIndex + 1) % workout.length]?.name || 
                        (currentExerciseIndex === workout.length - 1 ? "Next set" : "");

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <Header 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          active={active} 
          progressPercentage={progressPercentage} 
          elapsedTime={elapsedTime}
        />

        {active ? (
          <ActiveWorkout 
            workout={workout}
            currentSet={currentSet}
            currentExerciseIndex={currentExerciseIndex}
            elapsedTime={elapsedTime}
            progressPercentage={progressPercentage}
            showInstructions={showInstructions}
            toggleInstructions={toggleInstructions}
            completeRep={completeRep}
            handleCancelWorkout={handleCancelWorkout}
            darkMode={darkMode}
          />
        ) : (
          <>
            <SetupWorkout 
              day={day}
              setDay={setDay}
              baseWeight={baseWeight}
              setBaseWeight={setBaseWeight}
              difficultyLevel={difficultyLevel}
              setDifficultyLevel={setDifficultyLevel}
              customRestTime={customRestTime}
              setCustomRestTime={setCustomRestTime}
              workout={workout}
              handleStart={handleStart}
              darkMode={darkMode}
            />
            <ExerciseLibrary darkMode={darkMode} />
             
            {workoutHistory.length > 0 && (
              <>
                <WorkoutStats 
                  workoutHistory={workoutHistory}
                  darkMode={darkMode}
                />
                
                <WorkoutHistory 
                  workoutHistory={workoutHistory}
                  darkMode={darkMode}
                />
              </>
            )}
          </>
        )}
        
        {showRestTimer && (
          <RestTimer 
            restCountdown={restCountdown}
            customRestTime={customRestTime}
            skipRest={skipRest}
            nextExercise={nextExercise}
          />
        )}
        
        {showCongrats && (
          <CongratsModal 
            elapsedTime={elapsedTime}
            workoutStats={workoutStats}
            closeCongrats={closeCongrats}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
}

export default App;