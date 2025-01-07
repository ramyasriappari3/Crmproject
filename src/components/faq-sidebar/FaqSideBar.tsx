import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import "./FaqSideBar.scss";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAppDispatch } from '@Src/app/hooks';
import { IAPIResponse } from '@Src/types/api-response-interface';
import { MODULES_API_MAP, httpService } from '@Src/services/httpService';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import CloseIcon from '@mui/icons-material/Close';
import { Slide, Skeleton } from '@mui/material';

const FaqSideBar = (props: { setIsFaqSidebar: any, isFaqSidebar: boolean }) => {
    const [accordionData, setAccordionData] = useState<any[]>([]);
    const [isClosing, setIsClosing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        fetchFAQs();
        const handlePopState = () => handleClose();
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const fetchFAQs = async () => {
        try {
            const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, GLOBAL_API_ROUTES.HomepageFaqs).GET();
            if (apiResponse?.success) {
                setAccordionData(apiResponse?.data?.data?.resultData);
            }
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            props.setIsFaqSidebar(false);
            setIsClosing(false);
        }, 500);
    };

    const renderSkeletonUI = () => (
        <>
            {[...Array(10)].map((_, index) => (
                <Accordion key={index} className='tw-mb-1 tw-p-1'>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Skeleton width="80%" height={20} />
                    </AccordionSummary>
                    <AccordionDetails>
                        <Skeleton width="100%" height={60} />
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    );

    return ReactDOM.createPortal(
        <div onClick={handleClose} className={`${props.isFaqSidebar ? 'modal' : 'tw-hidden'}`}>
            <Slide direction="left" in={props.isFaqSidebar && !isClosing} timeout={{ enter: 300, exit: 500 }} mountOnEnter unmountOnExit easing="ease-in-out">
                <div onClick={(e) => e.stopPropagation()} className='modal-content tw-p-4 md:tw-pl-4 tw-pl-8'>
                    <div className='tw-flex tw-gap-4 tw-items-center tw-justify-between'>
                        <div className='text-pri-all tw-font-bold tw-text-lg'>Frequently Asked Questions</div>
                        <p className='tw-cursor-pointer' onClick={handleClose}><CloseIcon sx={{ color: '#000000' }} /></p>
                    </div>
                    {isLoading ? renderSkeletonUI() : (
                        accordionData.map((data: any) => (
                            <Accordion key={data?.faq_id} className='tw-mb-1 tw-p-1 tw-mt-4'>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography className='text_color' fontWeight={700} fontSize={14}>{data?.query}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography fontSize={14} fontWeight={400}>{data?.answer}</Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))
                    )}
                </div>
            </Slide>
        </div>
        , document.body);
};

export default FaqSideBar;