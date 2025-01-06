import * as Yup from "yup";

export const extensionSchema = (extensions, extensionID= null) =>
  Yup.object({
    agent: Yup.string()
      .min(2, "Agent name must be at least 2 characters")
      .max(15, "Agent name must be at least 2 characters")
      .required("Agent name is required")
      .test("unique-name", "Agent name is already taken", function (value) {
        return !extensions?.some((extension) => extension.agent === value  && extensionID!=extension.id);
      }),

    extension: Yup.string()
      .min(2, "Extension must be at least 2 characters")
      .max(15, "Extension must be at least 2 characters")
      .required("Extension is required")
      .test("unique-name", "Extension is already taken", function (value) {
        return !extensions?.some((extension) => extension.extension === value  && extensionID!=extension.id);
      }),

    password: Yup.string()
      .min(4, "Password must be at least 8 characters")
      .max(15, "Password must be maximum 15 characters")
      .required("Password is required"),

    // confirm_password: Yup.string()
    //   .required("Confirm password is required")
    //   .oneOf([Yup.ref("password"), null], "Password must match"),
  });
