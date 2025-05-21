import { Alert, Button, Label, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import login from '../assets/login.svg'
import { useDispatch, useSelector } from "react-redux";
import {
  signinStart,
  signinFail,
  signinSuccess,
  clearErrors,
} from "../redux/user/userSlice";
import { Spinner } from "flowbite-react";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, signInError, loading } = useSelector(
    (state) => state.user
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    position: "", // Consistent field name
  });
  console.log("formData", formData)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signinStart());
      const res = await fetch("/api/AuthRoute/SignIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Sign in failed");
      }

      dispatch(signinSuccess(data));
      
      // Store position-specific IDs if needed
      if (data?.position && data._id) {
        localStorage.setItem(`${data.position}Id`, data._id);
      }

      navigate("/");
    } catch (error) {
      dispatch(signinFail(error.message || "Something went wrong"));
    }
  };

  return (
    <div className="h-screen mt-24 mb-40 lg:mb-0">
      <div className="flex max-w-3xl mx-auto items-center p-3 gap-10 flex-col md:flex-row">
        {/* Left side */}
        <div className="flex-1">
          <span className="">
            <img className='hidden dark:block ' src={login} alt='Logo PT. Humpus Karbometil Selulosa' />
          </span>
        </div>

        {/* Right side - Form */}
        <div className="flex-1 w-full">
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <label htmlFor="email" className="text-md font-medium">Email</label>
            <TextInput
              type="email"
              id="email"
              placeholder="example@gmail.com"
              className="font-bold py-0.5"
              onChange={handleChange}
              value={formData.email}
              required
            />

            <label htmlFor="password" className="text-md font-medium">Password</label>
            <TextInput
              type="password"
              id="password"
              placeholder="**********"
              className="font-bold py-0.5"
              onChange={handleChange}
              value={formData.password}
              required
              minLength="6"
            />

            <div className="w-full">
              <Label className="text-md font-serif text-zinc-700">Position</Label>
              <Select
                id="position"  // Consistent with state
                value={formData.position}
                onChange={handleChange}  // Using the same handler
                className="font-bold font-serif"
                required
              >
                <option value="">Select</option>
                <option value="CEO">CEO</option>
                <option value="COO">COO</option>
                <option value="CTO">CTO</option>
                <option value="CISO">CISO</option>
                <option value="Director">Director</option>
                <option value="DeptLead">Dept Lead</option>
                <option value="NormalEmployee">Normal Employee</option>
              </Select>
            </div>

            <Button
              type="submit"
              className="my-5 px-4 py-0.5"
              gradientDuoTone="purpleToPink"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="ml-2">Loading...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </Button>

            {signInError && (
              <Alert color="red" className="-mt-5">
                {signInError}
              </Alert>
            )}
          </form>

          <h1 className="mt-5">
            <Link to="/SignUp" onClick={() => dispatch(clearErrors())}>
              Don't have an account?{" "}
              <span className="font-bold font-serif text-blue-600">
                Create Account
              </span>
            </Link>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default SignIn;