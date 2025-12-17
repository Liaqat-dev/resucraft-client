import {useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {useAuth} from '@hooks/useAuth';
import {FormInputFloatingWithIcon, GlobalErrorAlert, useForm} from '@hooks/useForm';
import * as Yup from 'yup';
import {CheckCircle, Eye, EyeOff, Lock} from 'lucide-react';
import toast from 'react-hot-toast';
import PasswordStrength from '@src/components/common/passwordStrength.tsx';

const resetPasswordSchema = Yup.object({
    password: Yup.string()
        .required('Password is required')
        .min(12, 'Password must be at least 12 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    confirmPassword: Yup.string()
        .required('Please confirm your password')
        .oneOf([Yup.ref('password')], 'Passwords must match'),
});

export default function ResetPassword() {
    const {token} = useParams<{ token: string }>();
    const navigate = useNavigate();
    const {resetPassword} = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState(false);

    const formik = useForm({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: resetPasswordSchema,
        onSubmit: async (values) => {
            if (!token) {
                toast.error('Invalid reset token');
                return;
            }

            await resetPassword({
                token,
                password: values.password,
                confirmPassword: values.confirmPassword
            }).unwrap();

            setSuccess(true);
            setTimeout(() => navigate('/auth/sign-in'), 3000);
        },
        onSuccess: () => {
            toast.success('Password reset successfully!');
        },
        onError: (error) => {
            console.error('Reset password error:', error);
        }
    });

    if (success) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div
                            className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600"/>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Password Reset Successful!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Your password has been reset successfully. You can now log in with your new password.
                        </p>
                        <p className="text-sm text-gray-500">
                            Redirecting to login page in 3 seconds...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
                        <Lock className="w-8 h-8 text-white"/>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
                    <p className="text-gray-600 mt-2">
                        Enter your new password below
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={formik.handleSubmit} className="space-y-5">
                        {/* Global Error */}
                        <GlobalErrorAlert
                            error={formik.globalError}
                            onDismiss={() => formik.setStatus(null)}
                        />

                        {/* New Password */}
                        <div>
                            <FormInputFloatingWithIcon
                                formik={formik}
                                name="password"
                                label="New Password"
                                type={showPassword ? 'text' : 'password'}
                                leftIcon={Lock}
                                rightIcon={showPassword ? EyeOff : Eye}
                                rightIconButton
                                onRightIconClick={() => setShowPassword(!showPassword)}
                                required
                            />

                            {/* Password Strength Indicator */}
                            {formik.values.password && (
                                <div className="mt-2">
                                    <PasswordStrength password={formik.values.password}/>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <FormInputFloatingWithIcon
                            formik={formik}
                            name="confirmPassword"
                            label="Confirm Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            leftIcon={Lock}
                            rightIcon={showConfirmPassword ? EyeOff : Eye}
                            rightIconButton
                            onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            required
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {formik.isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <Link to="/auth/sign-in" className="text-sm text-gray-600 hover:text-gray-900">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}