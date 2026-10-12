"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle2, AlertCircle, X, Shield } from "lucide-react";

interface SecretAdminGateProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SecretAdminGate({ isOpen, onClose }: SecretAdminGateProps) {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin("");
      setIsError(false);
      setIsSuccess(false);
      // Auto focus input
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const verifyPin = (currentPin: string) => {
    if (currentPin === "0000") {
      setIsSuccess(true);
      setIsError(false);
      setTimeout(() => {
        onClose();
        router.push("/admin/login");
      }, 600);
    } else {
      setIsError(true);
      setTimeout(() => {
        setPin("");
        setIsError(false);
        inputRef.current?.focus();
      }, 800);
    }
  };

  const handleDigitInput = (digit: string) => {
    if (isSuccess || pin.length >= 4) return;
    const nextPin = pin + digit;
    setPin(nextPin);
    if (nextPin.length === 4) {
      verifyPin(nextPin);
    }
  };

  const handleBackspace = () => {
    if (isSuccess) return;
    setPin((prev) => prev.slice(0, -1));
    setIsError(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPin(val);
    if (val.length === 4) {
      verifyPin(val);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="secret-gate-title"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-sm rounded-3xl p-6 sm:p-8 bg-[#0b0f19] border ${
          isError
            ? "border-rose-500/60 shadow-rose-950/50"
            : isSuccess
            ? "border-emerald-500/60 shadow-emerald-950/50"
            : "border-cyan-500/30 shadow-cyan-950/50"
        } shadow-2xl transition-all duration-300 text-center`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
          aria-label="Close Security Gate"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon Header */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
              isSuccess
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : isError
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-shake"
                : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-7 h-7" />
            ) : isError ? (
              <AlertCircle className="w-7 h-7" />
            ) : (
              <Shield className="w-7 h-7" />
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          id="secret-gate-title"
          className="text-lg font-bold text-white tracking-tight"
        >
          {isSuccess
            ? "Authorization Confirmed"
            : isError
            ? "Access Denied"
            : "Security Authentication"}
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          {isSuccess
            ? "Redirecting to Administrative Console..."
            : isError
            ? "Invalid security passkey. Please retry."
            : "Enter the 4-digit security code to proceed"}
        </p>

        {/* Hidden Accessible Input for keyboard typing */}
        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          value={pin}
          onChange={handleInputChange}
          className="sr-only"
          autoFocus
          aria-label="4-digit access code"
        />

        {/* Visual PIN Dots / Slots */}
        <div
          className="flex justify-center items-center gap-3.5 mb-7 cursor-pointer"
          onClick={() => inputRef.current?.focus()}
        >
          {[0, 1, 2, 3].map((index) => {
            const hasDigit = index < pin.length;
            return (
              <div
                key={index}
                className={`w-11 h-12 rounded-xl flex items-center justify-center text-lg font-mono font-bold transition-all duration-200 border ${
                  isError
                    ? "border-rose-500/70 bg-rose-950/30 text-rose-300"
                    : isSuccess
                    ? "border-emerald-500/70 bg-emerald-950/30 text-emerald-300"
                    : hasDigit
                    ? "border-cyan-400/80 bg-cyan-950/30 text-cyan-300 shadow-sm shadow-cyan-500/30 scale-105"
                    : "border-slate-800 bg-slate-900/60 text-slate-500"
                }`}
              >
                {hasDigit ? "•" : ""}
              </div>
            );
          })}
        </div>

        {/* Tactile Keypad (for mobile and mouse interaction) */}
        <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
            <button
              key={digit}
              type="button"
              disabled={isSuccess || pin.length >= 4}
              onClick={() => handleDigitInput(digit)}
              className="h-11 rounded-xl bg-slate-900/70 hover:bg-slate-800 text-white font-mono font-semibold text-base transition-colors border border-slate-800/80 active:scale-95 disabled:opacity-50"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            disabled={isSuccess || pin.length === 0}
            onClick={handleBackspace}
            className="h-11 rounded-xl bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-white font-mono text-xs transition-colors border border-slate-800/80 active:scale-95 disabled:opacity-30"
          >
            DEL
          </button>
          <button
            type="button"
            disabled={isSuccess || pin.length >= 4}
            onClick={() => handleDigitInput("0")}
            className="h-11 rounded-xl bg-slate-900/70 hover:bg-slate-800 text-white font-mono font-semibold text-base transition-colors border border-slate-800/80 active:scale-95 disabled:opacity-50"
          >
            0
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-white font-mono text-xs transition-colors border border-slate-800/80 active:scale-95"
          >
            ESC
          </button>
        </div>
      </div>
    </div>
  );
}
