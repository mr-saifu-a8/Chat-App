import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const {login} = useContext(AuthContext)

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (currentState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    login(currentState === "Sign up" ? "signup" : "login", {fullName, email, password, bio})
  };

  const switchToLogin = () => {
    setCurrentState("Login");
    setIsDataSubmitted(false);
    setFullName("");
    setEmail("");
    setPassword("");
    setBio("");
  };

  const switchToSignup = () => {
    setCurrentState("Sign up");
    setIsDataSubmitted(false);
  };

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center px-5 py-10 bg-[#0d0b1e] overflow-y-auto"
      style={{
        backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(109,40,217,0.15) 0%, transparent 60%),
                          radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.1) 0%, transparent 50%)`,
      }}
    >
      <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16">
        {/* Left — Logo */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <img
            src={assets.logo_big}
            alt="logo"
            className="w-32 sm:w-40 lg:w-48 opacity-90"
          />
          <p className="text-white/25 text-xs tracking-widest uppercase">
            Chat anytime, anywhere
          </p>
        </div>

        {/* Divider — desktop only */}
        <div className="hidden sm:block w-px h-64 bg-white/8 shrink-0" />

        {/* Right — Form */}
        <form
          onSubmit={onSubmitHandler}
          className="w-full max-w-sm flex flex-col gap-5
            bg-white/5 border border-white/10
            rounded-2xl p-7
            shadow-[0_24px_60px_rgba(0,0,0,0.6)]
            backdrop-blur-xl"
        >
          {/* Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-white">
                {currentState === "Sign up"
                  ? isDataSubmitted
                    ? "One last step"
                    : "Create account"
                  : "Welcome back"}
              </h1>
              <p className="text-xs text-white/35 mt-0.5">
                {currentState === "Sign up"
                  ? isDataSubmitted
                    ? "Tell us a little about yourself"
                    : "Join the conversation"
                  : "Sign in to continue"}
              </p>
            </div>
            {isDataSubmitted && (
              <button
                type="button"
                onClick={() => setIsDataSubmitted(false)}
                className="p-2 rounded-xl hover:bg-white/8 transition-colors"
              >
                <img
                  src={assets.arrow_icon}
                  alt="back"
                  className="w-4 h-4 opacity-60"
                />
              </button>
            )}
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-3">
            {/* Full name — signup step 1 */}
            {currentState === "Sign up" && !isDataSubmitted && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/40 font-medium">
                  Full Name
                </label>
                <input
                  onChange={(e) => setFullName(e.target.value)}
                  value={fullName}
                  type="text"
                  placeholder="John Doe"
                  required
                  className="w-full bg-white/6 border border-white/10 rounded-xl
                    px-4 py-2.5 text-sm text-white placeholder-white/25
                    outline-none focus:border-violet-500/50 focus:bg-white/8
                    transition-all duration-200"
                />
              </div>
            )}

            {/* Email + Password — step 1 */}
            {!isDataSubmitted && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40 font-medium">
                    Email
                  </label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="w-full bg-white/6 border border-white/10 rounded-xl
                      px-4 py-2.5 text-sm text-white placeholder-white/25
                      outline-none focus:border-violet-500/50 focus:bg-white/8
                      transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40 font-medium">
                    Password
                  </label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full bg-white/6 border border-white/10 rounded-xl
                      px-4 py-2.5 text-sm text-white placeholder-white/25
                      outline-none focus:border-violet-500/50 focus:bg-white/8
                      transition-all duration-200"
                  />
                </div>
              </>
            )}

            {/* Bio — signup step 2 */}
            {currentState === "Sign up" && isDataSubmitted && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/40 font-medium">Bio</label>
                <textarea
                  onChange={(e) => setBio(e.target.value)}
                  value={bio}
                  placeholder="Write a short bio about yourself..."
                  required
                  rows={4}
                  className="w-full bg-white/6 border border-white/10 rounded-xl
                    px-4 py-2.5 text-sm text-white placeholder-white/25
                    outline-none focus:border-violet-500/50 focus:bg-white/8
                    transition-all duration-200 resize-none"
                />
              </div>
            )}
          </div>

          {/* Terms — only step 1 */}
          {!isDataSubmitted && (
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border transition-all duration-200
                  ${
                    agreed
                      ? "bg-violet-600 border-violet-500"
                      : "bg-white/6 border-white/20 group-hover:border-white/40"
                  } flex items-center justify-center`}
                >
                  {agreed && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <p className="text-xs text-white/35 leading-relaxed">
                I agree to the{" "}
                <span className="text-violet-400 hover:text-violet-300 transition-colors">
                  Terms of Use
                </span>{" "}
                &{" "}
                <span className="text-violet-400 hover:text-violet-300 transition-colors">
                  Privacy Policy
                </span>
              </p>
            </label>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-sm font-medium text-white
              bg-violet-600 hover:bg-violet-500
              active:scale-[0.98] transition-all duration-200
              shadow-lg shadow-violet-900/30
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {currentState === "Sign up"
              ? isDataSubmitted
                ? "Complete Sign Up"
                : "Continue"
              : "Sign In"}
          </button>

          {/* Switch auth mode */}
          <p className="text-center text-xs text-white/30">
            {currentState === "Sign up" ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={switchToSignup}
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  Sign up
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;