import React from 'react';
import Icon from '../Icons';

interface RecentItemProps {
  question: string;
  timeAgo: string;
  userName: string;
  action: string;
  price: string;
  imageSrc: string;
  status: 'yes' | 'no' | 'funded';
}

const RecentItem: React.FC<RecentItemProps> = ({ question, timeAgo, userName, action, price, imageSrc, status }) => {
  let statusStyles = '';
  let statusText = '';

  if (status === 'yes') {
    statusStyles = 'bg-white border-2 border-[#3fd145] text-[#3fd145]';
    statusText = 'Yes';
  } else if (status === 'no') {
    statusStyles = 'bg-white border-2 border-[#ff6464] text-[#ff6464]';
    statusText = 'No';
  } else {
    statusStyles = 'bg-white border-2 border-[#0b1f3a] text-[#0b1f3a]';
    statusText = 'Funded';
  }

  return (
    <div data-type="Vote" className="self-stretch sm:h-20 p-4 bg-white rounded-2xl border-2 border-gray-200 inline-flex justify-start items-center gap-4">
      <div className="flex-1 inline-flex flex-col justify-center items-start gap-1">
        <div className="self-stretch inline-flex justify-start items-center gap-1.5">
          <div className="justify-start text-[#838587] md:text-sm font-medium font-rubik leading-normal">{question}</div>
          <div className="justify-start text-[#838587] md:text-sm font-medium font-rubik leading-[18px]">- {timeAgo} ago</div>
        </div>
        <div className="self-stretch inline-flex justify-start items-center gap-1">
          <img className="w-4 h-4 rounded-[10px]" src={imageSrc} alt="user" />
          <div className="justify-start">
            <span className="text-[#0b1f3a] text-sm font-semibold font-interSemi underline leading-[18px]">{userName}</span>
            <span className="text-[#0b1f3a] text-sm font-semibold font-interSemi leading-[18px]"> {action} </span>
          </div>
          <div className={`p-1 ${statusStyles} rounded-lg flex justify-center items-center gap-0.5`}>
            {status !== 'funded' ? (
              <div className="w-3 h-3 relative overflow-hidden">
                <Icon name={status} size={12} />
              </div>
            ): ""}
            <div className="justify-start text-xs font-bold font-satoshi leading-3">
              {statusText}
            </div>
          </div>
          <div className="justify-start text-[#0b1f3a] text-sm font-semibold font-interSemi leading-[18px]">
           for {price}
          </div>
        </div>
      </div>
      <img className="w-10 h-10 rounded-lg border-2 border-gray-200" src="https://placehold.co/40x40" alt="item" />
    </div>
  );
};

export default RecentItem;
