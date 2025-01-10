import React from "react";
import { useFormik } from "formik";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const ExtensionAddForm = ({
  initialValues,
  validationSchema,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  const formikExtension = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, action) => {
      onSubmit(values);
      action.resetForm();
    },
    enableReinitialize: true, // Ensure form values reset on edit/add toggle
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  return (
    <form onSubmit={formikExtension.handleSubmit}>
      <div className="mb-3 row">
        <label htmlFor="agent" className="col-sm-3 col-form-label">
          Agent
        </label>
        <div className="col-sm-9">
          <input
            type="text"
            className="form-control"
            id="agent"
            name="agent"
            onChange={formikExtension.handleChange}
            onBlur={formikExtension.handleBlur}
            value={formikExtension.values.agent}
          />
          {formikExtension.errors.agent && formikExtension.touched.agent ? (
            <p className="form-error">{formikExtension.errors.agent}</p>
          ) : null}
        </div>
      </div>

      <div className="mb-3 row">
        <label htmlFor="email" className="col-sm-3 col-form-label">
          Extension
        </label>
        <div className="col-sm-9">
          <input
            type="text"
            className="form-control"
            id="extension"
            name="extension"
            onChange={formikExtension.handleChange}
            onBlur={formikExtension.handleBlur}
            value={formikExtension.values.extension}
          />
          {formikExtension.errors.extension &&
          formikExtension.touched.extension ? (
            <p className="form-error">{formikExtension.errors.extension}</p>
          ) : null}
        </div>
      </div>

      <div className="mb-3 row">
        <label htmlFor="password" className="col-sm-3 col-form-label">
          Password
        </label>
        <div className="col-sm-9">
        <div className="input-group">
          <input
            type={passwordVisible ? "text" : "password"}
            className="form-control"
            id="password"
            name="password"
            onChange={formikExtension.handleChange}
            onBlur={formikExtension.handleBlur}
            value={formikExtension.values.password}
          />
          <span
            className="input-group-text"
            onClick={togglePasswordVisibility}
            style={{ cursor: "pointer" }}
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {formikExtension.errors.password &&
          formikExtension.touched.password ? (
            <p className="form-error">{formikExtension.errors.password}</p>
          ) : null}
        </div>
      </div>

      {/* <div className="mb-3 row">
        <label htmlFor="confirm_password" className="col-sm-3 col-form-label">
          Confirm Password
        </label>
        <div className="col-sm-9">
          <input
            type="text"
            className="form-control"
            id="confirm_password"
            name="confirm_password"
            onChange={formikExtension.handleChange}
            onBlur={formikExtension.handleBlur}
            value={formikExtension.values.confirm_password}
          />
          {formikExtension.errors.confirm_password &&
          formikExtension.touched.confirm_password ? (
            <p className="form-error">
              {formikExtension.errors.confirm_password}
            </p>
          ) : null}
        </div>
      </div> */}
      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {isEdit ? "Save Changes" : "Add Extension"}
        </button>
      </div>
    </form>
  );
};

export default ExtensionAddForm;
