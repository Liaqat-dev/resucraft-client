import { useAppDispatch, useAppSelector } from './useRedux';
import { fetchPersonalInfo, savePersonalInfo } from '@src/slices/profile/thunk.ts';
import { PersonalInfo } from '@dtos/index.ts';

export function useProfile() {
    const dispatch = useAppDispatch();
    const { personalInfo, loading, error } = useAppSelector((state) => state.profile);

    return {
        personalInfo,
        loading,
        error,

        // Actions
        fetchPersonalInfo: () => dispatch(fetchPersonalInfo()),
        savePersonalInfo: (data: PersonalInfo) => dispatch(savePersonalInfo(data)),
    };
}