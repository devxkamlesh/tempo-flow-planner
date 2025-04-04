
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CalendarEvent, generateMockEvents, createEvent, updateEvent, deleteEvent } from '../services/calendarService';

interface CalendarContextType {
  events: CalendarEvent[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  editEvent: (event: CalendarEvent) => void;
  removeEvent: (id: string) => void;
  view: 'day' | 'week' | 'month';
  setView: (view: 'day' | 'week' | 'month') => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');

  useEffect(() => {
    // Initialize with mock data
    const mockEvents = generateMockEvents(selectedDate);
    setEvents(mockEvents);
  }, []);

  const addEvent = (event: Omit<CalendarEvent, "id">) => {
    setEvents(prevEvents => createEvent(prevEvents, event));
  };

  const editEvent = (event: CalendarEvent) => {
    setEvents(prevEvents => updateEvent(prevEvents, event));
  };

  const removeEvent = (id: string) => {
    setEvents(prevEvents => deleteEvent(prevEvents, id));
  };

  return (
    <CalendarContext.Provider
      value={{
        events,
        selectedDate,
        setSelectedDate,
        addEvent,
        editEvent,
        removeEvent,
        view,
        setView,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
