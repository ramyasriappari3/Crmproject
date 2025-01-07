import React, { useEffect, useState } from 'react';
import './LearnMorePropertyCard.scss';
import { MODULES_API_MAP, httpService } from '@Src/services/httpService';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import { IAPIResponse } from '@Src/types/api-response-interface';
import { useAppDispatch } from '@Src/app/hooks';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import Carousel from 'better-react-carousel';
import {getConfigData} from '@Src/config/config';

// Define a type for advertisement data
interface Advertisement {
    images: string;
    description: string;
    price: number;
}


const DotStylingComponent: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <span className="dot-style"
        style={{
            display: 'inline-block',
            backgroundColor: isActive ? '#fff' : '#f2f2f2',
            opacity: isActive ? 1 : 0.5,
            transition: 'all 0.3s ease-in-out',
            height: isActive ? '8px' : '5px',
            width: isActive ? '8px' : '5px',
            borderRadius: '50%',
            cursor: 'pointer',
        }}
    ></span>
)


const LearnMorePropertyCard = () => {
    const [currentImg, setCurrentImg] = useState<number>(0);
    const [activeButton, setActiveButton] = useState<number>(0);
    const [advertisementData, setAdvertisementData] = useState<any>([]);
    const dispatch = useAppDispatch();

    const getAllAdvertisement = async () => {
        try {
            dispatch(showSpinner());
            const advertisementData = await getConfigData('dashboard_marketing_card_info');
            if (advertisementData.length > 0) {
                setAdvertisementData(advertisementData);
            }
        } catch (err) {
            dispatch(hideSpinner());
        }
        dispatch(hideSpinner());

    };

    useEffect(() => {
        getAllAdvertisement();
    }, []);

    return (
        <div className='learn-more-cont'>
            <div className='image-overlay'>
                <Carousel
                    cols={1} rows={1} gap={0}
                    hideArrow loop={true}
                    dot={DotStylingComponent}
                    showDots={true}
                    autoplay={4000}
                    containerClassName='ads-carousel tw-size-full tw-border tw-rounded-md tw-overflow-hidden'
                >
                    {advertisementData.map((data: any, index: any) => (
                        <Carousel.Item key={index} className='carousel-item'>
                            <div>
                                <img src={data?.project_img_url} alt='' className='tw-w-full !tw-h-60 !tw-object-fill' />
                                <div className='carousel-text-content tw-flex tw-flex-col tw-justify-start tw-ml-4'>
                                    <p className='carousel-text text-white'>{data?.project_title}</p>
                                    <p className='carousel-price mt-4 text-white'>{data?.project_description}</p>
                                    <button className='tw-mt-2 tw-py-2 tw-px-4 tw-mb-4 tw-w-fit tw-border tw-rounded-md'>
                                        <a href={data?.project_learn_more} target="_blank" rel="noreferrer">Learn more</a>
                                    </button>
                                </div>
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>

            </div>
        </div>
    );
};

export default LearnMorePropertyCard;
