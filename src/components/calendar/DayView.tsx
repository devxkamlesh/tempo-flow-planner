
import React from 'react';
import { format, addHours, startOfDay, isSameDay } from 'date-fns';
import { useCalendar } from '@/context/CalendarContext';
import type { CalendarEvent } from '@/services/calendarService';
import EventItem from './EventItem';

interface DayViewProps {
  onEditEvent?: (event: CalendarEvent) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const DayView: React.FC<DayViewProps> = ({ onEditEvent }) => {
  const { events, selectedDate } = useCalendar();

  const dayEvents = events.filter(event => 
    isSameDay(event.start, selectedDate)
  );

  const getEventsForHour = (hour: number) => {
    return dayEvents.filter(event => {
      const eventHour = event.start.getHours();
      return eventHour === hour;
    });
  };

  return (
    <div className="day-view h-[calc(100vh-12rem)] overflow-y-auto">
      <div className="sticky top-0 bg-background z-10 py-2 border-b">
        <h2 className="text-xl font-medium p-3">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h2>
      </div>
      
      <div className="relative">
        {HOURS.map(hour => {
          const hourEvents = getEventsForHour(hour);
          const currentTime = addHours(startOfDay(selectedDate), hour);
          
          return (
            <div key={hour} className="hour-row flex border-b border-gray-100 min-h-[80px] hover:bg-gray-50/50">
              <div className="hour-label w-16 py-2 text-right pr-3 text-sm text-gray-500 font-medium">
                {format(currentTime, 'h a')}
              </div>
              <div className="flex-1 py-1 pl-2 relative">
                {hourEvents.map(event => (
                  <div key={event.id} onClick={() => onEditEvent && onEditEvent(event)}>
                    <EventItem event={event} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayView;
