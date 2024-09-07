"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
// import { SessionProvider } from "next-auth/react";

import { config } from "../lib/wagmi";

import {
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
  AuthenticationStatus,
} from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";

const queryClient = new QueryClient();

export function Providers({
  // session,
  children,
}: {
  children: React.ReactNode;
  // session: Session | null;
}) {
  // const [authenticationStatus, setAuthenticationStatus] =
  //   useState<AuthenticationStatus>("unauthenticated");
  const { setAuthenticationStatus, authenticationStatus } = useAuth();

  // You'll need to resolve AUTHENTICATION_STATUS here
  // using your application's authentication system.
  // It needs to be either 'loading' (during initial load),
  // 'unauthenticated' or 'authenticated'.

  const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
      const response = await fetch("/api/nonce");
      return await response.text();
    },
    createMessage: ({ nonce, address, chainId }) => {
      return new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });
    },
    getMessageBody: ({ message }) => {
      return message.prepareMessage();
    },
    verify: async ({ message, signature }) => {
      setAuthenticationStatus("loading");
      const verifyRes = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, signature }),
      });
      setAuthenticationStatus(
        verifyRes.ok ? "authenticated" : "unauthenticated"
      );

      return Boolean(verifyRes.ok);
    },
    signOut: async () => {
      await fetch("/api/logout");
      setAuthenticationStatus("unauthenticated");
    },
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* <SessionProvider refetchInterval={0}> */}
        <QueryClientProvider client={queryClient}>
          <RainbowKitAuthenticationProvider
            adapter={authenticationAdapter}
            status={authenticationStatus}
          >
            <RainbowKitProvider>{children}</RainbowKitProvider>
          </RainbowKitAuthenticationProvider>
        </QueryClientProvider>
        {/* </SessionProvider> */}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
