import React, { ReactNode } from "react";
import FloatingLabelField from "@src/components/common/floatingLabelField.tsx";
import { getFormikFieldError } from "@hooks/useForm/helpers/formikFieldError";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  formik: any;
  name: string;
  label: string;
  options?: Option[];
  placeholder?: string;
  children?: ReactNode;
  error?: string;
  required?: boolean;
  className?: string; // for wrapper
  selectClassName?: string; // for <select>
}

export const FormSelectFloating: React.FC<FormSelectProps> = ({
  formik,
  name,
  label,
  options,
  children,
  placeholder = "--Select--",
  error,
  required,
  className = "",
  selectClassName = "",
  ...selectProps
}) => {
  const fieldError = getFormikFieldError(formik, name, error);

  return (
    <div className={`w-full ${className}`}>
      <FloatingLabelField label={label}>
        <select
          {...selectProps}
          id={name}
          name={name}
          value={formik.values[name] || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`
            w-full focus:outline-none bg-transparent
            ${fieldError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""}
            ${selectClassName}
          `}
        >
          {!children && <option value="">{placeholder}</option>}
          {children ??
            options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
      </FloatingLabelField>

      {fieldError && (
        <p className="mt-1 pl-2 text-xs text-red-500">{fieldError}</p>
      )}
    </div>
  );
};

// import React, { ReactNode } from "react";
// import FloatingLabelField from "@src/components/common/floatingLabelField.tsx";
// import { getFormikFieldError } from "@hooks/useForm/helpers/formikFieldError";
//
// interface Option {
//   value: string;
//   label: string;
// }
//
// interface FormSelectProps
//   extends React.SelectHTMLAttributes<HTMLSelectElement> {
//   formik: any;
//   name: string;
//   label: string;
//   options?: Option[];
//   placeholder?: string;
//   children?: ReactNode;
//   error?: string;
//   required?: boolean;
// }
//
// export const FormSelectFloating: React.FC<FormSelectProps> = ({
//   formik,
//   name,
//   label,
//   options,
//   children,
//   placeholder = "--Select--",
//   error,
//   required,
//   className = "",
//   ...selectProps
// }) => {
//   const fieldError = getFormikFieldError(formik, name, error);
//   return (
//     <>
//       <FloatingLabelField label={label}>
//         <select
//           {...selectProps}
//           id={name}
//           name={name}
//           value={formik.values[name] || ""}
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           className={`
//           w-full focus:outline-none
//           ${fieldError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""}
//           ${className}
//         `}
//         >
//           {!children && <option value="">{placeholder}</option>}
//           {children
//             ? children
//             : options?.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//         </select>
//       </FloatingLabelField>
//       {fieldError && (
//         <p className="mt-1 pl-2 text-xs text-red-500">{fieldError}</p>
//       )}
//     </>
//   );
// };
