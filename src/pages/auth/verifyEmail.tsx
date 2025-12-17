import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { Mail, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VerifyEmail() {
    const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [canResend, setCanResend] = useState(true);
    const [countdown, setCountdown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const navigate = useNavigate();
    const location = useLocation();
    const { verifyEmail, resendCode } = useAuth();
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/auth/sign-up');
        }
    }, [email, navigate]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleCodeChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
        setCode(newCode);

        // Focus last filled input
        const lastIndex = Math.min(pastedData.length, 5);
        inputRefs.current[lastIndex]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const verificationCode = code.join('');
        if (verificationCode.length !== 6) {
            toast.error('Please enter all 6 digits');
            return;
        }

        setIsLoading(true);
        try {
            await verifyEmail({ email, code: verificationCode }).unwrap();
            toast.success('Email verified successfully!');
            navigate('/auth/sign-in');
        } catch (error: any) {
            toast.error(error.message || 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;

        setIsResending(true);
        setCanResend(false);

        try {
            await resendCode(email).unwrap();
            toast.success('Verification code sent!');
            setCountdown(60); // 60 seconds cooldown
            setCode(['', '', '', '', '', '']); // Clear code
            inputRefs.current[0]?.focus();
        } catch (error: any) {
            toast.error(error.message || 'Failed to resend code');
            setCanResend(true);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
                        <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Verify Your Email</h1>
                    <p className="text-gray-600 mt-2">
                        We sent a 6-digit code to<br />
                        <span className="font-medium text-gray-900">{email}</span>
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Code Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                                Enter Verification Code
                            </label>
                            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || code.some(d => !d)}
                            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Verify Email
                                </>
                            )}
                        </button>
                    </form>

                    {/* Resend Code */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Didn't receive the code?{' '}
                            {canResend ? (
                                <button
                                    onClick={handleResend}
                                    disabled={isResending}
                                    className="text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
                                >
                                    {isResending ? 'Sending...' : 'Resend'}
                                </button>
                            ) : (
                                <span className="text-gray-500">
                  Resend in {countdown}s
                </span>
                            )}
                        </p>
                    </div>

                    {/* Back to Login */}
                    <div className="mt-4 text-center">
                        <Link to="/auth/sign-in" className="text-sm text-gray-600 hover:text-gray-900">
                            Back to Login
                        </Link>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>Check your spam folder if you don't see the email</p>
                </div>
            </div>
        </div>
    );
}