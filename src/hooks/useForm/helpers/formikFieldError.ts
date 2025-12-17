import { getIn } from "formik";
import { FormikProps } from "formik";

export const getFormikFieldError = (
  formik: FormikProps<any>,
  name: string,
  externalError?: string
): string | undefined => {
  if (externalError) return externalError;

  const touched = getIn(formik.touched, name);
  const error = getIn(formik.errors, name);

  // Check if error is an object and convert to string
  if (touched && error) {
    // If error is an object, it might be a validation error object
    if (typeof error === 'object' && error !== null) {
      // Try to extract the message if it's a validation error object
      return error.message || JSON.stringify(error);
    }
    // If it's already a string, return it
    if (typeof error === 'string') {
      return error;
    }
  }

  return undefined;
};
// import { FormikProps } from "formik";
//
// export const getFormikFieldError = (
//   formik: FormikProps<any>,
//   name: string,
//   externalError?: string
// ): string | undefined => {
//   return (
//     externalError ||
//     (formik.touched[name] && formik.errors[name]
//       ? (formik.errors[name] as string)
//       : undefined)
//   );
// };
