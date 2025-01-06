import * as Yup from 'yup';

export const loginSchema = Yup.object({
    username: Yup.string()
    .min(2, "Username must be at least 2 characters")
    .max(15, "Username must be at least 2 characters")
    .required("Username is required"),
    
    password: Yup.string()
    .min(2, "Password must be at least 2 characters")
    .max(15, "Password must be at least 2 characters")
    .required("Password is required")
    // confirm_password:Yup.string().requried().YuponeOf([Yup.ref('password'), null], "Password must match"),
    //email:Yup.string().email().min(2).max(15).requried(),
})