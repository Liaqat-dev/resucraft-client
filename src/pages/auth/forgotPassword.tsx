import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useForm, GlobalErrorAlert } from '@hooks/useForm';
import { FormInputFloatingWithIcon } from '@hooks/useForm';
import * as Yup from 'yup';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const forgotPasswordSchema = Yup.object({
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email address'),
});

export default function ForgotPassword() {
    const { forgotPassword } = useAuth();
    const [emailSent, setEmailSent] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState('');

    const formik = useForm({
        initialValues: {
            email: '',
        },
        validationSchema: forgotPasswordSchema,
        onSubmit: async (values) => {
            await forgotPassword(values.email).unwrap();
            setSubmittedEmail(values.email);
            setEmailSent(true);
        },
        onSuccess: () => {
            toast.success('Password reset link sent! Check your email.');
        },
        onError: (error) => {
            console.error('Forgot password error:', error);
        }
    });

    if (emailSent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <Send className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Check Your Email
                        </h2>
                        <p className="text-gray-600 mb-6">
                            We've sent a password reset link to<br />
                            <span className="font-medium text-gray-900">{submittedEmail}</span>
                        </p>
                        <p className="text-sm text-gray-600 mb-6">
                            The link will expire in 1 hour. Check your spam folder if you don't see the email.
                        </p>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
                        <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Forgot Password?</h1>
                    <p className="text-gray-600 mt-2">
                        No worries! Enter your email and we'll send you a reset link.
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

                        {/* Email */}
                        <FormInputFloatingWithIcon
                            formik={formik}
                            name="email"
                            label="Email Address"
                            type="email"
                            leftIcon={Mail}
                            required
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {formik.isSubmitting ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/auth/sign-in"
                            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}