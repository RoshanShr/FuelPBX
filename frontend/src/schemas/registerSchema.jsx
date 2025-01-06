import * as Yup from "yup";

export const registerSchema = (users, alias, userID= null) =>
  Yup.object({
    fullname: Yup.string()
      .min(2, "Fullname must be at least 2 characters")
      .max(15, "Fullname must be at least 2 characters")
      .required("Fullname is required"),

    username: Yup.string()
      .min(2, "Username must be at least 2 characters")
      .max(15, "Username must be at least 2 characters")
      .required("Username is required")
      .test("unique-name", "Username is already taken", function (value) {
        return !users?.some((user) => user.login_name === `${value}@${alias}` && userID!=user.id);
      }),

    email: Yup.string()
      .email()
      .min(2, "Email must be at least 2 characters")
      .required("Email is required")
      .test("unique-name", "Email already exists", function (value) {
        return !users?.some((user) => user.email === value && userID!=user.id);
      }),

      password: Yup.string()
      .when("userID", {
        is: null, // Add validation only if userID is null (new user)
        then: (schema) =>
          schema
            .min(8, "Password must be at least 8 characters")
            .max(15, "Password must be maximum 15 characters")
            .matches(/[0-9]/, "Password must contain at least one number") // Ensures at least one number
            .matches(
              /[!@#$%^&*(),.?":{}|<>]/,
              "Password must contain at least one special character"
            ) // Ensures at least one special character
            .required("Password is required"),
        otherwise: (schema) => schema.optional(), // Make it optional for edit
      }),

    confirm_password: Yup.string().when("userID", {
      is: null, // Add validation only if userID is null (new user)
      then: (schema) =>
        schema
          .required("Confirm password is required")
          .oneOf([Yup.ref("password"), null], "Password must match"),
      otherwise: (schema) => schema.optional(), // Make it optional for edit
    }),
  });