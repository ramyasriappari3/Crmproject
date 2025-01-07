import { useAppDispatch } from "@Src/app/hooks";
import {getConfigData} from "@Src/config/config";
import { hideSpinner, showSpinner } from "@Src/features/global/globalSlice";
import { GLOBAL_API_ROUTES } from "@Src/services/globalApiRoutes";
import { httpService, MODULES_API_MAP } from "@Src/services/httpService";
import { IAPIResponse } from "@Src/types/api-response-interface";
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

interface MyCarouselProps {
  projectId: string;
}

export interface ProjectImage {
  image_type: string;
  images_url: string;
}

const MyCarousel: React.FC<MyCarouselProps> = ({ projectId }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [advertisementData, setAdvertisementData] = useState<any>([]);
  const dispatch = useAppDispatch();
  const getAllAdvertisement = async () => {
    if (!projectId) {
      return;
    }
    try {
      dispatch(showSpinner());
      const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.GET_ADVERTISEMENTS}?project_id=${projectId}`).GET();
      if (apiResponse?.success) {
        setAdvertisementData(apiResponse?.data);
      }
    } catch (error) {
      //console.log(error)
    }
    finally {
      dispatch(hideSpinner());
    }
    // try {
    //   dispatch(showSpinner());
    //   const advertisementData = await getConfigData(
    //     "dashboard_marketing_card_info"
    //   );
    //   if (advertisementData.length > 0) {
    //     setAdvertisementData(advertisementData);
    //   }
    // } catch (err) {
    //   dispatch(hideSpinner());
    // }
    // dispatch(hideSpinner());
  };

  useEffect(() => {
    getAllAdvertisement();
  }, [projectId]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % advertisementData.length
      );
    }, 2000);
    return () => clearInterval(intervalId);
  }, [advertisementData.length]);

  return (
    <div className="tw-w-full tw-h-full tw-overflow-hidden tw-relative">
      <div
        className="tw-w-full tw-h-full tw-transition-transform tw-duration-500 "
        style={{ transform: `translateY(-${currentIndex * 100}%)` }}
      >
        {advertisementData?.map((item: any, index: number) => (
          <Card
            key={index}
            project_img_url={item?.images_url}
            project_title={item?.title}
            project_description={item?.description}
            project_learn_more={item?.navigation_link}
          />
        ))}
      </div>
      <div className="tw-absolute tw-bottom-[30px] tw-left-[30px] tw-transform tw-flex tw-gap-2 tw-items-center">
        {advertisementData.map((item: any, index: number) => (
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
  project_img_url: string;
  project_title: string;
  project_description: string;
  project_learn_more: string;
}

const Card: React.FC<CardProps> = ({
  project_img_url,
  project_title,
  project_description,
  project_learn_more,
}) => {
  return (
    <div className="tw-relative tw-w-full tw-h-full tw-flex-shrink-0 tw-flex tw-p-6 tw-justify-start">
      <img
        className="tw-absolute tw-h-full tw-top-0 tw-left-0 tw-object-cover tw-object-top"
        width={"100%"}
        height={"100%"}
        src={project_img_url}
        alt='Project Images'
      />
      <div className="tw-absolute tw-left-0 tw-top-0 tw-w-full tw-h-full tw-bg-black/30 tw-z-10"></div>
      <div className="tw-flex tw-flex-col tw-justify-end tw-gap-3 tw-h-full tw-z-20">
        <p className="tw-text-white tw-font-bold">{project_title}</p>
        <p className="tw-text-white/90 tw-font-thin">{project_description}</p>
        <a
          href={project_learn_more}
          className="tw-text-white tw-border-2 tw-border-white tw-text-xs tw-px-3 tw-py-1 tw-font-semibold tw-rounded-md tw-w-fit"
          target="_blank"
          rel="noreferrer noopener"
        >
          Learn more
        </a>
      </div>
    </div>
  );
};

interface DotsProps {
  isActive: boolean;
  index: number;
  setCurrentIndex: (index: number) => void;
}

const Dots: React.FC<DotsProps> = ({ isActive, index, setCurrentIndex }) => {
  const debouncedSetCurrentIndex = useCallback(
    debounce((index: number) => setCurrentIndex(index), 300),
    [setCurrentIndex]
  );

  return (
    <div
      onClick={() => debouncedSetCurrentIndex(index)}
      className={`${isActive ? "tw-bg-[#F2F2F2]" : "tw-bg-[#F2F2F2] tw-opacity-25"} tw-size-2 tw-rounded-[50%] tw-cursor-pointer tw-transition-all tw-duration-200`}
    ></div>
  );
};

export default MyCarousel;
