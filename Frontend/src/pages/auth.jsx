import React, { useState, useEffect } from "react";
import {
  User,
  Phone,
  Shield,
  Mail,
  ArrowRight,
  ChevronLeft,

  Stars,
  ChevronRight,
  Sparkles,
  Zap,
  MoveUpRight,
  Component,
  Lock,
  LogIn
} from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { BACKEND_URL } from "../config/apiConfig";

const Auth = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState("initial"); // initial, login, register, onboarding
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    userType: "Civilian",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Mahakaleshwar",
      subtitle: "The Eternal Light",
      description: "Witness the divine Bhasma Aarti and connect with the cosmic energy of Lord Shiva.",
      gradient: "from-orange-400/20 via-rose-400/10 to-transparent",
      accent: "#f97316",
      image: "https://tse1.mm.bing.net/th/id/OIP.Bw-3Z-3hOTRsZwLlHBtitQHaNK?w=900&h=1600&rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    {
      title: "Shipra Banks",
      subtitle: "Flow of Grace",
      description: "Where the sacred river washes away worldly ties, inviting spiritual purification.",
      gradient: "from-blue-400/20 via-indigo-400/10 to-transparent",
      accent: "#3b82f6",
      image: "https://img.freepik.com/premium-vector/holy-man-sadhu-meditating-jungle_1076263-591.jpg?w=740",
    },
    {
      title: "Smart Yatra",
      subtitle: "Sacred Tech",
      description: "Harnessing innovation to guide your heart through the ancient corridors of Ujjain.",
      gradient: "from-emerald-400/20 via-teal-400/10 to-transparent",
      accent: "#10b981",
      image: "https://tse3.mm.bing.net/th/id/OIP.GuZnKQM0tx7ajnUAPZMjRwHaFB?w=560&h=380&rs=1&pid=ImgDetMain&o=7&rm=3",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setMessage("");
      console.log("🚀 [Auth] Google Auth Success, verifying with backend...");

      try {
        // Note: useGoogleLogin returns an access token by default. 
        // For ID token verification on backend, we usually use the 'auth-code' flow or a different library config.
        // However, we can also fetch user info from Google API directly if needed or change the flow.
        // @react-oauth/google's useGoogleLogin can fetch an access token. 
        // If we want an ID token, we usually use the GoogleLogin component or the 'id_token' flow.

        // Let's use the access token to get user info or change the backend to accept access token.
        // Actually, for better security, we should use the GoogleLogin button component for ID tokens,
        // or fetch the user info here.

        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());

        const response = await fetch(`${BACKEND_URL}/auth/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken: tokenResponse.access_token, // Sending access_token for now, backend logic might need adjustment if it strictly expects ID token
            // Alternatively, we send the email and info if we trust the frontend (less secure)
            email: userInfo.email,
            name: userInfo.name,
            isAccessToken: true
          }),
        });

        const data = await response.json();

        if (response.ok) {
          if (data.needsOnboarding) {
            setFormData({
              ...formData,
              name: userInfo.name || "",
              email: userInfo.email || "",
            });
            setStep("onboarding");
          } else {
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            setIsAuthenticated(true);
            navigate("/");
          }
        } else {
          setMessage(data.message || "Authentication failed.");
        }
      } catch (error) {
        console.error("❌ [Auth] Google Auth Error:", error);
        setMessage("Connection failed. Try again.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("❌ [Auth] Google Login Failed:", error);
      setMessage("Google Login failed.");
      setIsLoading(false);
    },
  });

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
        navigate("/");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage("Connection error. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
        navigate("/");
      } else {
        // If account already exists, suggest logging in
        if (data.message && data.message.toLowerCase().includes("already registered")) {
          setMessage("✨ This email is already registered. Please Login instead.");
          setTimeout(() => setStep("login"), 2000);
        } else {
          setMessage(data.message || "Registration failed");
        }
      }
    } catch (err) {
      setMessage("Sanctum error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-white md:bg-slate-100 flex items-center justify-center md:pt-8 px-0 md:px-12 lg:px-32 pb-0 md:pb-8 font-['Outfit'] relative overflow-hidden">
      {/* Mesh Gradient Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-60 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[60%] lg:w-[40%] h-[40%] bg-orange-200/40 rounded-full blur-[80px] lg:blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[60%] lg:w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[80px] lg:blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* THE MASTER BOX: Compact & High-Fi (Perfectly Sized for Desktop) */}


      {/* Enhanced Vertical Divider - Moved here to prevent clipping */}
      <div className="hidden lg:flex absolute left-[55%] top-0 bottom-0 w-[1px] z-30 flex items-center justify-center -translate-x-1/2 pointer-events-none">
        {/* Base Line */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-200 to-transparent opacity-80"></div>

        {/* Glowing Aura */}
        <div className="absolute top-1/4 bottom-1/4 w-[2px] bg-orange-400/20 blur-[2px]"></div>

        {/* High-End Center Badge */}
        <div className="relative group cursor-pointer z-30 pointer-events-auto">
          {/* Pulse Animation */}
          <div className="absolute inset-[-4px] bg-orange-400/20 rounded-full animate-ping group-hover:duration-300"></div>

          {/* Badge Surface */}
          <div className="w-10 h-10 bg-white border-2 border-slate-50 rounded-full flex items-center justify-center shadow-[0_8px_20px_-4px_rgba(0,0,0,0.12)] relative transition-transform group-hover:scale-110 duration-500">
            <div className="w-7 h-7 bg-orange-50 rounded-full flex items-center justify-center">
              <Stars size={14} className="text-orange-500 animate-pulse" />
            </div>
          </div>

          {/* Decorative Accent Dots */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-1 h-1 bg-slate-300 rounded-full"></div>
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-200 rounded-full shadow-sm"></div>
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-200 rounded-full shadow-sm"></div>
          <div className="absolute top-32 left-1/2 -translate-x-1/2 w-1 h-1 bg-slate-300 rounded-full"></div>
        </div>
      </div>

      {/* Left Side: Art & Experience - Responsive */}
      <div className="hidden md:flex lg:w-[55%] relative items-center justify-center p-8 lg:p-20 overflow-hidden shrink-0">
        <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000 ${slides[currentSlide].gradient}`}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>

        <div className="relative w-full max-w-xl flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:gap-8 text-left lg:text-left">
          {/* The Portal Image */}
          <div className="relative group shrink-0">
            <div className="w-[80px] h-[80px] md:w-[240px] md:h-[240px] lg:w-[280px] lg:h-[280px] rounded-xl lg:rounded-[3rem] overflow-hidden border-[3px] lg:border-[10px] border-white shadow-xl transition-all duration-700">
              <img
                src={slides[currentSlide].image}
                className="w-full h-full object-cover transition-transform duration-1000"
                alt="Ujjain"
              />
            </div>
            <div className="hidden lg:flex absolute -bottom-4 -right-4 w-16 h-16 bg-white rounded-2xl shadow-xl items-center justify-center -rotate-12">
              <Sparkles className="text-orange-500" size={24} />
            </div>
          </div>

          <div className="space-y-0.5 lg:space-y-4 animate-in fade-in slide-in-from-left-12 duration-1000 delay-150">
            <div className="hidden lg:flex items-center justify-start gap-3">
              <span className="w-10 h-[2px] bg-slate-300"></span>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Chapter 0{currentSlide + 1}</p>
            </div>
            <h1 className="text-base lg:text-6xl font-black text-slate-900 leading-tight tracking-tighter">
              {slides[currentSlide].title}<br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-600 italic lg:ml-0 ml-1">{slides[currentSlide].subtitle}</span>
            </h1>
            <p className="text-[10px] lg:text-base text-slate-600 font-medium max-w-xs leading-tight">
              {slides[currentSlide].description}
            </p>
          </div>

          {/* Controls (Smaller on Mobile) */}
          <div className="hidden lg:flex items-center justify-start gap-4 mt-1">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1 lg:h-1 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-12 bg-slate-900' : 'w-2 bg-slate-200'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Identity Portal (Full Focus on Mobile) */}
      <div className="flex-1 relative flex items-center justify-center pt-8 px-6 pb-8 lg:p-10 bg-white shrink-0 overflow-y-auto lg:overflow-hidden">
        {/* Internal Glow Effects */}
        <div className="absolute top-1/4 -right-1/4 w-80 h-80 bg-orange-400/10 rounded-full blur-[100px] animate-pulse"></div>

        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] opacity-[0.03] pointer-events-none"></div>

        <div className="w-full max-w-sm relative z-20">

          {/* Compact Logo for Mobile Impact */}
          <div className="flex justify-center mb-6 lg:mb-4">
            <div className="relative w-20 lg:w-20 h-20 lg:h-20 flex items-center justify-center group pointer-events-none">
              {/* Core Energy Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/25 to-red-600/25 rounded-full blur-2xl"></div>

              {/* Swirling Rings */}
              <div className="absolute w-[115%] h-[115%] border-t-2 border-orange-500/40 rounded-full animate-[spin_5s_linear_infinite]"></div>
              <div className="absolute w-[95%] h-[95%] border-b-2 border-red-500/30 rounded-full animate-[spin_8s_linear_infinite_reverse]"></div>

              {/* The Logo Disk */}
              <div className="relative z-10 w-16 lg:w-16 h-16 lg:h-16 rounded-full overflow-hidden p-1 bg-gradient-to-br from-orange-500 to-red-600 shadow-[0_10px_30px_-5px_rgba(249,115,22,0.4)]">
                <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                  <img src={logo} alt="Divya Yatra Logo" className="w-[85%] h-[85%] object-contain" />
                </div>
              </div>
            </div>
          </div>

          {/* Auth Form Container with Glass Surface */}
          <div className="p-0.5">
            <div className="text-center mb-1 lg:mb-4">
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-1 lg:mb-2 tracking-tighter drop-shadow-sm">
                {step === "initial" ? "Divine" : "Sacred"}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 underline-offset-8"> Entry</span>
              </h2>
              <div className="inline-flex items-center px-4 py-1.5 bg-orange-50 rounded-full border border-orange-100/50">
                <Sparkles size={12} className="text-orange-500 mr-2" />
                <p className="text-orange-950 font-black uppercase text-[9px] tracking-[0.3em]">
                  Premium Access Portal
                </p>
              </div>
            </div>

            {step === "initial" ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="space-y-4">
                  <button
                    onClick={() => setStep("login")}
                    className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-base tracking-widest uppercase transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-4 group"
                  >
                    Login
                    <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setStep("register")}
                    className="w-full h-14 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-base tracking-widest uppercase transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-4"
                  >
                    Register
                    <User size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="py-4 flex flex-col items-center justify-center bg-white/60 rounded-3xl border border-white shadow-sm">
                    <Zap size={18} className="text-orange-500 mb-1" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Divine Speed</span>
                  </div>
                  <div className="py-4 flex flex-col items-center justify-center bg-white/60 rounded-3xl border border-white shadow-sm">
                    <Shield size={18} className="text-blue-500 mb-1" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Total Secure</span>
                  </div>
                </div>
              </div>
            ) : step === "login" ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
                {/* Google Login Option */}
                <button
                  onClick={() => handleGoogleAuth()}
                  disabled={isLoading}
                  className="w-full h-12 bg-white hover:bg-slate-50 text-slate-900 rounded-xl font-bold text-sm flex items-center justify-center transition-all duration-300 shadow-sm border border-slate-200"
                >
                  <GoogleIcon />
                  <span className="ml-2">Continue with Google Login</span>
                </button>

                <div className="relative flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-slate-100"></div>
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">or manual login</span>
                  <div className="flex-1 h-px bg-slate-100"></div>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-3">
                    <div className="relative group/input">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-orange-500">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 font-bold outline-none focus:border-orange-500 transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="relative group/input">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-orange-500">
                        <Lock size={18} />
                      </div>
                      <input
                        type="password"
                        placeholder="Password"
                        className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 font-bold outline-none focus:border-orange-500 transition-all"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl"
                  >
                    {isLoading ? "Authenticating..." : "Login to Sanctum"}
                    <ArrowRight size={18} />
                  </button>
                </form>

                <div className="flex flex-col gap-2">
                  <button onClick={() => setStep("register")} className="text-[10px] font-black uppercase text-slate-400 hover:text-orange-500 tracking-widest">
                    New here? Create Account
                  </button>
                  <button onClick={() => setStep("initial")} className="text-[10px] font-black uppercase text-slate-300 hover:text-slate-500 tracking-widest">
                    Cancel
                  </button>
                </div>
              </div>
            ) : step === "register" ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
                <button
                  onClick={() => handleGoogleAuth()}
                  disabled={isLoading}
                  className="w-full h-12 bg-white hover:bg-slate-50 text-slate-900 rounded-xl font-bold text-sm flex items-center justify-center transition-all duration-300 shadow-sm border border-slate-200"
                >
                  <GoogleIcon />
                  <span className="ml-2">Register with Google</span>
                </button>

                <div className="relative flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-slate-100"></div>
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">or manual registration</span>
                  <div className="flex-1 h-px bg-slate-100"></div>
                </div>

                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="relative group/input">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 font-bold outline-none focus:border-orange-500 transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="relative group/input">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 font-bold outline-none focus:border-orange-500 transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="relative group/input">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                      <Phone size={18} />
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 font-bold outline-none focus:border-orange-500 transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="relative group/input">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      placeholder="Set Password"
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 font-bold outline-none focus:border-orange-500 transition-all"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl"
                  >
                    Create Account
                    <ArrowRight size={18} />
                  </button>
                </form>

                <div className="flex flex-col gap-2">
                  <button onClick={() => setStep("login")} className="text-[10px] font-black uppercase text-slate-400 hover:text-orange-500 tracking-widest">
                    Already have an account? Login
                  </button>
                  <button onClick={() => setStep("initial")} className="text-[10px] font-black uppercase text-slate-300 hover:text-slate-500 tracking-widest">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* ONBOARDING STEP (Google Signup Finalize) */
              <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="bg-orange-50 p-4 rounded-2xl mb-4">
                  <p className="text-[10px] font-black uppercase text-orange-600 tracking-widest mb-1 text-center">Finalize Profile</p>
                  <p className="text-xs text-orange-800 text-center">Almost there, {formData.name.split(' ')[0]}! Complete your details.</p>
                </div>

                <div className="space-y-3">
                  <div className="relative group/input">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                      <Phone size={18} />
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full bg-white border-2 border-slate-50 focus:border-orange-500 rounded-2xl py-4 pl-14 text-slate-900 font-bold outline-none"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="relative group/input">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      placeholder="Set Password"
                      className="w-full bg-white border-2 border-slate-50 focus:border-orange-500 rounded-2xl py-4 pl-14 text-slate-900 font-bold outline-none"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="relative group/input">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                      <Shield size={18} />
                    </div>
                    <select
                      value={formData.userType}
                      onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                      className="w-full bg-white border-2 border-slate-50 focus:border-orange-500 rounded-2xl py-4 pl-14 text-slate-900 font-bold appearance-none outline-none"
                    >
                      <option value="Civilian">Civilian</option>
                      <option value="VIP">VIP</option>
                      <option value="Sadhu">Sadhu</option>
                      <option value="Aged">Aged</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-orange-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-orange-700 active:scale-95 transition-all"
                >
                  Finish Journey Setup
                </button>
              </form>
            )}

            {message && (
              <div className="mt-4 lg:mt-8 p-4 bg-orange-50 border border-orange-200 rounded-[1rem] text-orange-600 text-xs font-black uppercase tracking-widest text-center shadow-lg">
                {message}
              </div>
            )}
          </div>

          {/* Cinematic Minimal Footer */}
          <div className="mt-2 lg:mt-6 flex flex-col items-center">
            <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-4 hidden lg:block"></div>
            <div className="flex items-center gap-6">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping hidden lg:block"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 opacity-60">Divya Yatra</span>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping hidden lg:block" style={{ animationDelay: "1s" }}></div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 0; }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-orbit {
          animation: orbit 20s linear infinite;
        }
      `}</style>
    </div >
  );
};

export default Auth;