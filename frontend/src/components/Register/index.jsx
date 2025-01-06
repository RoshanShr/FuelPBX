import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { registerSchema } from "../../schemas/registerSchema";
import { useFormik } from "formik";
import { useRegisterUser } from "../../api/auth/registerUserApi";
import { Link } from "react-router-dom";

const initialValuesRegister = {
  username: "",
  email: "",
  password: "",
  confirm_password: "",
};


function Register() {
  const registerUserMutation = useRegisterUser();

  const formikRegister = useFormik({
    initialValues: initialValuesRegister,
    validationSchema: registerSchema,
    onSubmit: (values, action) => {
      registerUserMutation.mutate(values);
      action.resetForm();
    },
  });

  return (
    <div>
      <form onSubmit={formikRegister.handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            type="username"
            id="username"
            onChange={formikRegister.handleChange}
            onBlur={formikRegister.handleBlur}
            className="form-control"
            name="username"
            value={formikRegister.values.username}
          />
          {formikRegister.errors.username && formikRegister.touched.username ? (
            <p className="form-error">{formikRegister.errors.username}</p>
          ) : null}
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            onChange={formikRegister.handleChange}
            onBlur={formikRegister.handleBlur}
            className="form-control"
            name="email"
            value={formikRegister.values.email}
          />
          {formikRegister.errors.email && formikRegister.touched.email ? (
            <p className="form-error">{formikRegister.errors.email}</p>
          ) : null}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            id="password"
            onChange={formikRegister.handleChange}
            onBlur={formikRegister.handleBlur}
            className="form-control"
            name="password"
            value={formikRegister.values.password}
          />
          {formikRegister.errors.password && formikRegister.touched.password ? (
            <p className="form-error">{formikRegister.errors.password}</p>
          ) : null}
        </div>
        <div className="mb-3">
          <label htmlFor="confirm_password" className="form-label">
            Confirm password:
          </label>
          <input
            type="password"
            id="confirm_password"
            onChange={formikRegister.handleChange}
            onBlur={formikRegister.handleBlur}
            className="form-control"
            name="confirm_password"
            value={formikRegister.values.confirm_password}
          />
          {formikRegister.errors.confirm_password &&
          formikRegister.touched.confirm_password ? (
            <p className="form-error">
              {formikRegister.errors.confirm_password}
            </p>
          ) : null}
        </div>
        <button type="submit" className="btn btn-primary w-100 btn">
          Register
        </button>
      </form>
      <button className="btn w-100 btn" >
            {`Already have an account?`} <Link to="/login">Login</Link>
        </button>
    </div>
  );
};

export default Register;
