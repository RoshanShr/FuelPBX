import React from "react";
import { useFormik } from "formik";

const UserAddForm = ({ 
  initialValues, 
  validationSchema, 
  onSubmit, 
  onCancel, 
  isEdit = false 
}) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, action) => {
      onSubmit(values);
      action.resetForm();
    },
    enableReinitialize: true, // Ensure form values reset on edit/add toggle

  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="mb-3 row">
        <label htmlFor="fullname" className="col-sm-3 col-form-label">
          Fullname
        </label>
        <div className="col-sm-9">
          <input
            type="text"
            className="form-control"
            id="fullname"
            name="fullname"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.fullname}
          />
          {formik.errors.fullname && formik.touched.fullname && (
            <p className="form-error">{formik.errors.fullname}</p>
          )}
        </div>
      </div>

      <div className="mb-3 row">
        <label htmlFor="username" className="col-sm-3 col-form-label">
          Username
        </label>
        <div className="col-sm-9">
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
          {formik.errors.username && formik.touched.username && (
            <p className="form-error">{formik.errors.username}</p>
          )}
        </div>
      </div>

      <div className="mb-3 row">
        <label htmlFor="email" className="col-sm-3 col-form-label">
          Email
        </label>
        <div className="col-sm-9">
          <input
            type="text"
            className="form-control"
            id="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.errors.email && formik.touched.email && (
            <p className="form-error">{formik.errors.email}</p>
          )}
        </div>
      </div>

      {!isEdit && (
        <>
          <div className="mb-3 row">
            <label htmlFor="password" className="col-sm-3 col-form-label">
              Password
            </label>
            <div className="col-sm-9">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.errors.password && formik.touched.password && (
                <p className="form-error">{formik.errors.password}</p>
              )}
            </div>
          </div>

          <div className="mb-3 row">
            <label
              htmlFor="confirm_password"
              className="col-sm-3 col-form-label"
            >
              Confirm Password
            </label>
            <div className="col-sm-9">
              <input
                type="password"
                className="form-control"
                id="confirm_password"
                name="confirm_password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirm_password}
              />
              {formik.errors.confirm_password &&
                formik.touched.confirm_password && (
                  <p className="form-error">
                    {formik.errors.confirm_password}
                  </p>
                )}
            </div>
          </div>
        </>
      )}

      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {isEdit ? "Save Changes" : "Add User"}
        </button>
      </div>
    </form>
  );
};

export default UserAddForm;
