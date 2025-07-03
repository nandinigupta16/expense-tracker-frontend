import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

// Validation Schema
const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(8, "Min 8 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm your password"),
  agreeToTerms: Yup.boolean().oneOf([true], "You must accept the terms"),
});

const RegistrationForm = () => {
  // Mutation
  const mutation = useMutation({
    mutationFn: async (payload) => {
      return await axios.post("/api/v1/users/register", payload);
    },
    onSuccess: (data) => {
      console.log("✅ Registered:", data?.data?.message);
    },
    onError: (error) => {
      console.error("❌ Error:", error?.response?.data?.message || error.message);
    },
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
    validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-w-md mx-auto my-10 bg-white p-6 rounded-xl shadow-lg space-y-6 border border-gray-200"
    >
      <h2 className="text-3xl font-semibold text-center text-gray-800">Sign Up</h2>
      <p className="text-sm text-center text-gray-500">Join our community now!</p>

      {/* Username */}
      <div className="relative">
        <FaUser className="absolute top-3 left-3 text-gray-400" />
        <input
          type="text"
          id="username"
          {...formik.getFieldProps("username")}
          placeholder="Username"
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {formik.touched.username && formik.errors.username && (
          <span className="text-xs text-red-500">{formik.errors.username}</span>
        )}
      </div>

      {/* Email */}
      <div className="relative">
        <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
        <input
          type="email"
          id="email"
          {...formik.getFieldProps("email")}
          placeholder="Email"
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {formik.touched.email && formik.errors.email && (
          <span className="text-xs text-red-500">{formik.errors.email}</span>
        )}
      </div>

      {/* Password */}
      <div className="relative">
        <FaLock className="absolute top-3 left-3 text-gray-400" />
        <input
          type="password"
          id="password"
          {...formik.getFieldProps("password")}
          placeholder="Password"
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {formik.touched.password && formik.errors.password && (
          <span className="text-xs text-red-500">{formik.errors.password}</span>
        )}
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <FaLock className="absolute top-3 left-3 text-gray-400" />
        <input
          type="password"
          id="confirmPassword"
          {...formik.getFieldProps("confirmPassword")}
          placeholder="Confirm Password"
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <span className="text-xs text-red-500">{formik.errors.confirmPassword}</span>
        )}
      </div>

      {/* Terms */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="agreeToTerms"
          {...formik.getFieldProps("agreeToTerms")}
          className="accent-blue-500"
        />
        <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
          I agree to the terms and conditions
        </label>
      </div>
      {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
        <span className="text-xs text-red-500">{formik.errors.agreeToTerms}</span>
      )}

      {/* Mutation Feedback */}
      {mutation.isLoading && <p className="text-blue-500 text-sm">Registering...</p>}
      {mutation.isSuccess && <p className="text-green-500 text-sm">Registration successful!</p>}
      {mutation.isError && (
        <p className="text-red-500 text-sm">
          {mutation.error?.response?.data?.message || "Something went wrong"}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
      >
        Register
      </button>
    </form>
  );
};

export default RegistrationForm;
