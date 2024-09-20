"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { Session } from "next-auth";

export const Providers = ({ children, session }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};
