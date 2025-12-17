import React from "react";
import { FormikProps } from "formik";

interface FloatingLabelInputProps {
  formik: FormikProps<any>;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  className?: string;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  formik,
  name,
  className,
  label,
  type = "text",
  required = false,
}) => {
  return (
    <>
      <div className={`relative w-full ${className}`}>
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          className="pt-4 form-input peer w-full"
          placeholder="" // important: empty string
          value={formik.values[name] ?? ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <label
          htmlFor={name}
          className="
          absolute start-1 text-sm text-gray-500 dark:text-dark-500
          duration-300 transform z-10 origin-[0]
          bg-white dark:bg-dark-900 px-2
          scale-100 -translate-y-1/2 top-1/2

          /* float on focus */
          peer-focus:px-2 peer-focus:scale-[0.85] peer-focus:-translate-y-4 peer-focus:top-2

          /* float when has value */
          peer-[&:not(:placeholder-shown)]:px-2
          peer-[&:not(:placeholder-shown)]:scale-[0.85]
          peer-[&:not(:placeholder-shown)]:-translate-y-4
          peer-[&:not(:placeholder-shown)]:top-2

          /* default when empty */
          peer-placeholder-shown:scale-100
          peer-placeholder-shown:top-1/2
          peer-placeholder-shown:-translate-y-1/2
        "
        >
          {label}
        </label>
      </div>
      {formik.touched[name] && formik.errors[name] && (
        <p className="mt-1 pl-2 text-xs text-red-500">
          {formik.errors[name] as string}
        </p>
      )}
    </>
  );
};

export default FloatingLabelInput;
