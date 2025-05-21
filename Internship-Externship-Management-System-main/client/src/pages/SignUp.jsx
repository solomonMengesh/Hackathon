
import { Alert, Button, Label, TextInput, Select, Spinner } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import login from '../assets/login.svg'
import { useDispatch, useSelector } from 'react-redux';
import { signupStart, signupSuccess, signupFail, clearErrors } from "../redux/user/userSlice";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { signUpError, loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    employeeType: "", 
    gender: "", 
    position: "", 
    startDate: "", 
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id || e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    dispatch(signupStart());

    const res = await fetch("/api/AuthRoute/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
       console.log(" Response:", res);

    const data = await res.json();
    console.log("API Response:", data);
    
    
    
    // Check if data contains the expected user information
    if (data && (data.user || data._id)) {
      dispatch(signupSuccess(data));
      navigate("/SignIn"); // Changed to lowercase to match common conventions
    } else {
      dispatch(signupFail("Invalid response from server"));
    }
  } catch (error) {
    console.error("Signup error:", error);
    dispatch(signupFail(error.message));
  }
};

  return (
    <div className="h-screen mt-20 mb-40 lg:mb-0">
      <div className="flex md:flex-row flex-col mx-auto p-3 max-w-3xl items-center gap-10">
        <div className="flex-1">
          <span className="">
            <img className='hidden dark:block ' src={login} alt='Logo PT. Humpus Karbometil Selulosa' />
          </span>
        </div>

        <div className="flex-1 w-full">
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <Label className="text-md font-serif text-zinc-700">User Name</Label>
            <TextInput
              type="text"
              id="userName"
              placeholder="@hmisha..."
              className="font-bold font-serif py-0.5 rounded-lg"
              onChange={handleInputChange}
            />

            <Label className="text-md font-serif text-zinc-700">Email</Label>
            <TextInput
              type="email"
              id="email"
              placeholder="tekisha5050@gmail.com"
              className="font-bold font-serif py-0.5 rounded-lg"
              onChange={handleInputChange}
            />

            <Label className="text-md font-serif text-zinc-700">Password</Label>
            <TextInput
              type="password"
              id="password"
              placeholder="**********"
              className="font-bold font-serif py-0.5"
              onChange={handleInputChange}
            />
            
            <div className="item-center gap-12 mx-auto md:flex">
              <div className="">
                <div>
                  <Label className="text-md font-serif text-zinc-700">Employee type</Label>
                  <Select
                    id="employeeType"
                    value={formData.employeeType}
                    onChange={handleInputChange}
                    className="font-bold font-serif md:w-[150px]"
                  >
                    <option value="">Select</option>
                    <option value="FullTime">Full Time</option>
                    <option value="PartTime">Part time</option>
                  </Select>
                </div>
                <div>
                  <Label className="text-md font-serif text-zinc-700">Gender</Label>
                  <Select
                    id="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="font-bold font-serif md:w-[150px]"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Select>
                </div>
              </div>
              <div className="">
                <div>
                  <Label className="text-md font-serif text-zinc-700">Position</Label>
                  <Select
                    id="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="font-bold font-serif md:w-[150px]"
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
                <div>
                  <Label className="text-md font-serif text-zinc-700">Date</Label>
                  <div>
                    <TextInput
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      shadow
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              type="submit"
              className="px-4 py-0.5 my-5 font-serif text-zinc-100 font-bold"
              gradientDuoTone="purpleToPink"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="ml-1">loading...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </Button>

            {signUpError && <Alert color="red" className="-mt-5">{signUpError}</Alert>}
          </form>

          <h1 className="mt-5">
            <Link to="/SignIn" onClick={() => dispatch(clearErrors())}>
              <span className="text-zinc-700 dark:text-slate-200">Already have an account? </span>
              <span className="font-bold font-serif text-blue-600">Sign In</span>
            </Link>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default SignUp;