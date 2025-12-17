import React from "react";
import { FormikProps, getIn } from "formik";
import { getFormikFieldError } from "@hooks/useForm/helpers/formikFieldError";

interface FloatingLabelInputProps {
  formik: FormikProps<any>;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  defaultValue?: string;
  error?: string;
}

export const FormInputFloating: React.FC<FloatingLabelInputProps> = ({
                                                                       formik,
                                                                       name,
                                                                       className,
                                                                       defaultValue,
                                                                       disabled,
                                                                       label,
                                                                       type = "text",
                                                                       required = false,
                                                                       error,
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
          className={`pt-4 form-input peer w-full
        ${fieldError ? "border-red-300 focus:ring-red-500" : ""}`}
          placeholder=" "
          // Fix: Use getIn for nested field access
          value={getIn(formik.values, name) ?? defaultValue ?? ""}
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
        peer-focus:px-2 peer-focus:scale-[0.85] peer-focus:-translate-y-4 peer-focus:top-2
        peer-[&:not(:placeholder-shown)]:px-2
        peer-[&:not(:placeholder-shown)]:scale-[0.85]
        peer-[&:not(:placeholder-shown)]:-translate-y-4
        peer-[&:not(:placeholder-shown)]:top-2
        peer-placeholder-shown:scale-100
        peer-placeholder-shown:top-1/2
        peer-placeholder-shown:-translate-y-1/2
      "
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>

      {fieldError && (
        <p className="mt-1 pl-2 text-xs text-red-500">{fieldError}</p>
      )}
    </div>
  );
};

// import React from "react";
// import { FormikProps } from "formik";
// import { getFormikFieldError } from "@hooks/useForm/helpers/formikFieldError";
//
// interface FloatingLabelInputProps {
//   formik: FormikProps<any>;
//   name: string;
//   label: string;
//   type?: string;
//   required?: boolean;
//   className?: string;
//   disabled?: boolean;
//   defaultValue?: string; // ✅ support defaultValue
//   error?: string;
// }
//
// export const FormInputFloating: React.FC<FloatingLabelInputProps> = ({
//   formik,
//   name,
//   className,
//   disabled,
//   label,
//   type = "text",
//   required = false,
//   defaultValue,
//   error,
// }) => {
//   const fieldError = getFormikFieldError(formik, name, error);
//   const fieldProps = formik.getFieldProps(name);
//
//   // ✅ If Formik has no value for this field, fall back to defaultValue
//   const value = fieldProps.value ?? defaultValue ?? "";
//
//   return (
//     <div className={`w-full ${className}`}>
//       <div className="relative w-full">
//         <input
//           id={name}
//           disabled={disabled}
//           type={type}
//           placeholder=" "
//           className={`pt-4 form-input peer w-full
//             ${fieldError ? "border-red-300 focus:ring-red-500" : ""}`}
//           {...fieldProps}
//           value={value} // ✅ merged handling
//         />
//
//         <label
//           htmlFor={name}
//           className="absolute start-1 text-sm text-gray-500 dark:text-dark-500
//             duration-300 transform z-10 origin-[0]
//             bg-white dark:bg-dark-900 px-2
//             scale-100 -translate-y-1/2 top-1/2
//             peer-focus:px-2 peer-focus:scale-[0.85] peer-focus:-translate-y-4 peer-focus:top-2
//             peer-[&:not(:placeholder-shown)]:px-2
//             peer-[&:not(:placeholder-shown)]:scale-[0.85]
//             peer-[&:not(:placeholder-shown)]:-translate-y-4
//             peer-[&:not(:placeholder-shown)]:top-2
//             peer-placeholder-shown:scale-100
//             peer-placeholder-shown:top-1/2
//             peer-placeholder-shown:-translate-y-1/2"
//         >
//           {label} {required && <span className="text-red-500">*</span>}
//         </label>
//       </div>
//
//       {fieldError && (
//         <p className="mt-1 pl-2 text-xs text-red-500">{fieldError}</p>
//       )}
//     </div>
//   );
// };
//
// import React from "react";
// import { FormikProps } from "formik";
// import { getFormikFieldError } from "@hooks/useForm/helpers/formikFieldError";
//
// interface FloatingLabelInputProps {
//   formik: FormikProps<any>;
//   name: string;
//   label: string;
//   type?: string;
//   required?: boolean;
//   className?: string;
//   disabled?: boolean;
//   defaultValue?: string; // new
//   error?: string; // allow external error override
// }
//
// export const FormInputFloating: React.FC<FloatingLabelInputProps> = ({
//   formik,
//   name,
//   className,
//   defaultValue,
//   disabled,
//   label,
//   type = "text",
//   required = false,
//   error,
// }) => {
//   const fieldError = getFormikFieldError(formik, name, error);
//
//   return (
//     <div className={`w-full ${className}`}>
//       <div className="relative w-full">
//         <input
//           id={name}
//           disabled={disabled}
//           name={name}
//           autoComplete="off"
//           type={type}
//           className={`pt-4 form-input peer w-full
//         ${fieldError ? "border-red-300 focus:ring-red-500" : ""}`}
//           placeholder=" "
//           value={formik.values[name] ?? defaultValue?? ""}
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//         />
//         <label
//           htmlFor={name}
//           className="
//         absolute start-1 text-sm text-gray-500 dark:text-dark-500
//         duration-300 transform z-10 origin-[0]
//         bg-white dark:bg-dark-900 px-2
//         scale-100 -translate-y-1/2 top-1/2
//         peer-focus:px-2 peer-focus:scale-[0.85] peer-focus:-translate-y-4 peer-focus:top-2
//         peer-[&:not(:placeholder-shown)]:px-2
//         peer-[&:not(:placeholder-shown)]:scale-[0.85]
//         peer-[&:not(:placeholder-shown)]:-translate-y-4
//         peer-[&:not(:placeholder-shown)]:top-2
//         peer-placeholder-shown:scale-100
//         peer-placeholder-shown:top-1/2
//         peer-placeholder-shown:-translate-y-1/2
//       "
//         >
//           {label} {required && <span className="text-red-500">*</span>}
//         </label>
//       </div>
//
//       {fieldError && (
//         <p className="mt-1 pl-2 text-xs text-red-500">{fieldError}</p>
//       )}
//     </div>
//   );
// };
