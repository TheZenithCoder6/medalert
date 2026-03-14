"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Lock,
  Mail,
  User,
  ArrowRight,
  Loader2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

type AuthFormData = {
  name: string;
  email: string;
  password: string;
};

// using localStorage for now — swap with a real API later
// not ideal for prod but fine for the demo
export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<AuthFormData>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // fake network delay so it doesn't feel instant
    setTimeout(() => {
      if (isLogin) {
        const raw = localStorage.getItem("user_data");

        if (!raw) {
          alert("User not found. Signup first please.");
          setLoading(false);
          return;
        }

        const saved = JSON.parse(raw) as AuthFormData;

        if (saved.email === formData.email && saved.password === formData.password) {
          localStorage.setItem("isLoggedIn", "true");
          router.push("/user");
        } else {
          alert("Credentials did not match with data!");
          setLoading(false);
        }
      } else {
        // just overwriting if same email signs up again — good enough for now
        localStorage.setItem("user_data", JSON.stringify(formData));
        alert("Account created! login now.");
        setIsLogin(true);
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-red-500/30">
      {/* soft ambient glow in corners — gives depth without being distracting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-red-900/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-[440px] z-10">
        {/* logo + wordmark */}
        <div className="flex flex-col items-center mb-10 group">
          <div className="w-14 h-14 bg-gradient-to-tr from-red-600 to-red-400 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.3)] group-hover:scale-110 transition-transform duration-500">
            <Shield className="text-white" size={28} strokeWidth={2.5} />
          </div>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-white uppercase italic">
            Med<span className="text-red-500">Alert</span>
          </h1>
        </div>

        {/* card */}
        <div className="relative group">
          {/* top highlight border — fakes a glass edge */}
          <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[32px] pointer-events-none" />

          <div className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 md:p-10 shadow-2xl relative">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? "Welcome back" : "Create account"}
              </h2>
              <p className="text-slate-500 text-sm">
                {isLogin
                  ? "Please enter your details to sign in."
                  : "Start protecting your medical profile today."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* name field only shows on signup */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-1">
                    Name
                  </label>
                  <div className="relative group/input">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-red-500 transition-colors"
                      size={18}
                    />
                    <input
                      name="name"
                      type="text"
                      required
                      onChange={handleChange}
                      placeholder="Arjun Gupta"
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none focus:bg-white/[0.05] focus:border-red-500/50 transition-all placeholder:text-slate-700"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-1">
                  Email
                </label>
                <div className="relative group/input">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-red-500 transition-colors"
                    size={18}
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none focus:bg-white/[0.05] focus:border-red-500/50 transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-1">
                  Password
                </label>
                <div className="relative group/input">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-red-500 transition-colors"
                    size={18}
                  />
                  <input
                    name="password"
                    type="password"
                    required
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none focus:bg-white/[0.05] focus:border-red-500/50 transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  {/* TODO: actually build forgot password flow */}
                  <button
                    type="button"
                    className="text-[11px] font-bold text-red-500/80 hover:text-red-500 uppercase tracking-wider"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* shimmer effect on hover via the absolutely positioned div */}
              <button
                disabled={loading}
                className="group/btn relative w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-2xl mt-4 overflow-hidden transition-all active:scale-[0.98] disabled:opacity-70 shadow-[0_10px_20px_rgba(220,38,38,0.2)]"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <span>{isLogin ? "SIGN IN" : "GET STARTED"}</span>
                      <ArrowRight
                        size={18}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5">
              <p className="text-center text-slate-500 text-sm">
                {isLogin ? "Don't have an account?" : "Already a member?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-white font-bold hover:text-red-500 transition-colors underline underline-offset-4 decoration-red-500/30"
                >
                  {isLogin ? "Create account" : "Sign in instead"}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* trust badges — mostly cosmetic for now */}
        <div className="mt-8 flex items-center justify-center gap-6 text-slate-600">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              End-to-End Encrypted
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}
