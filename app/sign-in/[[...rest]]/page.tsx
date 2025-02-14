"use client";

import { SignIn, useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const storeUserToken = async () => {
      if (isSignedIn && user?.id) {
          router.push("/"); 
      }
    };

    storeUserToken();
  }, [isSignedIn]);

  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn path="/sign-in" />
    </div>
  );
}
