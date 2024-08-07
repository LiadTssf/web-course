import React, { useState } from 'react';
import Habit from './Habit';
import HabitForm from './HabitForm';
import { Button } from '@headlessui/react';






const Habits = ({ statuses ,updateCompletedDays,addHabit}) => {

  const [habits, setHabits] = useState(statuses);
  const [isModalOpened,setIsModalOpened] = useState(false);

  const closeModal =()=> {
    setIsModalOpened(false)
  }


  const addHabitToHabitsView=(newHabit)=>{
    addHabit(newHabit)
    setHabits((prevHabits) => [...prevHabits, newHabit]);
  }
  const handleMarkComplete = (habit) => {
    const updatedHabits = habits.map((h) => {
      if (h.name === habit.name) {
        const currentDay = new Date().getDay(); 
        return {
          ...h,
          completedDays: [...h.completedDays, currentDay],
        };
      }
      return h;
    });
    updateCompletedDays(updatedHabits);
    setHabits(updatedHabits);
    // Print all completed days for each habit
    updatedHabits.forEach(h => {
      console.log(`Habit: ${h.name}, Completed Days: ${h.completedDays}`);
    });
  };

  const handleUndo = (habit) => {
    const updatedHabits = habits.map((h) => {
      if (h.name === habit.name) {
        const currentDay = new Date().getDay();
        return { 
          ...h, 
          completedDays: h.completedDays.filter(day => day !== currentDay)
        };
      }
      return h;
    });
    updateCompletedDays(updatedHabits);
    setHabits(updatedHabits);
    updatedHabits.forEach(h => {
      console.log(`Habit: ${h.name}, Completed Days: ${h.completedDays}`);
    });
  };

  const getCurrentDay = () => {
    const date = new Date();
    const options = { weekday: 'short', month: 'long', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  const currentDay = getCurrentDay();

  // Sort habits: active today first, then inactive
  const today = new Date().getDay();
  const sortedHabits = [...habits].sort((a, b) => {
    const isActiveTodayA = a.Active_days.includes(today);
    const isActiveTodayB = b.Active_days.includes(today);
    return isActiveTodayB - isActiveTodayA; // true (1) comes before false (0)
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full md:w-1/2">
      <div className="flex justify-around">
      <h2 className="text-2xl font-bold mb-4">{currentDay}</h2>
      <button
        className="group cursor-pointer outline-none hover:rotate-90 duration-300"
        title="Add New"
        onClick={() => setIsModalOpened(true)}
       
      >
        <svg
          className="stroke-teal-500 fill-none group-hover:fill-teal-800 group-active:stroke-teal-200 group-active:fill-teal-600 group-active:duration-0 duration-300"
          viewBox="0 0 24 24"
          height="50px"
          width="50px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeWidth="1.5"
            d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
          ></path>
          <path strokeWidth="1.5" d="M8 12H16"></path>
          <path strokeWidth="1.5" d="M12 16V8"></path>
        </svg>
      </button>
      </div>
      
      <div className="h-2/3 overflow-y-auto custom-scrollbar">
        {sortedHabits.map((habit, index) => {
          const isActiveToday = habit.Active_days.includes(today);
          const isCompletedToday = habit.completedDays.includes(today);
          let status = isActiveToday ? (isCompletedToday ? 'Completed' : 'Pending') : `Inactive on ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}`;

          return (
            <Habit
              key={index}
              name={habit.name}
              status={status}
              color={habit.color}
              onMarkComplete={isActiveToday && !isCompletedToday ? () => handleMarkComplete(habit) : null}
              onUndo={isCompletedToday ? () => handleUndo(habit) : null}
            />
          );
        })}
      </div>
      <HabitForm closeModal={closeModal} isModalOpen={isModalOpened} addNewHabit={addHabitToHabitsView} />
      
    </div>
  );
};

export default Habits;
//<div className="bg-white rounded-lg shadow-md p-6 w-full md:w-1/2">