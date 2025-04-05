
import React from 'react';
import type { CalendarEvent } from '@/services/calendarService';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { MapPin, Clock, Calendar, Edit } from 'lucide-react';

interface EventItemProps {
  event: CalendarEvent;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  return (
    <div 
      className={cn(
        "calendar-event p-2 rounded-lg cursor-pointer shadow-sm border transition-all hover:shadow-md relative group",
        event.type === 'work' && "bg-red-50 border-red-200 text-red-900",
        event.type === 'personal' && "bg-blue-50 border-blue-200 text-blue-900",
        event.type === 'focus' && "bg-amber-50 border-amber-200 text-amber-900",
        event.type === 'other' && "bg-purple-50 border-purple-200 text-purple-900"
      )}
    >
      <div className="font-medium text-sm">{event.title}</div>
      
      <div className="flex items-center gap-1 text-gray-600 text-xs mt-1">
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
      
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Edit className="h-3 w-3 text-gray-500" />
      </div>
    </div>
  );
};

export default EventItem;
