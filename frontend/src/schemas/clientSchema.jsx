import * as Yup from "yup";

export const clientSchema = (clients) =>
  Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .max(20, "Name must be at most 20 characters")
      .required("Name is required")
      .test("unique-name", "Client name already exists", function (value) {
        return !clients?.some((client) => client.name === value);
      }),
    alias: Yup.string()
      .min(2, "Alias must be at least 2 characters")
      .max(8, "Alias must be at most 8 characters")
      .required("Alias is required")
      .matches(/^[a-zA-Z]+$/, "Alias can only contain letters (no spaces, numbers or special characters)")
      .test("unique-alias", "Client alias already exists", function (value) {
        return !clients?.some((client) => client.alias === value);
      }),

    user_limit: Yup.number()
      .typeError("Must be a valid number") // Custom error for invalid number inpu
      .integer("Must be an integer") // Ensure the value is an integer
      .positive("The number must be positive") // Optional: Ensure the number is positive
      .min(0, "Minium value is 0")
      .required("This field is required"),

      extension_limit: Yup.number()
      .typeError("Must be a valid number") // Custom error for invalid number inpu
      .integer("Must be an integer") // Ensure the value is an integer
      .positive("The number must be positive") // Optional: Ensure the number is positive
      .min(0, "Minium value is 0")
      .required("This field is required"),


    // confirm_password:Yup.string().requried().YuponeOf([Yup.ref('password'), null], "Password must match"),
    //email:Yup.string().email().min(2).max(15).requried(),
  });
