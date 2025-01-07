import React, { useEffect, useState } from 'react';
import "./CarParkingBookingPage.scss"
import BasementSelectedPopup from '@Components/basement-selected-popup/BasementSelectedPopup';
import { useAppDispatch, useAppSelector } from '@Src/app/hooks';
import { hideSpinner, showSpinner, triggerSaveAndExitEvent } from '@Src/features/global/globalSlice';
import ConfirmCarBookingPopup from '@Components/confirm-car-booking/ConfirmCarBookingPopup';
import { IAPIResponse } from '@Src/types/api-response-interface';
import { MODULES_API_MAP, httpService } from '@Src/services/httpService';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import { toast } from 'react-toastify';
import MobileTabs from '@Components/mobile-tabs/MobileTabs';
import MobileSlotsTab from '@Components/mobile-slots-tab/MobileSlotsTab';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useNavigate } from 'react-router-dom';

const CarParkingBookingPage = (props: {
    basementArray: any,
    onActiveTab: any,
    index: number,
    basement: any,
    unitId: any,
    optionId: any
}) => {
    const [isImgPopUp, setIsImgPopUp] = useState(false);
    const [selectedSlots, setSelectedSlots] = useState<any[]>([]);
    const [slotData, setSlotData] = useState<any[]>([]);
    const saveAndExitSelector: any = useAppSelector((state) => state.global.formSubmitAndExit);
    const dispatch = useAppDispatch();
    const [isConfirmBooking, setIsConfirmBooking] = useState<boolean>(false);
    const navigate = useNavigate()
    const handleSlots = (slot: any) => {
        let firstOptionCount: any = localStorage.getItem('firstOptionCount');
        let secondOptionCount: any = localStorage.getItem('secondOptionCount');
        // const slotIndex = selectedSlots.findIndex((selectedSlot: any) => selectedSlot.parking_id === slot.parking_id);
        // if (slotIndex === -1) {
        //     setSelectedSlots([...selectedSlots, slot]);
        // } else {
        //     const updatedSelectedSlots = [...selectedSlots];
        //     updatedSelectedSlots.splice(slotIndex, 1);
        //     setSelectedSlots(updatedSelectedSlots);
        // }


        let maxSelectedSlots: number = 0; // Maximum number of slots allowed to be selected

        if ((props?.index) === 0) {
            maxSelectedSlots = (parseInt(firstOptionCount)) + maxSelectedSlots;
        } else {
            maxSelectedSlots = (parseInt(secondOptionCount)) + maxSelectedSlots;
        }
        if (selectedSlots.length < maxSelectedSlots) {
            setSelectedSlots([...selectedSlots, slot]);
        } else {
            const updatedSelectedSlots = [...selectedSlots];
            updatedSelectedSlots.shift();
            updatedSelectedSlots.push(slot);
            setSelectedSlots(updatedSelectedSlots);
        }


    }
    ////console.log("slots", selectedSlots)
    const onSubmit = async () => {
        try {
            dispatch(showSpinner())
            const bookedSlots = selectedSlots.map(slot => ({
                parking_id: slot.parking_id,
            }));

            let reqobj = {
                option_id: +props?.optionId,
                parking_id: bookedSlots.map(slot => slot.parking_id),
                unit_id: +props?.unitId
            }
            let response: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.Book_CAR_PARKING}`).POST(reqobj);
            if (response.success) {
                const currentBasement = props.basement[0]?.basement;
                const currentBasementIndex = props.basementArray.findIndex((basement: any) => basement[0]?.basement === currentBasement);
                if (currentBasementIndex === props.basementArray.length - 1) {
                    props.onActiveTab('BasementSuccess');
                } else {
                    const nextBasement = props.basementArray[currentBasementIndex + 1][0]?.basement;
                    props.onActiveTab(nextBasement);
                }
                setIsConfirmBooking(false);
                toast?.success(response?.message);
                dispatch(hideSpinner())
            }
        } catch (err) {
            ////console.log(err);
            setIsConfirmBooking(false);
            toast.error('Something Went Wrong');
        }
        dispatch(hideSpinner())
    }

    useEffect(() => {
        let saveAndExitFlag = saveAndExitSelector?.payload;
        ////console.log("saveAndExitSelector", saveAndExitFlag);
        if (saveAndExitFlag) {
            setIsConfirmBooking(true);
            dispatch(() => { dispatch(triggerSaveAndExitEvent({ payload: false })) })
        }
    }, [saveAndExitSelector])



    return (
        <div className='car-parking-booking-page'>
            <div className='md:tw-hidden tw-block tw-py-4'>
                <div className='tw-flex tw-justify-between'>
                    <div className='tw-flex tw-items-center tw-gap-2'>
                        <div className='tw-font-bold text-pri-all' onClick={() => { navigate('/my-task') }}><ChevronLeftIcon /></div>
                        <div className='tw-font-bold text-pri-all'>Basement 1</div>
                    </div >
                    <div className='tw-flex tw-items-center tw-gap-2'>

                    </div>
                </div >
                <MobileSlotsTab index={1} />
            </div >
            <div className='right-section'>
                <div className="section-container lg:tw-p-4">
                    <p className='text-pri-all tw-text-2xl tw-font-bold'>{props?.basement[0]?.basement}</p>
                    <p className='text-pri-all tw-font-bold'>Select your parking slot for My Home Sayuk, Tower 3, 1307, {props?.basement[0]?.basement}</p>
                    <p className='fs14'>The parking slot grid provided below is for slot selection purposes only. Please review the parking floor plan to understand the actual layout before finalising your parking slot.</p>
                    <div className=''>
                        <p className='text-pri-all tw-font-semibold tw-my-4'>Floor Plan</p>
                        <div onClick={() => setIsImgPopUp(true)} className="img-section tw-cursor-pointer">
                            <img src={'/images/basement_floor.png'} alt="" />
                        </div>
                        <div className='tw-my-4 tw-flex tw-justify-end tw-gap-8'>
                            <div className='tw-flex tw-items-center tw-gap-2'>
                                <div className="green circle"></div>
                                <div className='fs14'>Available</div>
                            </div>
                            <div className='tw-flex tw-items-center tw-gap-2'>
                                <div className="red circle"></div>
                                <div className='fs14'>Booked</div>
                            </div>
                        </div>
                        <div className="section-container lg:tw-p-4">
                            <p className='text-pri-all tw-mb-4'>Allocated slot - {props?.index + 1}</p>
                            <div className='tw-flex tw-gap-2 tw-flex-wrap'>
                                {
                                    (props.basement || []).map((slot: any) => {
                                        const formatSlotId = (parking_number: number) => {
                                            if (parking_number < 10) {
                                                return `00${parking_number}`;
                                            } else if (parking_number < 100) {
                                                return `0${parking_number}`;
                                            } else {
                                                return `${parking_number}`;
                                            }
                                        };

                                        const isSelected = selectedSlots.some(selectedSlot => selectedSlot.parking_id === slot.parking_id);

                                        return (
                                            <button
                                                disabled={slot?.is_booked}
                                                key={slot?.parking_id}
                                                onClick={() => handleSlots(slot)}
                                                className={`slot-button ${slot.is_booked
                                                    ? 'red-slots color-red-white'
                                                    : isSelected
                                                        ? 'green-slots color-white-green'
                                                        : 'green-slots color-green-white'
                                                    }`}
                                            >
                                                {formatSlotId(slot?.parking_no)}
                                            </button>
                                        );
                                    })
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {
                isImgPopUp && <BasementSelectedPopup isImgPopUp={isImgPopUp} setIsImgPopUp={setIsImgPopUp} />
            }
            {
                isConfirmBooking && <ConfirmCarBookingPopup selectedSlots={selectedSlots} onSubmit={onSubmit} setIsConfirmBooking={setIsConfirmBooking} isConfirmBooking={isConfirmBooking} />
            }
        </div>
    );
};

export default CarParkingBookingPage;