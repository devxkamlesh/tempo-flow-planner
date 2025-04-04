
import React from 'react';
import { format, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, isToday } from 'date-fns';
import { useCalendar } from '@/context/CalendarContext';
import { cn } from '@/lib/utils';
import { getEventsForDay } from '@/services/calendarService';

const MonthView: React.FC = () => {
  const { events, selectedDate, setSelectedDate } = useCalendar();
  
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const rows = [];
  let days = [];
  let day = startDate;
  
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      days.push(day);
      day = addDays(day, 1);
    }
    rows.push(days);
    days = [];
  }

  return (
    <div className="month-view border rounded-lg overflow-hidden">
      <div className="grid grid-cols-7 text-center py-2 bg-gray-50 border-b">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
          <div key={dayName} className="text-sm font-medium">
            {dayName}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 divide-y">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-7 divide-x h-28">
            {row.map((day, dayIndex) => {
              const dayEvents = getEventsForDay(events, day);
              const isCurrentMonth = isSameMonth(day, selectedDate);
              
              return (
                <div 
                  key={dayIndex} 
                  className={cn(
                    "p-1 overflow-hidden",
                    !isCurrentMonth && "bg-gray-50 text-gray-400",
                    isToday(day) && "bg-calendar-subtle/30",
                    isSameDay(day, selectedDate) && "ring-1 ring-inset ring-calendar"
                  )}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="text-right mb-1">
                    <span className={cn(
                      "text-sm inline-flex w-6 h-6 items-center justify-center",
                      isToday(day) && "rounded-full bg-calendar text-white"
                    )}>
                      {format(day, 'd')}
                    </span>
                  </div>
                  
                  <div className="space-y-1 overflow-y-auto max-h-[calc(100%-1.5rem)]">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div 
                        key={event.id}
                        className={cn(
                          "text-xs rounded py-0.5 px-1.5 truncate",
                          `bg-calendar-event-${event.type}`
                        )}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 pl-1.5">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;
