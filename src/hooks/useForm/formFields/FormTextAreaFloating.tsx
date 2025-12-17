import React, { useEffect, useRef } from "react";
import FloatingLabelField from "@src/components/common/floatingLabelField.tsx";
import { getFormikFieldError } from "@hooks/useForm/helpers/formikFieldError";

export function useAutoResize(value: string) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto"; // reset
      const scrollHeight = ref.current.scrollHeight;

      // ensure at least 1 line high
      const lineHeight =
        parseInt(window.getComputedStyle(ref.current).lineHeight, 10) || 20;
      ref.current.style.height = Math.max(scrollHeight, lineHeight) + "px";
    }
  }, [value]);

  return ref;
}

interface FormTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  formik: any;
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  className?: string; // wrapper styles
  textareaClassName?: string; // textarea styles
}

export const FormTextAreaFloating: React.FC<FormTextAreaProps> = ({
  formik,
  name,
  label,
  error,
  required,
  className = "",
  textareaClassName = "",
  ...textareaProps
}) => {
  const fieldError = getFormikFieldError(formik, name, error);
  const textareaRef = useAutoResize(formik.values[name] || "");

  return (
    <div className={`w-full ${className}`}>
      <FloatingLabelField label={label}>
        <textarea
          ref={textareaRef}
          rows={1} // 👈 ensures initial 1 line
          {...textareaProps}
          id={name}
          name={name}
          value={formik.values[name] || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`
    w-full resize-none rounded-md border-0 bg-transparent focus:ring-0 focus:outline-none
    ${fieldError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""}
    ${textareaClassName}
  `}
        />
      </FloatingLabelField>

      {fieldError && (
        <p className="mt-1 pl-2 text-xs text-red-500">{fieldError}</p>
      )}
    </div>
  );
};
