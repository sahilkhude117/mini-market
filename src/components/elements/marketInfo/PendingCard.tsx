"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { GiAlarmClock } from "react-icons/gi";
import { useRouter } from "next/navigation";
import { getCountDown } from "@/utils";

// Define types for the props
interface PendingCardProps {
  category: string;
  question: string;
  volume: number;
  timeLeft: string;
  comments: number;
  imageUrl: string;
  index: number;
}

const PendingCard: React.FC<PendingCardProps> = ({
  index,
  category,
  question,
  comments,
  imageUrl,
  volume,
  timeLeft,
}) => {
  const router = useRouter();
  const [counter, setCounter] = useState("7d : 6h : 21m : 46s");

  useEffect(() => {
    const interval = setInterval(() => {
      let remainTime = getCountDown(timeLeft)
      setCounter(remainTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDetailClick = (index: number) => {
    const formattedQuestion = encodeURIComponent(question);
    router.push(`/fund/${index}`);
  };

  return (
    <div 
      onClick={() => handleDetailClick(index)}
      className="block group p-[3px] rounded-2xl bg-gradient-to-r from-[#0b1f3a] via-[#174a8c] to-[#6b5b95] transition-all duration-300 cursor-pointer"
    >
      <div className="h-full bg-white rounded-[calc(1rem-3px)] border-4 border-black p-4 md:p-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md flex flex-col min-h-[240px]"
    >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 overflow-hidden rounded-lg border-2 border-black">
            <img
              src={imageUrl}
              alt="Market logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1 border-2 border-black bg-white rounded-full px-2 py-0.5 text-xs font-bold text-[#0b1f3a] mb-2">
              {category}
            </div>
            <h3 className="text-lg md:text-xl font-extrabold leading-tight text-[#0b1f3a] break-words line-clamp-2">
              {question}
            </h3>
          </div>
        </div>

        <div className="mt-4 flex-1 flex flex-col justify-between">
          {/* Stats */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex flex-col gap-1">
              <span className="text-[#0b1f3a] text-xs font-bold opacity-70">Liquidity</span>
              <span className="text-[#0b1f3a] text-sm font-bold">{volume.toFixed(2)} / 30 SOL</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[#0b1f3a] text-xs font-bold opacity-70">Time Left</span>
              <div className="text-[#0b1f3a] text-sm font-bold flex items-center gap-1">
                <GiAlarmClock className="text-[#0b1f3a]" />
                {counter}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#0b1f3a] text-sm font-bold">Progress</span>
              <span className="text-[#0b1f3a] text-sm font-bold">{Math.min(100, Math.floor((volume / 30) * 100))}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border-2 border-black">
              <div
                className="h-full bg-gradient-to-r from-[#0b1f3a] to-[#174a8c] transition-all duration-300"
                style={{ width: `${Math.min(100, (volume / 30) * 100)}%` }}
              />
            </div>
          </div>

          {/* Comments Badge */}
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1 border-2 border-black bg-white rounded-full px-2 py-0.5 text-xs font-bold text-[#0b1f3a]">
              <span>💬</span>
              <span>{comments} comments</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingCard;
