import * as Yup from "yup";

export const clientSchema = (clients) =>
  Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .max(15, "Name must be at most 15 characters")
      .required("Name is required")
      .test("unique-name", "Client name already exists", function (value) {
        return !clients?.some((client) => client.name === value);
      }),
    alias: Yup.string()
      .min(2, "Alias must be at least 2 characters")
      .max(15, "Alias must be at most 15 characters")
      .required("Alias is required")
      .test("unique-alias", "Client alias already exists", function (value) {
        return !clients?.some((client) => client.alias === value);
      }),

    user_limit: Yup.number()
      .typeError("Must be a valid number") // Custom error for invalid number inpu
      .integer("Must be an integer") // Ensure the value is an integer
      .positive("The number must be positive") // Optional: Ensure the number is positive
      .min(1, "Minium value is 1")
      .required("This field is required"),

      extension_limit: Yup.number()
      .typeError("Must be a valid number") // Custom error for invalid number inpu
      .integer("Must be an integer") // Ensure the value is an integer
      .positive("The number must be positive") // Optional: Ensure the number is positive
      .min(1, "Minium value is 1")
      .required("This field is required"),


    // confirm_password:Yup.string().requried().YuponeOf([Yup.ref('password'), null], "Password must match"),
    //email:Yup.string().email().min(2).max(15).requried(),
  });
