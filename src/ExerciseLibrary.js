import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Exercise data organized by muscle groups
export const exercisesByMuscleGroup = {
  Chest: [
    {
      name: 'Dumbbell Bench Press',
      instructions: 'Lie on a bench with a dumbbell in each hand at chest level. Press the weights upward until your arms are extended, then lower them back to the starting position.',
      reps: '8-12',
      muscles: 'Chest, Shoulders, Triceps'
    },
    {
      name: 'Dumbbell Flyes',
      instructions: 'Lie on a bench with a dumbbell in each hand, arms extended above your chest. With a slight bend in your elbows, lower the weights out to the sides in an arc motion, then bring them back together above your chest.',
      reps: '10-15',
      muscles: 'Chest, Shoulders'
    },
    {
      name: 'Push-Ups',
      instructions: 'Start in a plank position with hands slightly wider than shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up to the starting position.',
      reps: '10-20',
      muscles: 'Chest, Shoulders, Triceps, Core'
    },
    {
      name: 'Incline Dumbbell Press',
      instructions: 'Lie on an incline bench with a dumbbell in each hand at chest level. Press the weights upward until your arms are extended, then lower them back to the starting position.',
      reps: '8-12',
      muscles: 'Upper Chest, Shoulders, Triceps'
    }
  ],
  Back: [
    {
      name: 'Dumbbell Rows',
      instructions: 'Bend at the waist with one knee and hand on a bench, holding a dumbbell in the other hand. Pull the weight up toward your hip, keeping your elbow close to your body, then lower it back down.',
      reps: '8-12',
      muscles: 'Upper Back, Lats, Biceps'
    },
    {
      name: 'Renegade Rows',
      instructions: 'Start in a push-up position with a dumbbell in each hand. Row one dumbbell up toward your hip while balancing on the other hand, then lower and repeat on the other side.',
      reps: '8-10 per side',
      muscles: 'Back, Core, Shoulders'
    },
    {
      name: 'Pull-Ups',
      instructions: 'Hang from a bar with palms facing away from you. Pull your body up until your chin clears the bar, then lower back down with control.',
      reps: '5-10',
      muscles: 'Lats, Upper Back, Biceps'
    },
    {
      name: 'Lat Pulldowns',
      instructions: 'Sit at a lat pulldown machine, grab the bar with hands wider than shoulder-width. Pull the bar down to your chest, then slowly return to the starting position.',
      reps: '10-12',
      muscles: 'Lats, Upper Back, Biceps'
    }
  ],
  Shoulders: [
    {
      name: 'Shoulder Press',
      instructions: 'Sit or stand with a dumbbell in each hand at shoulder height. Press the weights upward until arms are fully extended, then lower them back to shoulder height.',
      reps: '8-12',
      muscles: 'Shoulders, Triceps'
    },
    {
      name: 'Lateral Raises',
      instructions: 'Stand with dumbbells at your sides. Raise the weights out to the sides until they reach shoulder height, maintaining a slight bend in your elbows, then lower them back down.',
      reps: '12-15',
      muscles: 'Lateral Deltoids'
    },
    {
      name: 'Front Raises',
      instructions: 'Stand with dumbbells in front of your thighs. Raise one or both weights straight in front of you until they reach shoulder height, then lower them back down.',
      reps: '12-15',
      muscles: 'Front Deltoids'
    },
    {
      name: 'Reverse Flyes',
      instructions: 'Bend at the waist with dumbbells hanging down. Raise the weights out to the sides, squeezing your shoulder blades together, then lower them back down.',
      reps: '12-15',
      muscles: 'Rear Deltoids, Upper Back'
    }
  ],
  Arms: [
    {
      name: 'Bicep Curls',
      instructions: 'Stand with a dumbbell in each hand, arms extended. Curl the weights toward your shoulders while keeping your upper arms still, then lower them back down.',
      reps: '10-12',
      muscles: 'Biceps'
    },
    {
      name: 'Hammer Curls',
      instructions: 'Stand with a dumbbell in each hand, palms facing inward. Curl the weights toward your shoulders while keeping your upper arms still and palms facing each other, then lower them back down.',
      reps: '10-12',
      muscles: 'Biceps, Forearms'
    },
    {
      name: 'Concentration Curls',
      instructions: 'Sit on a bench, lean forward with one arm braced against your inner thigh, holding a dumbbell. Curl the weight toward your shoulder, then lower it back down.',
      reps: '10-12',
      muscles: 'Biceps'
    },
    {
      name: 'Zottman Curls',
      instructions: 'Stand with dumbbells at your sides. Curl the weights up with palms facing up, then at the top rotate your wrists so palms face down, and lower the weights with palms down.',
      reps: '10-12',
      muscles: 'Biceps, Forearms'
    },
    {
      name: 'Tricep Dips',
      instructions: 'Sit on the edge of a bench or chair with hands gripping the edge beside your hips. Slide your butt off the bench, then bend your elbows to lower your body. Push back up to the starting position.',
      reps: '10-15',
      muscles: 'Triceps'
    },
    {
      name: 'Skull Crushers',
      instructions: 'Lie on a bench holding dumbbells above your chest with arms extended. Bend your elbows to lower the weights toward your forehead, then extend your arms to return to the starting position.',
      reps: '10-12',
      muscles: 'Triceps'
    },
    {
      name: 'Incline Curls',
      instructions: 'Sit on an incline bench with a dumbbell in each hand hanging at your sides. Curl the weights toward your shoulders, then lower them back down.',
      reps: '10-12',
      muscles: 'Biceps'
    },
    {
      name: 'Cross-body Hammer Curls',
      instructions: 'Stand with a dumbbell in each hand at your sides. Curl one dumbbell up and across your body toward the opposite shoulder, then lower and repeat with the other arm.',
      reps: '10-12 per arm',
      muscles: 'Biceps, Forearms'
    }
  ],
  Legs: [
    {
      name: 'Goblet Squats',
      instructions: 'Stand with feet shoulder-width apart, holding a dumbbell vertically close to your chest. Bend your knees and hips to lower your body, then push through your heels to return to standing.',
      reps: '10-15',
      muscles: 'Quadriceps, Glutes, Core'
    },
    {
      name: 'Dumbbell Lunges',
      instructions: 'Stand with dumbbells at your sides. Take a step forward with one leg and lower your body until both knees are bent at 90-degree angles. Push back up and repeat with the other leg.',
      reps: '10-12 per leg',
      muscles: 'Quadriceps, Glutes, Hamstrings'
    },
    {
      name: 'Romanian Deadlifts',
      instructions: 'Stand with dumbbells in front of your thighs. Hinge at your hips to lower the weights along your legs while keeping your back straight, then return to standing.',
      reps: '10-12',
      muscles: 'Hamstrings, Glutes, Lower Back'
    },
    {
      name: 'Step-Ups',
      instructions: 'Stand facing a bench or platform with dumbbells at your sides. Step up with one foot, pressing through the heel to bring your body up, then step back down and repeat with the other leg.',
      reps: '10-12 per leg',
      muscles: 'Quadriceps, Glutes'
    },
    {
      name: 'Calf Raises',
      instructions: 'Stand with dumbbells at your sides. Raise your heels off the ground by pushing through the balls of your feet, then lower back down.',
      reps: '15-20',
      muscles: 'Calves'
    },
    {
      name: 'Dumbbell Squats',
      instructions: 'Stand with feet shoulder-width apart, holding dumbbells at your sides. Bend your knees and hips to lower your body, then push through your heels to return to standing.',
      reps: '10-15',
      muscles: 'Quadriceps, Glutes, Hamstrings'
    }
  ],
  Core: [
    {
      name: 'Russian Twists',
      instructions: 'Sit on the floor with knees bent and feet lifted slightly. Hold a dumbbell with both hands and twist your torso to touch the weight to the floor on each side.',
      reps: '15-20 per side',
      muscles: 'Obliques, Abdominals'
    },
    {
      name: 'Weighted Sit-ups',
      instructions: 'Lie on your back with knees bent, holding a dumbbell against your chest. Use your abdominal muscles to sit up, then lower back down with control.',
      reps: '12-15',
      muscles: 'Abdominals'
    },
    {
      name: 'Dumbbell Side Bends',
      instructions: 'Stand with feet shoulder-width apart, holding a dumbbell in one hand. Bend sideways toward the weight, then return to an upright position.',
      reps: '12-15 per side',
      muscles: 'Obliques'
    },
    {
      name: 'Leg Raises with Dumbbell',
      instructions: 'Lie on your back with a dumbbell held between your feet. Keep your legs straight as you raise them toward the ceiling, then lower them back down without touching the floor.',
      reps: '12-15',
      muscles: 'Lower Abs'
    },
    {
      name: 'Plank',
      instructions: 'Start in a push-up position, then lower onto your forearms. Keep your body in a straight line from head to heels, engaging your core muscles.',
      reps: '30-60 seconds',
      muscles: 'Core, Shoulders, Back'
    },
    {
      name: 'Bicycle Crunches',
      instructions: 'Lie on your back with hands behind your head and legs lifted. Bring one knee toward your chest while twisting to bring the opposite elbow toward that knee, then switch sides.',
      reps: '15-20 per side',
      muscles: 'Abdominals, Obliques'
    }
  ],
  Recovery: [
    {
      name: 'Active Recovery',
      instructions: 'Light activity such as walking, gentle cycling, or easy swimming to promote blood flow without straining muscles.',
      reps: '15-30 minutes',
      muscles: 'Total Body'
    },
    {
      name: 'Light Stretching',
      instructions: 'Gentle stretching focusing on major muscle groups, holding each stretch for 20-30 seconds without bouncing.',
      reps: '10-15 minutes',
      muscles: 'Total Body'
    },
    {
      name: 'Foam Rolling',
      instructions: 'Use a foam roller on tight muscles, rolling slowly and pausing on tender areas to release tension.',
      reps: '1-2 minutes per muscle group',
      muscles: 'Myofascial Release'
    },
    {
      name: 'Mobility Work',
      instructions: 'Gentle, controlled movements through a full range of motion to improve joint mobility and prevent injury.',
      reps: '10-15 minutes',
      muscles: 'Joint Mobility'
    }
  ],
  FullBody: [
    {
      name: 'Full Body Circuit',
      instructions: 'Perform each exercise for 45 seconds with minimal rest between exercises, focusing on form and control.',
      reps: '45 seconds each',
      muscles: 'Full Body'
    },
    {
      name: 'Dumbbell Thrusters',
      instructions: 'Hold dumbbells at shoulder height, squat down, then as you stand up, press the weights overhead in one fluid motion.',
      reps: '12-15',
      muscles: 'Shoulders, Quadriceps, Glutes'
    },
    {
      name: 'Renegade Rows',
      instructions: 'In plank position with hands on dumbbells, row one dumbbell up while balancing on the other, then alternate.',
      reps: '8-10 per side',
      muscles: 'Back, Core, Chest'
    },
    {
      name: 'Dumbbell Burpees',
      instructions: 'With dumbbells in hand, perform a burpee and add a dumbbell curl and press at the top of the movement.',
      reps: '10-12',
      muscles: 'Full Body, Cardiovascular'
    }
  ]
};

// Instructions for each exercise are now included in the exercisesByMuscleGroup object

// Export muscle group mapping
export const muscleGroups = {
  'Dumbbell Bench Press': 'Chest, Shoulders, Triceps',
  'Dumbbell Flyes': 'Chest, Shoulders',
  'Push-Ups': 'Chest, Shoulders, Triceps, Core',
  'Incline Dumbbell Press': 'Upper Chest, Shoulders, Triceps',
  'Dumbbell Rows': 'Upper Back, Lats, Biceps',
  'Renegade Rows': 'Back, Core, Shoulders',
  'Pull-Ups': 'Lats, Upper Back, Biceps',
  'Lat Pulldowns': 'Lats, Upper Back, Biceps',
  'Shoulder Press': 'Shoulders, Triceps',
  'Lateral Raises': 'Lateral Deltoids',
  'Front Raises': 'Front Deltoids',
  'Reverse Flyes': 'Rear Deltoids, Upper Back',
  'Bicep Curls': 'Biceps',
  'Hammer Curls': 'Biceps, Forearms',
  'Concentration Curls': 'Biceps',
  'Zottman Curls': 'Biceps, Forearms',
  'Tricep Dips': 'Triceps',
  'Skull Crushers': 'Triceps',
  'Goblet Squats': 'Quadriceps, Glutes, Core',
  'Dumbbell Lunges': 'Quadriceps, Glutes, Hamstrings',
  'Romanian Deadlifts': 'Hamstrings, Glutes, Lower Back',
  'Step-Ups': 'Quadriceps, Glutes',
  'Calf Raises': 'Calves',
  'Dumbbell Squats': 'Quadriceps, Glutes, Hamstrings',
  'Russian Twists': 'Obliques, Core',
  'Weighted Sit-ups': 'Abs, Core',
  'Dumbbell Side Bends': 'Obliques',
  'Leg Raises with Dumbbell': 'Lower Abs',
  'Plank': 'Core, Shoulders, Back',
  'Bicycle Crunches': 'Abdominals, Obliques',
  'Incline Curls': 'Biceps',
  'Cross-body Hammer Curls': 'Biceps, Forearms',
  'Full Body Circuit': 'Full Body',
  'Dumbbell Thrusters': 'Shoulders, Quadriceps, Glutes',
  'Dumbbell Burpees': 'Full Body, Cardiovascular',
  'Active Recovery': 'Recovery',
  'Light Stretching': 'Flexibility',
  'Foam Rolling': 'Myofascial Release',
  'Mobility Work': 'Joint Mobility',
  '21s': 'Biceps'
};

// Exercise Library Component
const ExerciseLibrary = ({ darkMode }) => {
  const [activeGroup, setActiveGroup] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const handleGroupClick = (group) => {
    setActiveGroup(activeGroup === group ? null : group);
    setSelectedExercise(null);
  };

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
  };

  const closeExerciseDetails = () => {
    setSelectedExercise(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-6`}
    >
      <h2 className="text-xl font-semibold mb-4">Exercise Library</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Browse exercises by muscle group. Click on any exercise to view detailed instructions.
      </p>

      {/* Muscle Group Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        {Object.keys(exercisesByMuscleGroup).map((group) => (
          <button
            key={group}
            onClick={() => handleGroupClick(group)}
            className={`p-3 rounded-lg text-center transition-colors ${
              activeGroup === group
                ? darkMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-800'
                : darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            <span className="font-medium">{group}</span>
            <span className="block text-xs mt-1">
              {exercisesByMuscleGroup[group].length} exercises
            </span>
          </button>
        ))}
      </div>

      {/* Exercise List */}
      {activeGroup && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-4"
        >
          <h3 className="font-medium text-lg mb-3">{activeGroup} Exercises</h3>
          <div className={`rounded-lg overflow-hidden border ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            {exercisesByMuscleGroup[activeGroup].map((exercise, idx) => (
              <div
                key={idx}
                onClick={() => handleExerciseClick(exercise)}
                className={`p-4 ${
                  idx !== exercisesByMuscleGroup[activeGroup].length - 1
                    ? `border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`
                    : ''
                } ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} 
                  cursor-pointer transition-colors`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{exercise.name}</p>
                    <div className="flex items-center text-xs mt-1">
                      <span className={`mr-2 px-2 py-0.5 rounded-full ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {exercise.reps} reps
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {exercise.muscles}
                      </span>
                    </div>
                  </div>
                  <div className={`text-sm ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    View →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70"
        >
          <div className={`p-8 rounded-xl shadow-xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } max-w-md w-full m-4`}>
            <h3 className="text-2xl font-bold mb-3">{selectedExercise.name}</h3>
            
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
              } mb-3`}>
                {selectedExercise.muscles}
              </span>
              
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              } mb-4`}>
                <h4 className="font-medium mb-2">How to perform:</h4>
                <p className="text-sm">{selectedExercise.instructions}</p>
              </div>
              
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                } flex-1 text-center`}>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Recommended</p>
                  <p className="font-semibold">{selectedExercise.reps} reps</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={closeExerciseDetails}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExerciseLibrary;