import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import { loginSchema } from "../../schemas/loginSchema";
import { useFormik } from "formik";
import { useLogin } from "../../api/auth/loginApi";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

const initialValuesLogin = {
  username: "",
  password: "",
};

function Login() {
  const loginMutation = useLogin();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };
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
            <div className="input-group">
              <input
                type="username"
                id="username"
                placeholder="Username"
                onChange={formikLogin.handleChange}
                onBlur={formikLogin.handleBlur}
                className="form-control"
                name="username"
                value={formikLogin.values.username}
              />
              <span className="input-group-text">
                <FaUser />
              </span>
            </div>
            {formikLogin.errors.username && formikLogin.touched.username ? (
              <p className="form-error">{formikLogin.errors.username}</p>
            ) : null}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <div className="input-group">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="Password"
                onChange={formikLogin.handleChange}
                onBlur={formikLogin.handleBlur}
                className="form-control"
                name="password"
                value={formikLogin.values.password}
              />
              <span
                className="input-group-text"
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer" }}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
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
