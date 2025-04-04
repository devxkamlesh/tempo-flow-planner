
import React from 'react';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isToday } from 'date-fns';
import { useCalendar } from '@/context/CalendarContext';
import { cn } from '@/lib/utils';
import EventItem from './EventItem';

const WeekView: React.FC = () => {
  const { events, selectedDate, setSelectedDate } = useCalendar();
  
  const startDate = startOfWeek(selectedDate);
  const endDate = endOfWeek(selectedDate);
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(startDate, i));
  }

  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      isSameDay(event.start, day)
    );
  };

  return (
    <div className="week-view">
      <div className="grid grid-cols-7 border-b mb-2">
        {days.map((day, index) => (
          <div 
            key={index} 
            className={cn(
              "py-2 text-center cursor-pointer transition-colors hover:bg-gray-50",
              isToday(day) && "bg-calendar-subtle",
              isSameDay(day, selectedDate) && "font-semibold text-calendar"
            )}
            onClick={() => setSelectedDate(day)}
          >
            <div className="text-sm text-gray-500">{format(day, 'EEE')}</div>
            <div className={cn(
              "w-8 h-8 mx-auto flex items-center justify-center rounded-full",
              isToday(day) && "bg-calendar text-white"
            )}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2 h-[calc(100vh-14rem)] overflow-y-auto">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          
          return (
            <div 
              key={index} 
              className={cn(
                "day-column border-r last:border-r-0 p-1 min-h-[300px]",
                isToday(day) && "bg-calendar-subtle/30",
              )}
            >
              <div className="space-y-1">
                {dayEvents.map(event => (
                  <EventItem key={event.id} event={event} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
