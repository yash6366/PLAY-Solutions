"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, Loader2, ShieldCheck, ArrowRight, KeyRound, ArrowLeft } from "lucide-react";
import { brandConfig } from "@/config/brand";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // MFA Challenge State
  const [mfaChallengeToken, setMfaChallengeToken] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setErrorMessage("Too many login attempts. Please wait 5 minutes before trying again.");
        } else {
          setErrorMessage(data.error || "Authentication failed. Invalid credentials.");
        }
        setIsLoading(false);
        return;
      }

      // Check if MFA verification is required
      if (data.mfaRequired && data.challengeToken) {
        setMfaChallengeToken(data.challengeToken);
        setIsLoading(false);
        return;
      }

      // Direct login successful - redirect to dashboard
      router.push("/admin");
      router.refresh();
    } catch {
      setErrorMessage("A network error occurred. Please check your connection and retry.");
      setIsLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!mfaCode.trim() || !mfaChallengeToken) {
      setErrorMessage(isRecoveryMode ? "Please enter an 8-character recovery code." : "Please enter your 6-digit TOTP code.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeToken: mfaChallengeToken,
          code: mfaCode.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Invalid verification code.");
        setIsLoading(false);
        return;
      }

      // MFA successfully verified - redirect to dashboard
      router.push("/admin");
      router.refresh();
    } catch {
      setErrorMessage("A network error occurred during MFA verification. Please retry.");
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setMfaChallengeToken(null);
    setMfaCode("");
    setIsRecoveryMode(false);
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center text-center mb-8 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-[1px] shadow-lg shadow-blue-500/20 mb-4 flex items-center justify-center">
          <div className="w-full h-full bg-[#090D1A] rounded-[15px] flex items-center justify-center">
            {mfaChallengeToken ? (
              <KeyRound className="w-7 h-7 text-cyan-400" />
            ) : (
              <ShieldCheck className="w-7 h-7 text-cyan-400" />
            )}
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {brandConfig.companyName}
        </h1>
        <p className="text-xs font-semibold tracking-wider uppercase text-cyan-400 mt-1">
          {mfaChallengeToken ? "Two-Factor Verification" : "Authorized Staff Portal"}
        </p>
        <p className="text-sm text-slate-400 mt-2">
          {mfaChallengeToken
            ? isRecoveryMode
              ? "Enter one of your emergency recovery codes to authenticate."
              : "Enter the 6-digit verification code from your authenticator app."
            : "Sign in to manage client inquiries, candidate applications, and operations."}
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800/80 text-red-200 text-sm flex items-start gap-3 animate-in fade-in duration-200"
        >
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!mfaChallengeToken ? (
        /* Phase 1: Credentials Form */
        <form onSubmit={handleCredentialsSubmit} className="space-y-5 relative z-10">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
              Administrator Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@playqsolutions.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-750 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 focus:border-cyan-500 text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-750 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 focus:border-cyan-500 text-sm transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* Phase 2: MFA Challenge Form */
        <form onSubmit={handleMfaSubmit} className="space-y-5 relative z-10">
          <div>
            <label htmlFor="mfa-code" className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
              {isRecoveryMode ? "Emergency Recovery Code" : "6-Digit Authenticator Code"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                id="mfa-code"
                name="mfaCode"
                type="text"
                inputMode={isRecoveryMode ? "text" : "numeric"}
                autoComplete="one-time-code"
                autoFocus
                required
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder={isRecoveryMode ? "ABCD-1234" : "123456"}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-750 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 focus:border-cyan-500 text-base font-mono tracking-widest text-center transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setIsRecoveryMode(!isRecoveryMode);
                setMfaCode("");
                setErrorMessage(null);
              }}
              className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              {isRecoveryMode ? "Use 6-digit authenticator code" : "Use emergency recovery code"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying MFA Code...</span>
              </>
            ) : (
              <>
                <span>Complete Verification</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleBackToLogin}
            disabled={isLoading}
            className="w-full py-2 px-3 text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel and back to login</span>
          </button>
        </form>
      )}

      <div className="mt-8 pt-6 border-t border-slate-800 text-center relative z-10">
        <p className="text-xs text-slate-500 leading-relaxed">
          Security Notice: Access restricted to authorized staff. Sessions expire after 8 hours. All administrative activities are cryptographically signed and logged.
        </p>
      </div>
    </div>
  );
}
