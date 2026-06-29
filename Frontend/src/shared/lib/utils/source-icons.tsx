import { Building2 } from "lucide-react";
import type { LeadType } from "../types/app-data.t";

import { FaFacebook, FaSnapchatSquare } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { AiFillTikTok } from "react-icons/ai";
import { LiaUserFriendsSolid } from "react-icons/lia";

export function SourceIcon({ source }: { source: LeadType["source"] }) {
  switch (source) {
    case "facebook":
      return <FaFacebook className="h-7 w-7" color="#1877F2" />;

    case "instagram":
      return <RiInstagramFill className="h-7 w-7" color="#E4405F" />;

    case "tik tok":
      return <AiFillTikTok className="h-7 w-7" color="#000000" />;

    case "snapchat":
      return <FaSnapchatSquare className="h-7 w-7" color="#FFFC00" />;

    case "recommended":
      return <LiaUserFriendsSolid className="h-7 w-7" color="#2563EB" />;
    default:
      return <Building2 className=" text-gray-400" />;
  }
}
