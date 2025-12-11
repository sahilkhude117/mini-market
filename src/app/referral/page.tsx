"use client";

import ReferralItem from "@/components/elements/referral/ReferralItem";
import { LuCopy } from "react-icons/lu";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaUserFriends, FaCoins } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSearchParams } from "next/navigation";
import { url } from "@/data/data";
import { errorAlert } from "@/components/elements/ToastGroup";
import { ReferralType } from "@/types/type";

const referrals = [
  {
    referralCode: "asdjncinj6543Dhj5C49iumxcmvbnxc97",
    timeAgo: "2m ago",
    amount: "0.08",
    status: "active" as const,
    user: "referral"
  },
  {
    referralCode: "98bhvDjk34Nmcx49UJHJdsfncA9076",
    timeAgo: "5m ago",
    amount: "0.12",
    status: "active" as const,
    user: "referral"
  },
];

export default function Referral() {
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferral] = useState("");
  const [updating, setUpdating] = useState(true);
  const [referral, setReferrals] = useState<ReferralType[] | null>([]);
  const { publicKey } = useWallet();

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success("Referral link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setUpdating(true);

    const ref = new URLSearchParams(window.location.search).get("ref");
    if (!publicKey) {
      errorAlert("Please connect wallet!");
      return
    }
    (async() =>{
      const res = await axios.post(url + "api/referral/", {
        wallet: publicKey.toBase58(),
        referralCode: ref? ref : ""
      });
      setReferral(`http://localhost:3000/referral?ref=${res.data.code}`);
      console.log("res.data.code.referrals", res.data.referrals);
      
      setReferrals(res.data.referrals);
      setUpdating(false);
    })();
  }, [publicKey]); 

  // const totalEarnings = referrals.reduce((sum, ref) => sum + parseFloat(ref.amount), 0);
  const activeReferrals = referral?.filter(ref => ref.status === "ACTIVE").length;

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 py-12 flex flex-col gap-8">
      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-white rounded-xl border-4 border-black shadow-lg"
        >
          <div className="flex items-center gap-3 mb-2">
            <FaUserFriends className="text-[#0b1f3a] text-xl" />
            <h3 className="text-[#0b1f3a] text-lg font-bold">Active Referrals</h3>
          </div>
          <p className="text-[#0b1f3a] text-2xl font-extrabold">{referral?.length}</p>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-white rounded-xl border-4 border-black shadow-lg"
        >
          <div className="flex items-center gap-3 mb-2">
            <FaCoins className="text-[#0b1f3a] text-xl" />
            <h3 className="text-[#0b1f3a] text-lg font-bold">Total Earnings</h3>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-[#0b1f3a] text-2xl font-extrabold"></p>
            <span className="text-[#0b1f3a] text-2xl font-extrabold">{referral?.reduce((sum, i) => sum + i.fee, 0)} SOL</span>
          </div>
        </motion.div>
      </div>

      {/* Referral Link Section */}
      <div className="flex flex-col gap-3">
        <h2 className="text-[#0b1f3a] text-2xl font-extrabold font-rubik">
          Your Personal Referral Link
        </h2>
        <div className="h-[60px] p-2 bg-white rounded-xl border-4 border-black flex items-center gap-3 shadow-lg">
          <div className="flex-1 px-6 py-3 rounded-lg">
            <div className="text-[#0b1f3a] text-xl font-medium font-satothi">
              {updating?"Updating..." : referralCode}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="px-4 py-3 bg-white rounded-xl cursor-pointer border-2 border-black flex items-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <LuCopy className="text-[#0b1f3a] w-4 h-4" />
            <span className="text-[#0b1f3a] text-base font-bold font-satothi">
              {copied ? "Copied!" : "Copy"}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Activity Section */}
      <div className="flex flex-col gap-3">
        <h2 className="text-[#0b1f3a] text-2xl font-extrabold font-rubik">
          Activity
        </h2>
        <div className="flex flex-col gap-4">
          {referral?.map((refer, index) => (
            <motion.div
              key={index.toString() + refer.referralCode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ReferralItem {...refer} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
