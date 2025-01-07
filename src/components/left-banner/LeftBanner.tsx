import React, { useEffect, useState } from 'react';
import Carousel from 'better-react-carousel';
import { getConfigData } from '@Src/config/config';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import { IAPIResponse } from '@Src/types/api-response-interface';
import { httpService, MODULES_API_MAP } from '@Src/services/httpService';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import { useAppDispatch } from '@Src/app/hooks';
import "./LeftBanner.scss";

const DotStylingComponent: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <span className="dot-style tw-mb-80"
        style={{
            backgroundColor: isActive ? '#FF0006' : '#F9FAFA',
            opacity: isActive ? 1 : 0.5,
            transition: 'all 0.3s ease-in-out',
            height: isActive ? '8px' : '5px',
            width: isActive ? '8px' : '5px',
            borderRadius: '50%',
            cursor: 'pointer',
        }}
    ></span>
)

const LeftBanner = () => {
    const [marketingImages, setMarketingImages] = useState<any>();
    const dispatch = useAppDispatch();
    const getMarketingImages = async () => {
        try {
            dispatch(showSpinner());
            const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, GLOBAL_API_ROUTES.GET_MARKETING_IMAGES).GET();
            if (apiResponse?.success) {
                setMarketingImages(apiResponse?.data);
            }
        } catch (error) {

        }
        finally {
            dispatch(hideSpinner());
        }

    }

    useEffect(() => {
        getMarketingImages();
    }, []);

    return (
        <div className='left-section md:tw-w-full tw-hidden md:tw-flex tw-flex-col tw-items-center'>
            <Carousel
                cols={1} rows={1} gap={0}
                hideArrow loop={true}
                dot={DotStylingComponent}
                showDots={true}
                autoplay={4000}
            >
                {marketingImages?.map((data: any, index: any) => (
                    <Carousel.Item key={index}>
                        <div className='tw-relative tw-w-full tw-h-screen'>
                            <div className="tw-absolute tw-inset-0 tw-bg-black tw-opacity-50"></div>
                            <img src={data?.images_url} alt='' className='tw-h-full tw-w-full' />
                            <div className='tw-absolute tw-inset-0 tw-flex tw-flex-col tw-justify-center tw-items-center tw-text-center'>
                                <p className='carousel-text'>{data?.title}</p>
                                <p className='carousel-price tw-mt-4'>{data?.description}</p>
                                <a href={data?.navigation_link} target="_blank" className='lnm tw-mt-4 tw-w-36 tw-mx-auto' rel="noreferrer">Learn more</a>
                            </div>
                        </div>
                    </Carousel.Item>
                ))}

            </Carousel>
        </div>
    );
}

export default LeftBanner;
