import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import AdvBox from "./adv-box";
import { Users, TrendingUp, Shield } from "lucide-react";

export default function AdvSide() {
  return (
    <div className="flex-1 p-14 text-white bg-[#141414] max-lg:hidden justify-center items-center">
      <div className="flex items-center gap-2 mb-8">
        <Image src="/assets/logo.svg" width={40} height={40} alt="LOGO" />
        <h1 className="text-xl">G-CRM</h1>
      </div>
      <Badge
        variant="outline"
        className="rounded-full animate-pulse border-primary-400 text-primary-400 bg-primary-600/25 uppercase p-4 px-4 mb-8"
      >
        <p className="h-2 w-2 bg-primary-400 animate-pulse  rounded-full mr-1"></p>
        <p className=" tracking-[3px]">Trusted by teams worldwide</p>
      </Badge>
      <h1 className="text-5xl font-bold leading-[1.2] mb-8">
        <p>Run your business</p>
        <p className="text-primary-400">without limits.</p>
      </h1>
      <p className="text-gray-400 ">Manage everything in one place</p>
      <div className="flex gap-4 my-10">
        <AdvBox Icon={Users} description="Active users">
          12K+
        </AdvBox>
        <AdvBox Icon={TrendingUp} description="Satisfaction">
          98%
        </AdvBox>
        <AdvBox Icon={Shield} description="Uptime SLA">
          99.9%
        </AdvBox>
      </div>
      <div className="p-4 bg-[#222222] w-full flex gap-4 rounded-2xl border-gray-200">
        <p className="bg-primary-500 rounded-full font-extrabold w-10 h-10 flex justify-center items-center">
          V
        </p>
        <div>
          <h1 className="text-gray-300 mb-1">
            "VeltroxCRM replaced three tools for us. Our team onboarded in a day
            and we closed 40% more deals in the first month."
          </h1>
          <p className="text-[12px] text-gray-400">
            Arjun M. - Operations Head
          </p>
        </div>
      </div>
      <p className="text-gray-400 mt-8">© 2026 VeltroxCRM</p>
    </div>
  );
}
