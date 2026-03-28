import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { ENDPOINTS } from '../config/endpoints';

export const fetchProfiles = createAsyncThunk(
    'profiles/fetchProfiles',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(ENDPOINTS.PROFILES);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createProfileThunk = createAsyncThunk(
    'profiles/createProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await api.post(ENDPOINTS.PROFILES, profileData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const profilesSlice = createSlice({
    name: 'profiles',
    initialState: {
        list: [],
        selectedProfileId: localStorage.getItem('selectedProfileId') || null,
        loading: false,
        error: null,
    },
    reducers: {
        setSelectedProfile: (state, action) => {
            state.selectedProfileId = action.payload;
            localStorage.setItem('selectedProfileId', action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfiles.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfiles.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
                if (!state.selectedProfileId && action.payload.length > 0) {
                    state.selectedProfileId = action.payload[0]._id;
                    localStorage.setItem('selectedProfileId', action.payload[0]._id);
                }
            })
            .addCase(fetchProfiles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setSelectedProfile } = profilesSlice.actions;
export default profilesSlice.reducer;
