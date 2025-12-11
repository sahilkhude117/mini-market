import { MarketCarouselItemProps } from "@/types/type";
import { FaRegClock, FaRegStar } from "react-icons/fa6";

const MarketCarouselItem: React.FC<MarketCarouselItemProps> = ({
  category,
  title,
  bgImage,
  mainImage,
  overlayImage,
  volume,
  timeLeft,
  yesPercentage,
  comments,
}) => {
  return (
    <div className="block group p-[3px] rounded-2xl bg-gradient-to-r from-[#0b1f3a] via-[#174a8c] to-[#6b5b95] transition-all duration-300 cursor-pointer">
      <div className="h-full bg-white rounded-[calc(1rem-3px)] border-4 border-black p-4 md:p-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md flex flex-col min-h-[200px]">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 overflow-hidden">
            <img
              src={mainImage}
              alt="Market logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1 border-2 border-black bg-white rounded-full px-2 py-0.5 text-xs font-bold text-[#0b1f3a] mb-2">
              {category}
            </div>
            <h3 className="text-lg md:text-xl font-extrabold leading-tight text-[#0b1f3a] break-words line-clamp-2">
              {title}
            </h3>
          </div>
        </div>

        <div className="mt-4 flex-1 flex flex-col justify-between">
          {/* Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <FaRegStar className="text-[#0b1f3a] text-sm" />
              <span className="text-[#0b1f3a] text-sm font-bold">
                {volume}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaRegClock className="text-[#0b1f3a] text-sm" />
              <span className="text-[#0b1f3a] text-sm font-bold">
                {timeLeft}
              </span>
            </div>
          </div>

          {/* Probability Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#0b1f3a] text-sm font-bold">Yes {yesPercentage}%</span>
              <span className="text-[#0b1f3a] text-sm font-bold">No {100 - yesPercentage}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border-2 border-black">
              <div
                className="h-full bg-gradient-to-r from-[#0b1f3a] to-[#174a8c] transition-all duration-300"
                style={{ width: `${yesPercentage}%` }}
              />
            </div>
          </div>

          {/* Comments Badge */}
          <div className="mt-3 flex gap-2">
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

export default MarketCarouselItem;
