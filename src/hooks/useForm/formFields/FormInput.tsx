import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  formik: any;
  name: string;
  error?: string;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  formik,
  name,
  error,
  required,
  className = "",
  ...inputProps
}) => {
  const fieldError =
    error ||
    (formik.touched[name] && formik.errors[name]
      ? (formik.errors[name] as string)
      : undefined);

  return (
    <input
      {...inputProps}
      id={name}
      name={name}
      value={formik.values[name] || ""}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      className={`
          w-full pt-4 form-input peer 
          ${fieldError || error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""}
          ${className}
        `}
    />
  );
};
