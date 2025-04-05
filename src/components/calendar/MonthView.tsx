
import React from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay,
  addDays,
  format,
  isToday
} from 'date-fns';
import { useCalendar } from '@/context/CalendarContext';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import type { CalendarEvent } from '@/services/calendarService';

interface MonthViewProps {
  onEditEvent?: (event: CalendarEvent) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ onEditEvent }) => {
  const { events, selectedDate, setSelectedDate } = useCalendar();

  // Custom day renderer to show events
  const renderDay = (day: Date) => {
    const dayEvents = events.filter(event => 
      isSameDay(event.start, day)
    );

    const isSelected = isSameDay(day, selectedDate);
    const _isToday = isToday(day);
    const isCurrentMonth = isSameMonth(day, selectedDate);

    return (
      <div className={cn(
        "w-full h-full min-h-[80px] p-1", 
        !isCurrentMonth && "opacity-40",
        isSelected && "bg-calendar-subtle/20"
      )}>
        <div className={cn(
          "text-center mb-1 font-medium text-xs",
          _isToday && "bg-calendar text-white rounded-full w-5 h-5 flex items-center justify-center mx-auto"
        )}>
          {format(day, 'd')}
        </div>
        <div className="overflow-y-auto max-h-[60px]">
          {dayEvents.slice(0, 3).map(event => (
            <div 
              key={event.id}
              onClick={(e) => {
                e.stopPropagation();
                onEditEvent && onEditEvent(event);
              }}
              className={cn(
                "text-xs mb-1 px-1 py-0.5 rounded truncate cursor-pointer",
                event.type === 'work' && "bg-red-100 text-red-800",
                event.type === 'personal' && "bg-blue-100 text-blue-800",
                event.type === 'focus' && "bg-amber-100 text-amber-800",
                event.type === 'other' && "bg-purple-100 text-purple-800"
              )}
            >
              {event.title}
            </div>
          ))}
          {dayEvents.length > 3 && (
            <div className="text-xs text-gray-500 px-1">
              +{dayEvents.length - 3} more
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="month-view">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        className="rounded-md border w-full"
        components={{
          Day: ({ date, ...props }) => (
            <div 
              {...props}
              className="h-full w-full"
              onClick={() => setSelectedDate(date)}
            >
              {renderDay(date)}
            </div>
          ),
        }}
      />
    </div>
  );
};

export default MonthView;
