import React, { useEffect, useState } from 'react';
import { downloadFiles } from '@Src/utils/globalUtilities';
import { useAppDispatch } from '@Src/app/hooks';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import { IAPIResponse } from '@Src/types/api-response-interface';
import { MODULES_API_MAP, httpService } from '@Src/services/httpService';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import ReactPlayer from 'react-player'
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";
import "yet-another-react-lightbox/styles.css";
import './UpdatesTab.scss';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    timelineItemClasses,
} from '@mui/lab';
import { Typography, Link } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { FaCheck } from "react-icons/fa";
import moment from 'moment';

const UpdatesTab = (props: { projectId: any, videoDetail: any, unitMilestones: any }) => {
    const dispatch = useAppDispatch();
    const [updatesData, setUpdatesData] = useState<any>([]);
    const [monthOfUpdate, setMonthOfUpdate] = useState<any>();
    const [yearOfUpdate, setYearOfUpdate] = useState<any>();
    const [openCarousel, setOpenCarousel] = useState<boolean>(false);
    const [expandedId, setExpandedId] = useState(null);

    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' },
    ];

    const years = Array.from({ length: 20 }, (_, i) => {
        const year = new Date().getFullYear() - i;
        return { value: year, label: year.toString() };
    });

    const getConstructionUpdates = async () => {
        dispatch(showSpinner());
        try {
            const URL = `${GLOBAL_API_ROUTES.GET_UNIT_UPDATES}?project_id=${props?.projectId}&year_of_update=${yearOfUpdate || ''}&month_of_update=${monthOfUpdate || ''}`.trim();
            const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, URL).GET();
            if (apiResponse?.success) {
                setUpdatesData(apiResponse?.data?.data);
            }
        } catch (error) {
            console.error(error);
        }
        dispatch(hideSpinner());
    };

    useEffect(() => {
        if (props?.projectId) {
            getConstructionUpdates();
        }
    }, [props?.projectId]);

    const handleExpand = (id: any) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const slides = updatesData.map((data: any) => ({
        src: data.images_url,
        title: data.image_title,
    }));

    const milestoneStatusConfig = {
        future: {
            bgcolor: '#C0C4CE',
            icon: '',
        },
        raised: {
            bgcolor: '#00BD35',
            icon: <CheckIcon sx={{ fontSize: 15 }} />,
        },
        upcoming: {
            bgcolor: '#FF9500',
            icon: '',
        },
    };

    const updatedMilestoneData = props?.unitMilestones
        .filter((milestone: { milestone_sequence: number }) => milestone.milestone_sequence > 2)
        .map((milestone: { milestone_sequence: number; milestone_description: string; milestone_status: keyof typeof milestoneStatusConfig }) => {
            const milestoneDescriptions: { [key: number]: string } = {
                3: "2nd basement slab casting",
                4: "5th floor slab casting",
                5: "10th floor slab casting",
                6: "15th floor slab casting",
                7: "20th floor slab casting",
                8: "Completion of Flooring, Doors & Windows",
                9: "Completion of works in the Flat / Registration",
                10: "25th floor slab casting",
                11: "Completion of Screeding & Putty",
            };

            return {
                ...milestone,
                milestone_description: milestoneDescriptions[milestone.milestone_sequence] || milestone.milestone_description,
                statusConfig: milestoneStatusConfig[milestone.milestone_status],
            };
        });

    const lastRaisedMilestone = updatedMilestoneData.find((milestone: any) => milestone.milestone_status === 'raised' && milestone.milestone_sequence === Math.max(...updatedMilestoneData.filter((m: any) => m.milestone_status === 'raised').map((m: any) => m.milestone_sequence)));

    return (
        <main className='tw-flex tw-flex-col'>
            <header className='tw-flex'>
                <p className='fs14 tw-font-bold tw-text-[#25272D] tw-mt-4'>Construction Updates</p>
            </header>
            <section className='tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-4'>
                {
                    updatesData?.length ? (
                        <div className="tw-flex tw-flex-col tw-gap-2 tw-justify-center tw-items-center">
                            <h3 className='tw-font-bold tw-text-[#25272D]'>
                                Project Status as on
                                {` ${updatesData?.[0]?.month_of_update} ${updatesData?.[0]?.year_of_update}`}
                            </h3>
                            <div className="section-container tw-p-4 tw-w-4/5 tw-cursor-pointer" onClick={() => setOpenCarousel(true)}>
                                <div className={`tw-grid tw-gap-4 ${updatesData.length === 1 ? 'tw-grid-cols-1' : updatesData.length === 2 ? 'tw-grid-cols-1 md:tw-grid-cols-2' : 'tw-grid-cols-1 md:tw-grid-cols-3'}`}>
                                    {updatesData.slice(0, Math.min(3, updatesData.length)).map((data: any, index: number) => (
                                        <div key={index} className="textOverImg tw-relative tw-aspect-square">
                                            <img src={data?.images_url} alt="" className="tw-w-full tw-h-full tw-object-cover" />
                                            {index === 2 && updatesData.length > 3 && (
                                                <div className="tw-absolute tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center">
                                                    <button
                                                        className="tw-cursor-pointer view-photos tw-text-white tw-font-bold"
                                                        onClick={(e) => { e.stopPropagation(); setOpenCarousel(true); }}>
                                                        View all Photos ({updatesData.length})
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='tw-my-11 tw-flex tw-justify-center tw-items-center'>
                            <p>Construction Updates are not available</p>
                        </div>
                    )
                }

                <div className='tw-w-full tw-flex tw-justify-center'>
                    <div className='section-container tw-p-4 md:tw-w-4/5 tw-w-full tw-aspect-[16/9]'>
                        <ReactPlayer controls={true} width={"100%"} height={'100%'} url={props?.videoDetail?.[0]?.url} />
                    </div>
                </div>

                <Lightbox
                    open={openCarousel}
                    close={() => setOpenCarousel(false)}
                    slides={slides}
                    plugins={[Zoom, Download, Captions]}
                    zoom={{
                        scrollToZoom: true,
                        maxZoomPixelRatio: 5,
                    }}
                    carousel={{
                        imageFit: 'contain',
                        padding: '4%'
                    }}
                    toolbar={{
                        buttons: [
                            'zoom',
                            'download',
                            'close',
                        ],
                    }}
                    styles={{
                        container: { backgroundColor: 'rgba(0, 0, 0, .9)' },
                        captionsTitle: { fontSize: '18px', color: '#fff', position: 'absolute', top: '20px', left: '20px' },
                    }}
                    controller={{ closeOnBackdropClick: true, }}
                    download={{
                        download: ({ slide }: { slide: any }) => {
                            const fileName = slide.src.split('/').pop() || 'image';
                            const fileExtension = fileName.split('.').pop() || 'png';
                            downloadFiles(slide.src, `${fileName.split('.')[0]}.${fileExtension}`);
                        },
                    }}
                />

                <div className='tw-flex tw-flex-col section-container tw-p-4 tw-w-4/5 '>
                    <p className='tw-mb-4'>Construction Timeline</p>
                    {updatedMilestoneData?.length ? (
                        <div className='tw-flex tw-w-full'>
                            <Timeline position="right" sx={{
                                [`& .${timelineItemClasses.root}:before`]: {
                                    flex: 0,
                                    padding: 0,
                                },
                            }}>
                                {updatedMilestoneData?.map((update: any, index: number) => (
                                    <TimelineItem key={index}>
                                        <TimelineSeparator>
                                            <TimelineDot sx={{
                                                bgcolor: update.statusConfig.bgcolor,
                                                marginBlock: 0,
                                                width: 20,
                                                height: 20,
                                                ...(update.milestone_status === 'future' || update.milestone_status === 'upcoming' ? {
                                                    boxShadow: `0 0 0 5px ${update.statusConfig.bgcolor}35`,
                                                    marginBlock: '5px',
                                                    marginLeft: '4px',
                                                    width: 10,
                                                    height: 10,
                                                } : {})
                                            }}>
                                                {update.milestone_status === 'raised' && <FaCheck className='tw-text-[10px]' />}
                                            </TimelineDot>
                                            {index < updatedMilestoneData.length - 1 && (
                                                <TimelineConnector sx={{
                                                    bgcolor: '#00BD35',
                                                    ...(update.milestone_status === 'future' || update.milestone_status === 'upcoming' ? {
                                                        borderStyle: 'dashed',
                                                        marginLeft: '4px',
                                                        borderWidth: '2px',
                                                        borderColor: '#DFE1E7',
                                                        bgcolor: 'transparent',
                                                    } : {}),
                                                }} />
                                            )}
                                        </TimelineSeparator>
                                        <TimelineContent>
                                            <div className='tw-flex tw-justify-between'>
                                                <p className='fs14 tw-text-[#25272D]'>
                                                    {update?.milestone_description || ''}
                                                </p>
                                            </div>
                                            <p className='fs12 tw-text-[#656C7B]'>
                                                {update.milestone_status === 'future'
                                                    ? ''
                                                    : update.milestone_status === 'upcoming'
                                                        ? 'In-progress'
                                                        : update.milestone_status === 'raised'
                                                            ? moment(update?.milestone_completion_date)?.format('DD-MM-YYYY') || 'N/A'
                                                            : ''}
                                            </p>
                                            {lastRaisedMilestone && lastRaisedMilestone.milestone_id === update.milestone_id && (
                                                <div className='tw-flex tw-items-center tw-text-sm tw-text-[#007AFF] tw-gap-1 tw-mt-1'>
                                                    <a href="https://www.myhomeconstructions.com/ongoing-projects/" target='_blank' rel="noreferrer noopener">
                                                        View detailed construction updates on our website
                                                    </a>
                                                    <ArrowOutwardIcon sx={{ fontSize: '16px' }} />
                                                </div>
                                            )}
                                        </TimelineContent>
                                    </TimelineItem>
                                ))}
                            </Timeline>
                        </div>
                    ) : (
                        <div className='tw-flex tw-justify-center'>
                            <Typography>Construction Updates are not available</Typography>
                        </div>
                    )}
                </div>
            </section >
        </main>
    );
};

export default UpdatesTab;