import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useForm, GlobalErrorAlert } from '@hooks/useForm';
import { FormInputFloatingWithIcon } from '@hooks/useForm';
import * as Yup from 'yup';
import { Mail, Lock, User, UserPlus, Eye, EyeOff, AtSign } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import PasswordStrength from '@src/components/common/passwordStrength.tsx';

const registerSchema = Yup.object({
    name: Yup.string()
        .required('Name is required')
        .min(3, 'Name must be at least 3 characters'),
    username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters')
        .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email address'),
    password: Yup.string()
        .required('Password is required')
        .min(12, 'Password must be at least 12 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
});

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const formik = useForm({
        initialValues: {
            name: '',
            username: '',
            email: '',
            password: '',
        },
        validationSchema: registerSchema,
        onSubmit: async (values) => {
            await register(values).unwrap();
            navigate('/auth/verify-email', { state: { email: values.email } });
        },
        onSuccess: (response) => {
            toast.success(response.message || 'Registration successful! Check your email.');
        },
        onError: (error) => {
            console.error('Registration error:', error);
        }
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-gray-600 mt-2">Join us today and get started</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={formik.handleSubmit} className="space-y-5">
                        {/* Global Error */}
                        <GlobalErrorAlert
                            error={formik.globalError}
                            onDismiss={() => formik.setStatus(null)}
                        />

                        {/* Name */}
                        <FormInputFloatingWithIcon
                            formik={formik}
                            name="name"
                            label="Full Name"
                            type="text"
                            leftIcon={User}
                            required
                        />

                        {/* Username */}
                        <FormInputFloatingWithIcon
                            formik={formik}
                            name="username"
                            label="Username"
                            type="text"
                            leftIcon={AtSign}
                            required
                        />

                        {/* Email */}
                        <FormInputFloatingWithIcon
                            formik={formik}
                            name="email"
                            label="Email Address"
                            type="email"
                            leftIcon={Mail}
                            required
                        />

                        {/* Password */}
                        <div>
                            <FormInputFloatingWithIcon
                                formik={formik}
                                name="password"
                                label="Password"
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
                                    <PasswordStrength password={formik.values.password} />
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {formik.isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/sign-in" className="text-primary-600 hover:text-primary-700 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}