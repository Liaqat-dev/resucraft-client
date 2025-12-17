import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useForm, GlobalErrorAlert } from '@hooks/useForm';
import { FormInputFloatingWithIcon } from '@hooks/useForm';
import * as Yup from 'yup';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const loginSchema = Yup.object({
  emailOrUsername: Yup.string().required('Email or username is required'),
  password: Yup.string().required('Password is required'),
});

export default function Login() {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useForm({
    initialValues: {
      emailOrUsername: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      const result = await login({
        emailOrUsername: values.emailOrUsername,
        password: values.password
      }).unwrap();

      if (result.needsVerification) {
        navigate('/verify-email', { state: { email: result.email } });
        return;
      }

      if (result.needs2FA) {
        toast.error('2FA not yet implemented');
        return;
      }

      navigate('/');
    },
    onSuccess: () => {
      toast.success('Logged in successfully!');
    },
    onError: (error: any) => {
      console.error('Login error:', error);
    }
  });

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      await googleLogin(credentialResponse.credential).unwrap();
      toast.success('Logged in with Google!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Google login failed');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login failed');
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={formik.handleSubmit} className="space-y-5">
              {/* Global Error */}
              <GlobalErrorAlert
                  error={formik.globalError}
                  onDismiss={() => formik.setStatus(null)}
              />

              {/* Email or Username */}
              <FormInputFloatingWithIcon
                  formik={formik}
                  name="emailOrUsername"
                  label="Email or Username"
                  type="text"
                  leftIcon={Mail}
                  required
              />

              {/* Password */}
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

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                    to="/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formik.isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Login */}
            <div className="flex justify-center">
              <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="outline"
                  size="large"
                  text="continue_with"
              />
            </div>

            {/* Register Link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
  );
}