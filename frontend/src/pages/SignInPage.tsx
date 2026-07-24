import { SigninForm } from "@/components/auth/signin-form";
import React from "react";

const SignInPage = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl ">
        <SigninForm />
      </div>
    </div>
  );
};

export default SignInPage;
