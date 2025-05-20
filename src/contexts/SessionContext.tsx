
import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SecurityEvent } from '@/types/metrics';

interface SessionContextType {
  sessionId: string;
  lastActivity: Date;
  updateLastActivity: () => void;
  logEvent: (event: SecurityEvent, metadata?: any) => void;
  events: Array<{
    eventType: SecurityEvent;
    timestamp: Date;
    metadata?: any;
  }>;
  clearEvents: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionId] = useState<string>(uuidv4());
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const [events, setEvents] = useState<Array<{
    eventType: SecurityEvent;
    timestamp: Date;
    metadata?: any;
  }>>([]);

  const updateLastActivity = () => {
    setLastActivity(new Date());
  };

  const logEvent = (event: SecurityEvent, metadata?: any) => {
    setEvents(prevEvents => [
      ...prevEvents,
      {
        eventType: event,
        timestamp: new Date(),
        metadata
      }
    ]);
  };

  const clearEvents = () => {
    setEvents([]);
  };

  // Update activity on user interaction
  useEffect(() => {
    const handleActivity = () => {
      updateLastActivity();
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, []);

  return (
    <SessionContext.Provider value={{
      sessionId,
      lastActivity,
      updateLastActivity,
      logEvent,
      events,
      clearEvents
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
