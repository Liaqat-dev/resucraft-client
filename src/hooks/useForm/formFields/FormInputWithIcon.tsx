import React from "react";
import { FormikProps } from "formik";
import { getFormikFieldError } from "@hooks/useForm/helpers/formikFieldError";

interface FormInputWithIconProps {
  formik: FormikProps<any>;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  className?: string;
  error?: string; // allow external error override
  leftIcon?: React.ComponentType<{ className?: string }>; // Left icon component
  rightIcon?: React.ComponentType<{ className?: string }>; // Right icon component
  onRightIconClick?: () => void; // Handler for right icon click
  rightIconButton?: boolean; // Whether right icon is clickable
}

export const FormInputWithIcon: React.FC<FormInputWithIconProps> = ({
  formik,
  name,
  placeholder,
  type = "text",
  required = false,
  className = "",
  error,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconClick,
  rightIconButton = false,
}) => {
  const fieldError = getFormikFieldError(formik, name, error);

  return (
    <div className={className}>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          className={`form-input bg-white/30 border-slate-300 text-gray-800 rounded-xl h-14 w-full
            ${LeftIcon ? "ltr:pl-12 rtl:pr-12" : "px-4"}
            ${RightIcon ? "ltr:pr-12 rtl:pl-12" : ""}
            ${fieldError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""}
          `}
          placeholder={placeholder}
          value={formik.values[name] ?? ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required={required}
        />

        {/* Left Icon */}
        {LeftIcon && (
          <LeftIcon className="size-6 ltr:left-4 rtl:right-4 absolute top-1/2 -translate-y-1/2 text-slate-500" />
        )}

        {/* Right Icon */}
        {RightIcon && rightIconButton ? (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute inset-y-0 flex items-center text-gray-500 ltr:right-3 rtl:left-3 focus:outline-none dark:text-dark-500"
          >
            <RightIcon className="size-5" />
          </button>
        ) : RightIcon ? (
          <RightIcon className="size-6 ltr:right-4 rtl:left-4 absolute top-1/2 -translate-y-1/2 text-slate-500" />
        ) : null}
      </div>

      {/* Error Message */}
      {fieldError && (
        <p className="mt-1 text-sm italic text-red-500">{fieldError}</p>
      )}
    </div>
  );
};
