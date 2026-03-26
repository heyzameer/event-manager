import { configureStore } from '@reduxjs/toolkit';
import profilesReducer from './profilesSlice';
import eventsReducer from './eventsSlice';

export const store = configureStore({
    reducer: {
        profiles: profilesReducer,
        events: eventsReducer,
    },
});
