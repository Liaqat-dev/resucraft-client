import React from "react";
import { FormikProps, getIn } from "formik";
import { getFormikFieldError } from "../helpers/formikFieldError";
import { LucideIcon } from "lucide-react";

interface FormInputFloatingWithIconProps {
  formik: FormikProps<any>;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  error?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconClick?: () => void;
  rightIconButton?: boolean;
}

export const FormInputFloatingWithIcon: React.FC<FormInputFloatingWithIconProps> = ({
                                                                                      formik,
                                                                                      name,
                                                                                      label,
                                                                                      type = "text",
                                                                                      required = false,
                                                                                      className = "",
                                                                                      disabled = false,
                                                                                      error,
                                                                                      leftIcon: LeftIcon,
                                                                                      rightIcon: RightIcon,
                                                                                      onRightIconClick,
                                                                                      rightIconButton = false,
                                                                                    }) => {
  const fieldError = getFormikFieldError(formik, name, error);

  return (
      <div className={`w-full ${className}`}>
        <div className="relative w-full">
          <input
              id={name}
              disabled={disabled}
              name={name}
              autoComplete="off"
              type={type}
              className={`pt-4 form-input peer w-full rounded-lg border-gray-300
            ${LeftIcon ? 'pl-10' : 'pl-3'} 
            ${RightIcon ? 'pr-10' : 'pr-3'}
            ${fieldError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'focus:ring-primary-500 focus:border-primary-500'}`}
              placeholder=" "
              value={getIn(formik.values, name) ?? ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
          />

          {/* Left Icon */}
          {LeftIcon && (
              <LeftIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}

          {/* Floating Label */}
          <label
              htmlFor={name}
              className="absolute left-3 text-sm text-gray-500 duration-300 transform origin-[0]
            bg-white px-2 pointer-events-none
            -translate-y-4 scale-75 top-2
            peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
            peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
            peer-focus:text-primary-600"
              style={{ left: LeftIcon ? '2.5rem' : '0.75rem' }}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>

          {/* Right Icon */}
          {RightIcon && rightIconButton ? (
              <button
                  type="button"
                  onClick={onRightIconClick}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <RightIcon className="w-5 h-5" />
              </button>
          ) : RightIcon ? (
              <RightIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          ) : null}
        </div>

        {fieldError && (
            <p className="mt-1 pl-2 text-xs text-red-500">{fieldError}</p>
        )}
      </div>
  );
};