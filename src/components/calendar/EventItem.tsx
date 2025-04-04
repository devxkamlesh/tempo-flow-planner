
import React from 'react';
import type { CalendarEvent } from '@/services/calendarService';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { MapPin, Clock } from 'lucide-react';

interface EventItemProps {
  event: CalendarEvent;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  return (
    <div 
      className={cn(
        "calendar-event cursor-pointer shadow-sm",
        event.type === 'work' && "bg-calendar-event-work",
        event.type === 'personal' && "bg-calendar-event-personal",
        event.type === 'focus' && "bg-calendar-event-focus",
        event.type === 'other' && "bg-calendar-event-other"
      )}
    >
      <div className="font-medium">{event.title}</div>
      
      <div className="flex items-center gap-1 text-gray-600 text-xs">
        <Clock className="h-3 w-3" />
        <span>
          {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
        </span>
      </div>
      
      {event.location && (
        <div className="flex items-center gap-1 text-gray-600 text-xs mt-0.5">
          <MapPin className="h-3 w-3" />
          <span>{event.location}</span>
        </div>
      )}
    </div>
  );
};

export default EventItem;
