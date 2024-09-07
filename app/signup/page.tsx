"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useUser } from "@/lib/UserContext";
import { useWalletConnected } from "@/lib/hooks/useWalletConnected";
import UsernameForm from "./UsernameForm";
import EmailForm from "./EmailForm";

export default function Signup() {
  const [step, setStep] = useState<"username" | "email">("username");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const { username, setUsername, email, setEmail } = useUser();
  const isConnectedAndAuthenticated = useWalletConnected();

  useEffect(() => {
    if (!isConnectedAndAuthenticated) {
      router.push("/");
    }
  }, [isConnectedAndAuthenticated, router]);

  const handleUsernameSubmit = (submittedUsername: string) => {
    setUsername(submittedUsername);
    setStep("email");
  };

  const handleEmailSubmit = async (submittedEmail: string) => {
    setIsLoading(true);
    try {
      setEmail(submittedEmail);
      if (!username || !address) {
        throw new Error("Username and wallet address are required");
      }
      const response = await fetch("/api/send-verification-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: submittedEmail,
          username: username,
          walletAddress: address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification email");
      }

      console.log("Verification email sent successfully");
      setEmailSent(true);
    } catch (error) {
      console.error("Error sending verification email:", error);
      // 这里可以添加一个用户友好的错误通知
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    router.push("/");
  };

  if (!isConnectedAndAuthenticated) return null;

  const getStepTitle = () => {
    switch (step) {
      case "username":
        return "Choose Your Username";
      case "email":
        return emailSent ? "Email Sent" : "Enter Your Email";
      default:
        return "Sign Up";
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-6 pt-12 sm:p-12 sm:pt-24 bg-light-bg dark:bg-gray-900 text-black dark:text-white theme-transition">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8">{getStepTitle()}</h1>

      <div className="w-full max-w-xs">
        {step === "username" ? (
          <UsernameForm onSubmit={handleUsernameSubmit} />
        ) : emailSent ? (
          <div className="text-center">
            <p className="mb-4">
              We've successfully sent you an email. Please be patient and check
              your email for confirmation to login or register.
            </p>
            <p className="text-sm text-gray-500">
              If you don't see the email, please check your spam folder.
            </p>
          </div>
        ) : (
          <EmailForm onSubmit={handleEmailSubmit} isLoading={isLoading} />
        )}
      </div>

      {!emailSent && (
        <div className="flex w-full max-w-xs mt-4 space-x-4">
          {step === "email" && (
            <button
              onClick={() => setStep("username")}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors theme-transition"
              disabled={isLoading}
            >
              Back
            </button>
          )}
          <button
            onClick={handleDisconnect}
            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors theme-transition"
            disabled={isLoading}
          >
            Disconnect
          </button>
        </div>
      )}

      <div className="mt-8">
        <ConnectButton />
      </div>
    </div>
  );
}
