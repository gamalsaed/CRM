import LoginForm from "./_components/login-form";
import { Lock } from "lucide-react";
import Image from "next/image";

export default async function page() {
  return (
    <div className="flex justify-center h-full items-center">
      <div>
        <div className="flex items-center justify-center lg:hidden gap-2 mb-8">
          <Image src="/assets/logo.svg" width={40} height={40} alt="LOGO" />
          <h1 className="text-xl font-extrabold">G-CRM</h1>
        </div>
        <div className="w-11 h-11 mb-8 flex justify-center items-center rounded-2xl bg-primary-50 border border-primary-200">
          <Lock width={20} height={20} className="text-primary-500" />
        </div>
        <h1 className=" text-2xl font-semibold">Welcome back</h1>
        <p className="text-gray-400 mb-8">
          Sign in to continue to your workspace
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
