import { FormikConfig, FormikValues, useFormik } from "formik";
import React from "react";

// import { FormField } from "./FormField";

interface ServerErrorResponse {
  response?: {
    status?: number;
    data?: {
      errors?: Record<string, string[]>;
      message?: string;
    };
  };
}

interface UseFormOptions<T extends FormikValues>
  extends Omit<FormikConfig<T>, "onSubmit"> {
  onSubmit: (values: T) => Promise<any>;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  showNonValidationErrors?: boolean;
}

export const handleApiErrors=(error:any,formik:any)=>{
  const serverError = error as ServerErrorResponse;

  if (
    serverError.response?.status === 400 &&
    serverError.response?.data?.errors
  ) {
    const serverErrors = serverError.response.data.errors;
    const formikErrors: Record<string, string> = {};

    Object.keys(serverErrors).forEach((field) => {
      formikErrors[field] = serverErrors[field][0]; // Take first error
    });

    formik.setErrors(formikErrors);
  } else {
    formik.setStatus({
      error: serverError?.response?.data?.message||"Unknown error",
    });
  }

}

export const useForm = <T extends FormikValues>({
  onSubmit,
  onSuccess,
  onError,
  showNonValidationErrors = true,
  ...formikConfig
}: UseFormOptions<T>) => {
  const handleSubmit = async (values: T, formikHelpers: any) => {
    const { setSubmitting, setStatus } = formikHelpers;

    try {
      setStatus(null); // Clear any previous status
      const response = await onSubmit(values);

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error: any) {
      handleApiErrors(error, formik);
      if (onError) {
        onError(error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik<T>({
    ...formikConfig,
    onSubmit: handleSubmit,
  });

  return {
    ...formik,
    getFieldError: (fieldName: string) =>
      formik.touched[fieldName] && formik.errors[fieldName]
        ? (formik.errors[fieldName] as string)
        : undefined,

    hasFieldError: (fieldName: string) =>
      !!(formik.touched[fieldName] && formik.errors[fieldName]),

    // Global error from server (non-validation errors)
    globalError: formik.status?.error,
  };
};


interface FormFieldProps {
  children: React.ReactNode;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  error,
  label,
  required,
  className = "",
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className={`${error ? "border-red-300" : ""}`}>{children}</div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  formik: any;
  name: string;
  label: string;
  error?: string;
  required?: boolean;
}

export const FormInputLabelled: React.FC<FormInputProps> = ({
  formik,
  name,
  label,
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
    <FormField label={label} error={fieldError} required={required}>
      <input
        {...inputProps}
        id={name}
        name={name}
        value={formik.values[name] || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-md 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${fieldError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""}
          ${className}
        `}
      />
    </FormField>
  );
};

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  formik: any;
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  formik,
  name,
  label,
  options,
  placeholder = "--Select--",
  error,
  required,
  className = "",
  ...selectProps
}) => {
  const fieldError =
    error ||
    (formik.touched[name] && formik.errors[name]
      ? (formik.errors[name] as string)
      : undefined);

  return (
    <FormField label={label} error={fieldError} required={required}>
      <select
        {...selectProps}
        id={name}
        name={name}
        value={formik.values[name] || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-md 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${fieldError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""}
          ${className}
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
};

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  formik: any;
  name: string;
  label: string;
  error?: string;
  required?: boolean;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  formik,
  name,
  label,
  error,
  required,
  className = "",
  ...textareaProps
}) => {
  const fieldError =
    error ||
    (formik.touched[name] && formik.errors[name]
      ? (formik.errors[name] as string)
      : undefined);

  return (
    <FormField label={label} error={fieldError} required={required}>
      <textarea
        {...textareaProps}
        id={name}
        name={name}
        value={formik.values[name] || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-md resize-y
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${fieldError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""}
          ${className}
        `}
      />
    </FormField>
  );
};

interface GlobalErrorAlertProps {
  error?: string;
  onDismiss?: () => void;
}

export const GlobalErrorAlert: React.FC<GlobalErrorAlertProps> = ({
  error,
  onDismiss,
}) => {
  if (!error) return null;

  return (
    <div className="mb-4 p-4 border border-red-300 rounded-md bg-red-50">
      <div className="flex justify-between items-start">
        <div className="flex">
          <div className="text-red-800">
            <p className="text-sm font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
        {onDismiss && (
          <button
            type="button"
            className="text-red-400 hover:text-red-600"
            onClick={onDismiss}
          >
            <span className="sr-only">Dismiss</span>×
          </button>
        )}
      </div>
    </div>
  );
};
