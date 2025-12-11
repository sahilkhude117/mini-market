import { marketCarouselItems } from "@/data/data";
import MarketCarouselItem from "./MarketCarouselItem";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const MarketCarousel = () => {
  return (
    <div className="w-full max-w-full relative">
      <Carousel
        additionalTransfrom={0}
        arrows={true}
        autoPlaySpeed={3000}
        centerMode={false}
        className=""
        containerClass="container-with-dots"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite={true}
        itemClass="px-2"
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={true}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={{
          desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
            slidesToSlide: 1,
            partialVisibilityGutter: 0
          },
          tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            slidesToSlide: 1,
            partialVisibilityGutter: 0
          },
          mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1,
            partialVisibilityGutter: 0
          }
        }}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={false}
        sliderClass=""
        slidesToSlide={1}
        swipeable
        partialVisible={false}
      >
        {marketCarouselItems.map((item, index) => (
          <MarketCarouselItem key={index} {...item} />
        ))}
      </Carousel>
    </div>
  );
};

export default MarketCarousel;
