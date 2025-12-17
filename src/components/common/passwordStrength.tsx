interface PasswordStrengthProps {
    password: string;
}

interface Requirements {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
    const calculateStrength = (pass: string): number => {
        if (!pass) return 0;

        let score = 0;

        // Length score
        if (pass.length >= 8) score += 20;
        if (pass.length >= 12) score += 20;
        if (pass.length >= 16) score += 10;

        // Character variety
        if (/[a-z]/.test(pass)) score += 15;
        if (/[A-Z]/.test(pass)) score += 15;
        if (/[0-9]/.test(pass)) score += 10;
        if (/[^a-zA-Z0-9]/.test(pass)) score += 10;

        return Math.min(score, 100);
    };

    const validateRequirements = (pass: string): Requirements => {
        if (!pass) return {
            length: false,
            lowercase: false,
            uppercase: false,
            number: false,
            special: false
        };

        return {
            length: pass.length >= 12,
            lowercase: /[a-z]/.test(pass),
            uppercase: /[A-Z]/.test(pass),
            number: /[0-9]/.test(pass),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(pass)
        };
    };

    const strength = calculateStrength(password);
    const requirements = validateRequirements(password);

    const getColor = (): string => {
        if (strength < 40) return 'bg-red-500';
        if (strength < 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getLabel = (): string => {
        if (strength < 40) return 'Weak';
        if (strength < 70) return 'Medium';
        return 'Strong';
    };

    const getTextColor = (): string => {
        if (strength < 40) return 'text-red-600';
        if (strength < 70) return 'text-yellow-600';
        return 'text-green-600';
    };

    if (!password) return null;

    return (
        <div className="mt-2 space-y-2">
        {/* Strength Bar */}
        <div>
        <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-600">Password Strength</span>
    <span className={`text-sm font-medium ${getTextColor()}`}>
    {getLabel()}
    </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
    <div
        className={`h-2 rounded-full transition-all duration-300 ${getColor()}`}
    style={{ width: `${strength}%` }}
    />
    </div>
    </div>

    {/* Requirements Checklist */}
    <div className="text-xs space-y-1">
    <RequirementItem met={requirements.length} text="At least 12 characters" />
    <RequirementItem met={requirements.lowercase} text="One lowercase letter" />
    <RequirementItem met={requirements.uppercase} text="One uppercase letter" />
    <RequirementItem met={requirements.number} text="One number" />
    <RequirementItem met={requirements.special} text="One special character (!@#$%^&*)" />
        </div>
        </div>
);
}

interface RequirementItemProps {
    met: boolean;
    text: string;
}

function RequirementItem({ met, text }: RequirementItemProps) {
    return (
        <div className={`flex items-center gap-1 ${met ? 'text-green-600' : 'text-gray-500'}`}>
    {met ? (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
    ) : (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
    )}
    <span>{text}</span>
    </div>
);
}