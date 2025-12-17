import React from "react";

interface FloatingLabelFieldProps {
  label: string;
  children: React.ReactNode;
  childrenClassName?: string;
  className?: string;
  error?: string;
  required?: boolean;
}

const FloatingLabelField: React.FC<FloatingLabelFieldProps> = ({
  label,
  children,
  childrenClassName,
  className = "",
  error,
  required = false,
}) => {
  return (
    <div className={`w-full ${className} `}>
      <div className="relative w-full">
        {/* Floating label */}
        <label
          className="
            absolute left-3 -top-2.5
            bg-white dark:bg-dark-900
            px-1 text-xs font-medium
            text-gray-500 dark:text-dark-500
            pointer-events-none
          "
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {/* Input-like container */}
        <div
          className={`
            border rounded-md border-gray-200
            dark:border-dark-800 dark:bg-dark-900
            bg-white p-2
            focus-within:border-primary-500 ${childrenClassName}
            ${error ? "border-red-300 focus-within:border-red-500" : ""}
          `}
        >
          {children}
        </div>
      </div>

      {/* Error message */}
      {error && <p className="mt-1 pl-2 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FloatingLabelField;

// import React from "react";
//
// interface FloatingLabelFieldProps {
//   label: string;
//   children: React.ReactNode;
//   className?: string;
// }
//
// const FloatingLabelField: React.FC<FloatingLabelFieldProps> = ({
//   label,
//   children,
//   className = "",
// }) => {
//   return (
//     <div className={`relative w-full `}>
//       {/* Floating label */}
//       <label
//         className="
//           absolute left-3 -top-2.5
//           bg-white dark:bg-dark-900
//           px-1 text-xs font-medium text-gray-500 dark:text-dark-500
//           pointer-events-none
//         "
//       >
//         {label}
//       </label>
//
//       {/* Input-like container */}
//       <div
//         className={`border rounded-md border-gray-200 dark:border-dark-800 dark:bg-dark-900 focus-within:border-primary-500 bg-white p-2 ${className}`}
//       >
//         {children}
//       </div>
//     </div>
//   );
// };
//
// export default FloatingLabelField;
