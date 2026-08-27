"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      {/* <ChatProvider> */}
      <div className="flex flex-col gap-10">
        <Navbar />
        <div className="flex flex-col items-center justify-items-center min-h-screen p-4 gap-16">
          {children}
        </div>
        <Footer />
      </div>
      {/* </ChatProvider> */}
    </SessionProvider>
  );
};

export default Layout;
