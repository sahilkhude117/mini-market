import React, { useState, useRef, useEffect } from "react";
import Icon from "./Icons";
import { IconName } from "./Icons/Icons";
import SearchInputItem from "./marketInfo/SearchInputItem";

const searchInputs = [
  { title: "Volume", minPlaceholder: "Min", maxPlaceholder: "Max" },
  { title: "Expiry Time", minPlaceholder: "Start", maxPlaceholder: "End" },
  { title: "Yes Probability", minPlaceholder: "Min", maxPlaceholder: "Max" },
  { title: "No Probability", minPlaceholder: "Min", maxPlaceholder: "Max" },
];

type Category = {
  name: string;
  active: boolean;
  icon: IconName;
  color: string;
};

type NavbarProps = {
  categories: Category[];
  onCategorySelect: (category: string) => void;
};

const Navbar: React.FC<NavbarProps> = ({ 
  categories, 
  onCategorySelect
}) => {
  // Keep track of the selected category using state
  const [activeCategory, setActiveCategory] = useState<string>("Trending");
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const searchPadRef = useRef<HTMLDivElement | null>(null);

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    onCategorySelect(category);
  };

  const handleFilterClick = () => {
    setShowFilter((prevState) => !prevState);
  };

  // Close the search input pad if clicked outside
  const handleClickOutside = (e: MouseEvent) => {
    if (
      filterRef.current &&
      !filterRef.current.contains(e.target as Node) &&
      searchPadRef.current &&
      !searchPadRef.current.contains(e.target as Node)
    ) {
      setShowFilter(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full flex items-center justify-between py-4 px-6 bg-white rounded-xl border-2 border-gray-200 relative">
      <div className="flex items-center gap-3 md:gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategorySelect(category.name)}
            className={`sm:px-3 px-2 py-1.5 rounded-lg cursor-pointer inline-flex justify-start items-center gap-1 transition-all duration-300 ease-in-out ${activeCategory === category.name ? "border-b-4 border-[#0b1f3a] text-[#0b1f3a] font-extrabold" : "text-[#838587] opacity-70 hover:opacity-100"}`}
          >
            <div className="w-5 h-5 relative overflow-hidden">
              <Icon
                name={category.icon}
                color={activeCategory === category.name ? "#0b1f3a" : "#838587"}
                className={`transition-all duration-300 ease-in-out`}
              />
            </div>
            <div className={`justify-start md:text-base text-sm font-extrabold leading-7 ${activeCategory === category.name ? "" : "hidden md:flex"}`}>
              {category.name}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div
          data-active={showFilter ? "On" : "Off"}
          ref={filterRef}
          className="sm:px-4 sm:py-2.5 px-2.5 py-1 bg-gray-100 border-2 border-gray-200 rounded-2xl cursor-pointer flex justify-start items-center gap-2 transition-all duration-300 ease-in-out hover:bg-gray-200 hover:shadow-md active:scale-95"
          onClick={handleFilterClick}
        >
          <div className="w-4 h-4 relative overflow-hidden">
            <Icon name="Filter" color="#0b1f3a" />
          </div>
          <div className="justify-start hidden lg:flex text-[#0b1f3a] text-base font-medium font-satoshi leading-normal transition-all duration-300">
            Filter
          </div>
        </div>
      </div>

      {showFilter && (
        <div
          ref={searchPadRef}
          className="z-1 p-5 right-[0px] top-[70px] absolute bg-white border-2 border-gray-200 rounded-[20px] shadow-[0px_12px_24px_0px_rgba(0,0,0,0.15)] inline-flex flex-col justify-start items-center gap-4"
        >
          {searchInputs.map((input, index) => (
            <SearchInputItem
              key={index}
              title={input.title}
              minPlaceholder={input.minPlaceholder}
              maxPlaceholder={input.maxPlaceholder}
            />
          ))}
          <div className="self-stretch inline-flex justify-start items-start gap-2">
            <div
              className="flex-1 px-4 cursor-pointer py-2.5 rounded-[100px] border-2 border-[#838587] flex justify-center items-center gap-1 transition-all duration-300 hover:bg-gray-100 hover:shadow-md active:scale-95"
            >
              <div
                className="justify-center text-[#838587] text-sm font-medium font-satoshi leading-[14px] transition-all duration-300"
              >
                Reset
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;