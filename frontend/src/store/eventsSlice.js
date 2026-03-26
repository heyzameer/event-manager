import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchEventsForProfile = createAsyncThunk(
    'events/fetchEventsForProfile',
    async ({ profileId, timezone, page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await api.get('/events', { 
                params: { profileId, timezone, page, limit } 
            });
            // Backend returns { events: [], pagination: {} }
            return response.data; 
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const eventsSlice = createSlice({
    name: 'events',
    initialState: {
        list: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
        viewTimezone: localStorage.getItem('viewTimezone') || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        loading: false,
        error: null,
    },
    reducers: {
        setViewTimezone: (state, action) => {
            state.viewTimezone = action.payload;
            localStorage.setItem('viewTimezone', action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEventsForProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEventsForProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.events || [];
                state.pagination = action.payload.pagination || state.pagination;
            })
            .addCase(fetchEventsForProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setViewTimezone } = eventsSlice.actions;
export default eventsSlice.reducer;
