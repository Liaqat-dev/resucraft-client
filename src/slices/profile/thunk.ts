import { createAsyncThunk } from '@reduxjs/toolkit';
import { profileService } from '@src/services/profileService.ts';
import { setPersonalInfo, updatePersonalInfo } from '@src/slices/profile/reducer.ts';
import { PersonalInfo } from '@dtos/index.ts';

// Fetch personal info from the server and store in Redux
export const fetchPersonalInfo = createAsyncThunk(
    'profile/fetchPersonalInfo',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const data = await profileService.getPersonalInfo();
            dispatch(setPersonalInfo(data));
            return data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to fetch personal info',
            });
        }
    }
);

// Save personal info to the server and update Redux state
export const savePersonalInfo = createAsyncThunk(
    'profile/savePersonalInfo',
    async (data: PersonalInfo, { dispatch, rejectWithValue }) => {
        try {
            await profileService.setPersonalInfo(data);
            dispatch(updatePersonalInfo(data));
            return data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to save personal info',
            });
        }
    }
);