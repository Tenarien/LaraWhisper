import { createContext, useContext, useRef } from 'react';

export const EventBusContext = createContext();

export function EventBusProvider({ children }) {
    const listeners = useRef({});

    const emit = (event, data) => {
        (listeners.current[event] || []).forEach((cb) => cb(data));
    };

    const on = (event, callback) => {
        if (!listeners.current[event]) {
            listeners.current[event] = [];
        }
        listeners.current[event].push(callback);

        // return un‐subscriber
        return () => {
            listeners.current[event] =
                listeners.current[event].filter((cb) => cb !== callback);
        };
    };

    return (
        <EventBusContext.Provider value={{ emit, on }}>
            {children}
        </EventBusContext.Provider>
    );
}

export const useEventBus = () => useContext(EventBusContext);
