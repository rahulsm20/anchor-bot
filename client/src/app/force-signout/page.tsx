"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ForceSignout = () => {
  const router = useRouter();

  const performSignOut = async () => {
    await signOut({ redirect: false });
    localStorage.setItem("loggedOut", "true");
    router.replace("/?loggedOut=true");
  };

  useEffect(() => {
    const loggedOut = localStorage.getItem("loggedOut");
    if (loggedOut === "true") {
      router.replace("/?loggedOut=true");
      return;
    } else {
      performSignOut();
    }
  }, []);

  return <div>{`Your session has timed out. You've been logged out.`}</div>;
};

export default ForceSignout;
