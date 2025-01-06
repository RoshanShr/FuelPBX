import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import { loginSchema } from "../../schemas/loginSchema";
import { useFormik } from "formik";
import { useLogin } from "../../api/auth/loginApi";

const initialValuesLogin = {
  username: "",
  password: "",
};

function Login() {
  const loginMutation = useLogin();

  const formikLogin = useFormik({
    initialValues: initialValuesLogin,
    validationSchema: loginSchema,
    onSubmit: (values) => {
      loginMutation.mutate(values);
    },
  });

  return (
    <div>
      <form onSubmit={formikLogin.handleSubmit}>
        <div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username:
            </label>
            <input
              type="username"
              id="username"
              placeholder="Username@CompanyAlias"
              onChange={formikLogin.handleChange}
              onBlur={formikLogin.handleBlur}
              className="form-control"
              name="username"
              value={formikLogin.values.username}
            />
            {formikLogin.errors.username && formikLogin.touched.username ? (
              <p className="form-error">{formikLogin.errors.username}</p>
            ) : null}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"

              onChange={formikLogin.handleChange}
              onBlur={formikLogin.handleBlur}
              className="form-control"
              name="password"
              value={formikLogin.values.password}
            />
            {formikLogin.errors.password && formikLogin.touched.password ? (
              <p className="form-error">{formikLogin.errors.password}</p>
            ) : null}
          </div>

          <button type="submit" className="btn btn-success w-100 btn">
            Login
          </button>
        </div>
      </form>
      {/* <button className="btn w-100 btn" >
            {`Need an account?`} <Link to="/register">Sign Up</Link>
        </button> */}
    </div>
  );
}

export default Login;
