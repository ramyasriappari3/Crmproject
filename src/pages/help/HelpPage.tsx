import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { IAPIResponse } from '@Src/types/api-response-interface';
import { MODULES_API_MAP, httpService } from '@Src/services/httpService';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import { useAppDispatch } from '@Src/app/hooks';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./HelpPage.scss";

const HelpPage = () => {
    const [questionTitle, setQuestionTitle] = useState('General Questions');
    const [data, setData] = useState([]); // Holds the full data
    const [filteredData, setFilteredData] = useState([]); // Holds filtered data based on the search
    const searchRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();

    const icons: any = {
        "General Questions": <img src='/images/generalQuestionIcon.svg' alt='' className='tw-size-10' />,
        "Application Form": <img src='/images/applicationFormRelatedQuestionIcon.svg' alt='' className='tw-size-10' />,
        "Payment Related": <img src='/images/paymentRelatedQuestionIcon.svg' alt='' className='tw-size-10' />,
        "Property Related": <img src='/images/propertyRelatedQuestionIcon.svg' alt='' className='tw-size-10' />
    };

    // Fetch FAQ data only once
    const fetchFAQs = async () => {
        dispatch(showSpinner());
        const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, GLOBAL_API_ROUTES.FAQ_QUESTIONS).GET();
        const resultData = apiResponse?.data?.data?.resultData || [];
        setData(resultData); // Store full data
        setFilteredData(resultData.filter((item: any) => item.faq_type === questionTitle)); // Initialize filtered data
        dispatch(hideSpinner());
    };

    useEffect(() => {
        fetchFAQs(); // Fetch data when the component mounts
    }, []);

    // Filter data based on search and selected category
    const filterData = () => {
        const searchInfo = searchRef.current?.value.trim().toLowerCase() || '';
        const filtered = data.filter((item: any) => {
            const matchesTitle = !questionTitle || item.faq_type === questionTitle;
            const matchesSearch = item.query.toLowerCase().includes(searchInfo);
            return matchesTitle && matchesSearch;
        });
        setFilteredData(filtered);
    };

    const onhandleSearch = () => {
        filterData(); // Perform local filtering instead of making an API call
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onhandleSearch(); // Filter data on Enter key press
        }
    };

    const handleClick = (title: string) => {
        if (questionTitle === title) {
            setQuestionTitle(''); // Deselect category
            setFilteredData(data); // Reset to full data
        } else {
            setQuestionTitle(title); // Select a new category
            setFilteredData(data.filter((item: any) => item.faq_type === title)); // Filter based on the selected category
        }
    };

    return (
        <div className='help-pages'>
            <Box>
                <Box sx={{
                    backgroundColor: '#ffff',
                    borderRadius: 6,
                    padding: 5,
                }} >
                    <Typography fontSize={32} className="text_color" fontWeight={700} >
                        Frequently Asked Questions
                    </Typography>
                    <Typography sx={{ my: 2 }} fontSize={14} fontWeight={700} >
                        Search for Your Question
                    </Typography>
                    <TextField
                        id="search_id"
                        variant="outlined"
                        className='search_width'
                        placeholder="Type questions here"
                        inputRef={searchRef}
                        onKeyDown={handleKeyPress}
                        InputProps={{
                            startAdornment: <img src='/images/search-icon.svg' className='tw-size-5 tw-ml-4' alt='' />,
                            endAdornment: <Button variant="contained" onClick={onhandleSearch} className='button_color'>Search</Button>,
                        }}
                    />
                    <p className='fs13 tw-font-normal tw-mt-5'>
                        Can't find what you're looking for? Need help with something else? Contact your Relationship manager and we'll get in touch with you soon.
                    </p>
                </Box>
                <Typography className='text_color' fontSize={18} fontWeight={700} sx={{ marginTop: 4 }}>
                    Help Topics
                </Typography>
                <Box className="tw-mt-4 tw-gap-9 tw-grid md:tw-grid-cols-4 tw-grid-cols-2">
                    {Object.keys(icons).map((title) => (
                        <React.Fragment key={title}>
                            <Paper variant="outlined" onClick={() => handleClick(title)}
                                className='tw-p-8 tw-text-center tw-w-full tw-cursor-pointer tw-rounded-2xl'
                                sx={{
                                    border: questionTitle === title ? '2px solid #1480B7' : '1px solid #C0C4CE',
                                    borderRadius: '16px'
                                }}>
                                <div className='tw-flex tw-justify-center tw-items-center'>
                                    {icons[title]}
                                </div>
                                <Typography sx={{ mt: 3 }}>{title}</Typography>
                            </Paper>
                        </React.Fragment>
                    ))}
                </Box>
                <Box sx={{ my: 4 }}>
                    <Typography fontSize={16} className='text_color' fontWeight={400}>
                        {questionTitle}
                    </Typography>
                    {filteredData.length === 0 ? (
                        <div className='tw-flex tw-justify-center tw-items-center'>
                            <img src="/images/no_result.gif" alt="" className='!tw-size-30' />
                        </div>
                    ) : (
                        filteredData.map((item: any) => (
                            <Accordion key={item.faq_id} component={Paper} variant='outlined' sx={{ py: 1, mb:2, }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    sx={{ py: 0, mx: 0 }}
                                >
                                    <Typography className="tw-text-[#25272D] tw-text-[14px] tw-font-bold">
                                        {item.query}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography className="tw-text-[#656C7B] tw-text-[14px] tw-font-normal">
                                        {item.answer}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))
                    )}
                </Box>
            </Box>
        </div>
    );
};

export default HelpPage;
