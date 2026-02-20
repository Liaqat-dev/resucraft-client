import { useState } from 'react';

const inputClass = `
    peer w-full px-3 py-1 text-sm text-gray-900 bg-transparent
    border border-gray-300 rounded-md outline-none
    transition-colors duration-200
    placeholder:text-transparent
    focus:border-blue-500 focus:ring-[0.5] focus:ring-blue-500
    hover:border-gray-400
    disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200
`;

const labelClass = `
    absolute left-2 z-10 origin-[0] bg-white px-1
    text-xs text-gray-500 duration-200 transform
    pointer-events-none select-none
    top-1/2 -translate-y-1/2 scale-100
    peer-focus:px-1 peer-focus:scale-[0.85] peer-focus:-translate-y-4 peer-focus:top-1 peer-focus:text-blue-500
    peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:scale-[0.85]
    peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:top-2
`;

const FloatingInput = ({ label, value, onChange, type = 'text', id, name, disabled, className, ...props }) => {
    const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={`relative w-full ${className || ''}`}>
            <input
                id={inputId}
                name={name}
                type={type}
                disabled={disabled}
                placeholder=""
                value={value ?? ''}
                onChange={onChange}
                className={inputClass}
                {...props}
            />
            <label htmlFor={inputId} className={labelClass}>
                {label}
            </label>
        </div>
    );
};

const FloatingNumber = ({ label, value, onChange, id, name, min, max, step, disabled, className, ...props }) => {
    const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={`relative w-full ${className || ''}`}>
            <input
                id={inputId}
                name={name}
                type="number"
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                placeholder=""
                value={value ?? ''}
                onChange={onChange}
                className={`${inputClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                {...props}
            />
            <label htmlFor={inputId} className={labelClass}>
                {label}
            </label>
        </div>
    );
};

const FloatingSelect = ({ label, value, onChange, options = [], id, name, disabled, className, ...props }) => {
    const [focused, setFocused] = useState(false);
    const hasValue = value !== undefined && value !== null && value !== '';
    const isActive = focused || hasValue;
    const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={`relative w-full ${className || ''}`}>
            <select
                id={inputId}
                name={name}
                value={value ?? ''}
                disabled={disabled}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={`
                    w-full px-3 py-3 text-sm bg-transparent
                    border rounded-lg outline-none appearance-none cursor-pointer
                    transition-colors duration-200
                    disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200
                    ${hasValue ? 'text-gray-900' : 'text-transparent'}
                    ${focused ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300 hover:border-gray-400'}
                `}
                {...props}
            >
                <option value="" disabled hidden />
                {options.map((opt) => {
                    const optValue = typeof opt === 'object' ? opt.value : opt;
                    const optLabel = typeof opt === 'object' ? opt.label : opt;
                    return (
                        <option key={optValue} value={optValue}>
                            {optLabel}
                        </option>
                    );
                })}
            </select>
            <svg
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-200 ${focused ? 'text-blue-500' : 'text-gray-400'}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            <label
                htmlFor={inputId}
                className={`
                    absolute left-2 z-10 origin-[0] bg-white px-2
                    text-sm duration-200 transform pointer-events-none select-none
                    ${isActive
                        ? 'scale-[0.85] -translate-y-4 top-2'
                        : 'top-1/2 -translate-y-1/2 scale-100'
                    }
                    ${focused ? 'text-blue-500' : 'text-gray-500'}
                `}
            >
                {label}
            </label>
        </div>
    );
};

const FloatingTextarea = ({ label, value, onChange, id, name, rows = 3, disabled, className, ...props }) => {
    const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={`relative w-full ${className || ''}`}>
            <textarea
                id={inputId}
                name={name}
                rows={rows}
                disabled={disabled}
                placeholder=""
                value={value ?? ''}
                onChange={onChange}
                className={`${inputClass} resize-y`}
                {...props}
            />
            <label
                htmlFor={inputId}
                className="
                    absolute left-2 z-10 origin-[0] bg-white px-2
                    text-sm text-gray-500 duration-200 transform
                    pointer-events-none select-none
                    top-3.5 scale-100
                    peer-focus:scale-[0.85] peer-focus:-translate-y-4 peer-focus:top-2 peer-focus:text-blue-500
                    peer-[:not(:placeholder-shown)]:scale-[0.85]
                    peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:top-2
                "
            >
                {label}
            </label>
        </div>
    );
};

export { FloatingInput, FloatingNumber, FloatingSelect, FloatingTextarea };
