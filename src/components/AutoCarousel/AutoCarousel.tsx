import React, { useCallback, useEffect, useState } from "react";

const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>): void => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export interface ProjectImage {
  image_type: string;
  images_url: string;
}

interface AutoCarouselProps {
  sortedProjectImages: ProjectImage[];
}

const AutoCarousel: React.FC<AutoCarouselProps> = ({ sortedProjectImages }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % sortedProjectImages.length
      );
    }, 2000);
    return () => clearInterval(intervalId);
  }, [sortedProjectImages.length]);

  return (
    <div className="tw-w-full md:tw-h-full tw-h-60 tw-bg-black/50 tw-flex tw-overflow-hidden tw-relative">
      <div
        className="tw-w-full tw-h-full tw-flex tw-transition-transform tw-duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {sortedProjectImages.map((item: any, index: number) => (
          <Card key={index} image={item.images_url} />
        ))}
      </div>
      <div className="tw-absolute tw-bottom-[20px] tw-left-1/2 tw-transform tw--translate-x-1/2 tw-flex tw-gap-1">
        {sortedProjectImages.map((item: any, index: number) => (
          <Dots
            key={index}
            isActive={index === currentIndex}
            setCurrentIndex={setCurrentIndex}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

interface CardProps {
  image: string;
}


const Card: React.FC<CardProps> = ({ image }) => {
  return (
    <div className="tw-w-full tw-h-60 tw-flex tw-shrink-0 ">
      <img src={image} alt="" className="tw-block tw-w-full tw-h-full tw-object-cover tw-object-center" />
    </div>
  );
};

interface DotsProps {
  isActive: boolean;
  index: number;
  setCurrentIndex: (index: number) => void;
}

const Dots: React.FC<DotsProps> = ({ isActive, index, setCurrentIndex }) => {
  // Debounced function for setting current index
  const debouncedSetCurrentIndex = useCallback(
    debounce((index: number) => setCurrentIndex(index), 300),
    [setCurrentIndex]
  );

  return (
    <div
      onClick={() => debouncedSetCurrentIndex(index)}
      className={`${isActive ? "tw-bg-[#fff] tw-border-[#C0C4CE]" : "tw-bg-[#3C4049] tw-border-[#DFE1E7]"
        } tw-size-2 tw-border tw-rounded-[50%] tw-cursor-pointer tw-transition-all tw-duration-200`}
    ></div>
  );
};

export default AutoCarousel;
