import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "@/store/slices/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { token } = useParams();

  const handleResetPassword = (e) => {
    e.preventDefault();
    dispatch(resetPassword(token, { password, confirmPassword }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [dispatch, isAuthenticated, loading]);

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-center">
      <div className="glass mx-auto w-full h-auto px-8 flex flex-col gap-6 items-center py-8 justify-center rounded-2xl sm:w-[500px]">
        <h1 className="gradient-text text-4xl font-extrabold mb-2 md:text-5xl lg:text-6xl text-center">
          Reset Password
        </h1>
        <p className="text-stone-500 text-center px-4 mb-4">
          Enter your new password below.
        </p>
        <form onSubmit={handleResetPassword} className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-2 relative">
            <label className="text-[16px] text-stone-500 font-semibold">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-9 text-stone-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          <div className="flex flex-col gap-2 relative">
            <label className="text-[16px] text-stone-500 font-semibold">Confirm New Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-9 text-stone-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          <button
            className="gradient-bg font-semibold text-xl py-3 px-8 rounded-full text-white mx-auto mt-4 w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
