//HOSTED ON GITHUB PAGES. NO DATA CAN BE SAVED OR STORED

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

const generateWorkout = (day, baseWeight, difficultyLevel, intensityLevel) => {
  if (!exercises[day]) return [];
  const modifier = difficultyLevels[difficultyLevel] || 1;
  const intensityMultiplier = intensityLevel === 'Low' ? 0.8 : intensityLevel === 'High' ? 1.2 : 1;

  return exercises[day].map((exercise, index) => ({
    name: exercise,
    sets: 4,
    reps: exercise.includes('Recovery') || exercise.includes('Stretching') || 
          exercise.includes('Foam Rolling') || exercise.includes('Mobility') ? 
          'N/A' : Math.round(10 * intensityMultiplier),
    weight: exercise.includes('Recovery') || exercise.includes('Stretching') || 
            exercise.includes('Foam Rolling') || exercise.includes('Mobility') ? 
            'N/A' : `${Math.round((index % 2 === 0 ? baseWeight + 5 : baseWeight) * modifier * intensityMultiplier)} lbs`,
    completed: false,
    muscleGroup: muscleGroups[exercise] || 'General'
  }));
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
  const [intensityLevel, setIntensityLevel] = useState('Moderate');

  // Generate workout whenever day, baseWeight, difficulty, or intensity changes
  useEffect(() => {
    setWorkout(generateWorkout(day, baseWeight, difficultyLevel, intensityLevel));
  }, [day, baseWeight, difficultyLevel, intensityLevel]);

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
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-3xl font-bold text-center sm:text-left">Dumbbell Workout Planner</h1>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 mt-4 sm:mt-0 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-800'}`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-6">
          {/* Content */}
        </div>
      </div>
    </div>
  );
}

export default App;