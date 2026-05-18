import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "@/store/slices/userSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleForgotPassword = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-center">
      <div className="glass mx-auto w-full h-auto px-8 flex flex-col gap-6 items-center py-8 justify-center rounded-2xl sm:w-[500px]">
        <h1 className="gradient-text text-4xl font-extrabold mb-2 md:text-5xl lg:text-6xl text-center">
          Forgot Password
        </h1>
        <p className="text-stone-500 text-center px-4 mb-4">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleForgotPassword} className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-2">
            <label className="text-[16px] text-stone-500 font-semibold">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
              required
            />
          </div>
          <button
            className="gradient-bg font-semibold text-xl py-3 px-8 rounded-full text-white mx-auto mt-4 w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;
