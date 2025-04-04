
import React from 'react';
import { Button } from '@/components/ui/button';
import { useCalendar } from '@/context/CalendarContext';
import { format, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface CalendarHeaderProps {
  onAddEvent: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ onAddEvent }) => {
  const { selectedDate, setSelectedDate, view, setView } = useCalendar();

  const navigatePrevious = () => {
    switch (view) {
      case 'day':
        setSelectedDate(subDays(selectedDate, 1));
        break;
      case 'week':
        setSelectedDate(subWeeks(selectedDate, 1));
        break;
      case 'month':
        setSelectedDate(subMonths(selectedDate, 1));
        break;
    }
  };

  const navigateNext = () => {
    switch (view) {
      case 'day':
        setSelectedDate(addDays(selectedDate, 1));
        break;
      case 'week':
        setSelectedDate(addWeeks(selectedDate, 1));
        break;
      case 'month':
        setSelectedDate(addMonths(selectedDate, 1));
        break;
    }
  };

  const navigateToday = () => {
    setSelectedDate(new Date());
  };

  const getHeaderTitle = () => {
    switch (view) {
      case 'day':
        return format(selectedDate, 'MMMM d, yyyy');
      case 'week':
        return `Week of ${format(selectedDate, 'MMMM d, yyyy')}`;
      case 'month':
        return format(selectedDate, 'MMMM yyyy');
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold">{getHeaderTitle()}</h1>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        <div className="bg-gray-100 rounded-md flex">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setView('day')}
            className={`rounded-r-none ${view === 'day' ? 'bg-calendar text-white hover:bg-calendar-focus' : ''}`}
          >
            Day
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setView('week')}
            className={`rounded-none ${view === 'week' ? 'bg-calendar text-white hover:bg-calendar-focus' : ''}`}
          >
            Week
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setView('month')}
            className={`rounded-l-none ${view === 'month' ? 'bg-calendar text-white hover:bg-calendar-focus' : ''}`}
          >
            Month
          </Button>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={navigateToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Button onClick={onAddEvent} className="bg-calendar hover:bg-calendar-focus ml-1">
          <Plus className="h-4 w-4 mr-1" /> Event
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
