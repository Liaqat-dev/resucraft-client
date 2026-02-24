import {useAppDispatch, useAppSelector} from './useRedux';
import {
    changePassword,
    fetchUserProfile,
    forgotPassword,
    googleLogin,
    loginUser,
    logoutAllDevices,
    logoutUser,
    refreshAccessToken,
    registerUser,
    resendCode,
    resetPassword,
    updateAccountInfo,
    verifyEmail
} from '@src/slices/auth/thunk.ts';
import {
    ChangePasswordData,
    LoginData,
    RegisterData,
    ResetPasswordData,
    updateAccountInfoData,
    VerifyEmailData
} from '@dtos/auth.ts';

export function useAuth() {
    const dispatch = useAppDispatch();
    const {user, accessToken, loading, error, isAuthenticated} = useAppSelector(
        (state) => state.auth
    );

    return {
        user,
        accessToken,
        loading,
        error,
        isAuthenticated,

        // Actions
        login: (data: LoginData) => dispatch(loginUser(data)),
        googleLogin: (accessToken: string) => dispatch(googleLogin(accessToken)),
        register: (data: RegisterData) => dispatch(registerUser(data)),
        verifyEmail: (data: VerifyEmailData) => dispatch(verifyEmail(data)),
        resendCode: (email: string) => dispatch(resendCode(email)),
        fetchProfile: () => dispatch(fetchUserProfile()),
        updateAccountInfo: (data: updateAccountInfoData) => dispatch(updateAccountInfo(data)),
        changePassword: (data: ChangePasswordData) => dispatch(changePassword(data)),
        forgotPassword: (email: string) => dispatch(forgotPassword(email)),
        resetPassword: (data: ResetPasswordData) => dispatch(resetPassword(data)),
        logout: () => dispatch(logoutUser()),
        logoutAll: () => dispatch(logoutAllDevices()),
        refreshToken: () => dispatch(refreshAccessToken())
    };
}