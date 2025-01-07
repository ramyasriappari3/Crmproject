import * as React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AboutProperty from '@Components/about-property/AboutProperty';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MyTasks from '@Components/my-tasks/MyTasks';
import Documents from '@Components/documents-tab/Documents';
import PendingTaskCardSidebar from '@Components/pending-task-card-sidebar/PendingTaskCardSidebar';
import { MODULES_API_MAP, httpService } from '@Src/services/httpService';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import { IAPIResponse } from '@Src/types/api-response-interface';
import { useParams } from 'react-router-dom';
import { myTaskCardProps } from '@Components/my-task-card/MyTaskCard';
import FullscreenCarousel from '@Components/fullscreen-carousel/FullscreenCarousel';
import TdsInfoCard from '@Components/tds-info-card/TdsInfoCard';
import UpdatesTab from '@Components/updates-tab/UpdatesTab';
import PaymentsTab from '@Components/payments-tab/PaymentsTab';
import RecieptsTab from '@Components/reciepts-tab/RecieptsTab';
import { useAppDispatch } from '@Src/app/hooks';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import { getDataFromLocalStorage, formatNumberToIndianSystem, formatNumberToIndianSystemArea, capitalizeFirstLetter, copyToClipboard } from '@Src/utils/globalUtilities';
import { toast } from 'react-toastify';
import Crm_exec_profile_icon from './../../assets/Images/CRM_profile_img.png';
import MobileCarousel from '@Components/mobile-carousel/MobileCarousel';
import { useNavigate } from 'react-router-dom';
import CarIcon from './../../assets/Images/car.png';
import { Tooltip, Skeleton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccountStatement from '@Components/account-statement/AccountStatement';
import { MyContext } from '@Src/Context/RefreshPage/Refresh';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PropertyBankDetailsCard from '@Components/property-bank-details-card/PropertyBankDetailsCard';
import MyCarousel from '@Components/AutoCarousel/MyCarousel';
import './MyPropertyDetails.scss';
import { PDFViewer } from '@react-pdf/renderer';
import Statements from '@Components/account-statement/Statements';
import { LuClipboardCheck } from "react-icons/lu";
import { BiCopy } from "react-icons/bi"

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

export default function MyPropertyDetails() {
	const location = useLocation();
	const { propertyId } = useParams();
	const [currentTab, setCurrentTab] = useState(0);
	const [loading, setLoading] = useState(true); // State to manage loading
	const [showCarousel, setShowCarousel] = React.useState(false);
	const [tasks, setTasks] = useState<myTaskCardProps[]>([]);
	const [images, setImages] = React.useState<any>();
	const [propertyVideo, setPropertyVideo] = React.useState<any>();
	const [constructionVideo, setConstructionVideo] = React.useState();
	const [showAccountStatementModel, setShowAccountStatementModel] = useState<Boolean>(false);
	const [mainApplicant, setMainApplicant] = useState<any>();
	const [jointApplicantDetails, setJointApplicantDetails] = useState<any>();
	const { setUnitId, setCustUnitId, cust_unit_id, setCustProfileId } = React.useContext(MyContext);
	const [projectData, setProjectData] = useState<any>({});
	const [custUnitDetails, setCustUnitDetails] = useState<any>();
	const [blueprintImages, setBlueprintImages] = useState<any>({});
	const [tdsData, setTdsData] = useState<any>([]);
	const [unitMilestones, setUnitMilestones] = useState<any>([]);
	const userDetails: any = JSON.parse(getDataFromLocalStorage("user_details") || "{}");
	const [projectId, setProjectId] = useState<any>();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();



	const tabMapping: { [key: number]: string } = {
		0: "my-task",
		1: "about-property",
		2: "construction-updates",
		3: "payments",
		4: "receipts",
		5: "documents",
	};

	interface PropertyDetails {
		user_email: string;
		user_mobile: string;
		user_name: string;
		price_per_sqft: string;
		unit_id: number;
		covered_area: string;
		appartment_no: number;
		unit_type_id: string;
		bedrooms: number;
		balcony_area: string;
		carpet_area: string;
		facing: string;
		description: string;
		unit_floor_plan: string;
		project_name: number;
		project_details: string;
		project_address: string;
		name: number;
		floor_no: string;
		floor_name: string;
		tower_no: string;
		tower_name: string;
		account_bank: string;
		developer_bank_branch_name: string;
		account_ifsc_code: string;
		account_holder_name: string;
		application_id: number;
		account_number: string;
		no_of_parkings: number;
		parking_slots: string;
		basement: string;
		joint_users: any[];
		unit_images: string[];
		first_name: string;
		last_name: string;
		total_due_amount: number;
		typical_floor_plan: string;
		other_charges: string;
		total_amount: string;
		sales_executive_image: string;
		sales_executive_name: string;
		sales_executive_email: string;
		sales_executive_phone: string;
		common_area: string;
		crm_executive_name: string;
		crm_executive_email: string;
		crm_executive_phone_number: string;
		crm_executive_profile_image: string;
		saleable_area: any;
		bhk: number;
	}

	interface Image {
		images_url: string;
		image_description: string;
		image_sequence: string;
		image_type: string;
	}

	const [propertyDetails, setPropertyDetails] = useState<any>();

	function handleTabChange(index: number) {
		setCurrentTab(index);
		navigate(`/my-property-details/unitId/${propertyId}/${tabMapping[index]}`);
	}

	const getPropertyDetail = async () => {
		if (!propertyId) {
			return;
		}
		try {
			dispatch(showSpinner());
			const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.GET_SINGLE_UNIT_DETAILS}?unit_id=${propertyId}`).GET();
			if (apiResponse?.success) {
				const resultData = apiResponse?.data?.resultData[0];
				const { unit_id, cust_profile_id, cust_unit_id, project_name, tower_code, floor_no, unit_no, project_images, project_id, tds_info, unit_milestones } = resultData;
				const { site_layout_plan_url, typical_floor_plan, unit_floor_plan } = resultData;
				setBlueprintImages({
					site_layout_plan_url: site_layout_plan_url,
					typical_floor_plan_url: typical_floor_plan,
					unit_floor_plan_url: unit_floor_plan,
				})
				setUnitMilestones(unit_milestones.sort((a: any, b: any) => a.milestone_sequence - b.milestone_sequence));
				setCustProfileId(cust_profile_id);
				setTdsData(tds_info);
				setPropertyDetails(resultData);
				setUnitId(unit_id);
				setProjectId(project_id);
				setCustUnitId(cust_unit_id);
				setProjectData({
					projectName: project_name,
					towerCode: tower_code,
					floorNumber: floor_no,
					unitNumber: unit_no,
				});


				const imageDetails = (project_images || [])
					.filter(({ image_type }: Image) => !["property video", "construction video"].includes(image_type))
					.map(({ image_sequence, image_type, images_url, image_description }: Image) => ({
						sequence: parseInt(image_sequence, 10),
						type: image_type,
						url: images_url,
						description: image_description
					}));

				const propertyVideoDetail = (project_images || []).filter((item: any) => item.image_type === "property video").map((image: any) => ({
					sequence: parseInt(image.image_sequence, 10),
					type: image.image_type,
					url: image.images_url,
					description: image.image_description
				}));

				const contructionVideoDetail = (project_images || []).filter((item: any) => item.image_type === "construction video").map((image: any) => ({
					sequence: parseInt(image.image_sequence, 10),
					type: image.image_type,
					url: image.images_url,
					description: image.image_description
				}));

				// Sorting based on sequence and image type
				imageDetails.sort((a: any, b: any) => {
					if (a.sequence !== b.sequence) {
						return a.sequence - b.sequence;
					}
					return a.type.localeCompare(b.type);
				});

				setImages(imageDetails);
				setPropertyVideo(propertyVideoDetail);
				setConstructionVideo(contructionVideoDetail);
			} else {
				console.error('API call was unsuccessful:', apiResponse);
			}

		} catch (error) {
			console.error('Error fetching property details:', error);
		} finally {
			dispatch(hideSpinner());
			setLoading(false);
		}
	};

	const getApplicantDetails = async () => {
		try {
			dispatch(showSpinner());
			const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.CUSTOMER_APPLICATION_DETAILS}?cust_profile_id=${userDetails?.cust_profile_id}`).GET();
			if (apiResponse?.success) {
				let mainApplicantDetails = apiResponse?.data?.customerProfileDetails;
				let jointApplicantDetails = apiResponse?.data?.jointCustomerProfileDetails.sort((lista: any, listb: any) => {
					return lista.joint_profile_sequence_number - listb.joint_profile_sequence_number;
				});
				setMainApplicant(mainApplicantDetails);
				setJointApplicantDetails(jointApplicantDetails);
			} else {
				console.error('API call was unsuccessful:', apiResponse);
			}

		} catch (error) {
			console.error('Error fetching applicant details:', error);
		} finally {
			dispatch(hideSpinner());
		}
	};


	const getMyTasks = async () => {
		if (!cust_unit_id) {
			return;
		}
		try {
			dispatch(showSpinner());
			const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.MY_TASKS}?cust_unit_id=${cust_unit_id}`).GET();
			if (apiResponse?.success) {
				setCustUnitDetails(apiResponse?.data?.[0]);
				setTasks(apiResponse?.data?.[0]?.pendingTasks);
			}
		} catch (error) {
			console.log(error);
		} finally {
			dispatch(hideSpinner());
		}
	};


	useEffect(() => {
		getApplicantDetails();
		getPropertyDetail();
		getMyTasks();
	}, [cust_unit_id]);

	useEffect(() => {
		const currentPath = location.pathname.split('/').pop() ?? '';
		const tabIndex = Object.values(tabMapping).indexOf(currentPath);
		if (tabIndex >= 0) {
			setCurrentTab(tabIndex);
		}
	}, [location.pathname]);

	const [isCopied, setIsCopied] = useState(false);

	return (
		<div className='property-details-page'>
			<div className='tw-flex tw-flex-col xl:tw-flex-row tw-gap-6'>
				<div className='xl:tw-w-3/4 tw-w-full section-container md:!tw-shadow-md !tw-shadow-none md:!tw-border !tw-border-none md:tw-p-4'>
					<div className="md:tw-grid md:tw-grid-cols-3 tw-flex tw-h-[250px] tw-gap-4 tw-overflow-x-auto tw-overflow-y-hidden tw-cursor-pointer" onClick={(e) => { e.stopPropagation(); setShowCarousel(p => !p); }}>
						{/* First Card */}
						<div className="md:tw-col-span-2 md:tw-row-span-2 md:tw-overflow-hidden md:tw-aspect-auto tw-aspect-[16/11] tw-w-auto tw-h-[100%] tw-rounded-lg tw-card">
							{loading && <Skeleton animation="wave" variant="rectangular" width="100%" height="100%" />}
							<img src={images?.[0]?.url} alt="" className='tw-w-full tw-h-full tw-object-cover' />
						</div>
						{/* Second Card */}
						<div className="md:tw-col-span-1 md:tw-overflow-hidden tw-rounded-lg md:tw-aspect-auto tw-aspect-[16/11]  tw-w-auto tw-card tw-h-[100%]">
							{loading && <Skeleton animation="wave" variant="rectangular" width="100%" height="100%" />}
							<img src={images?.[1]?.url} alt="" className='tw-w-full tw-h-full tw-object-cover' />
						</div>
						{/* Third Card */}
						<div className="md:tw-col-span-1 md:tw-overflow-hidden tw-rounded-lg md:tw-aspect-auto tw-aspect-[16/11] tw-card tw-relative tw-h-[100%]">
							{loading && <Skeleton animation="wave" variant="rectangular" width="100%" height="100%" />}
							{images?.length > 3 && !loading && (
								<>
									<img src={images?.[3]?.url} alt="" className='tw-w-full tw-h-full tw-object-cover' />
									<div className='tw-z-30 tw-absolute tw-bottom-0 tw-right-0 tw-flex tw-items-center tw-justify-center tw-p-1 tw-m-2 tw-bg-black/50 tw-text-white tw-rounded-md tw-text-sm tw-gap-2 tw-cursor-pointer'>
										<img src={'/images/images-icon.svg'} alt="View all photos" />
										<h1> View all {images?.length} photos </h1>
									</div>
								</>
							)}
						</div>
					</div>
					<div className='tw-flex md:tw-flex-row tw-flex-col tw-pt-4 md:tw-pb-4 tw-justify-between md:tw-items-center tw-items-start md:tw-border-none tw-border-b'>
						<div className=''>
							{loading ? (
								<div className='tw-flex tw-flex-col'>
									<Skeleton animation="wave" variant="text" width={400} height={40} />
									<Skeleton animation="wave" variant="text" width={120} height={40} />
								</div>
							) : (
								<>
									<h1 className='tw-text-xl tw-font-bold tw-text-[#3C4049]'>{capitalizeFirstLetter(propertyDetails?.project_name) ?? "N/A"}, Tower {parseInt(propertyDetails?.tower_code ?? "N/A").toString()}, Unit {parseInt(propertyDetails?.floor_no, 10).toString()}{propertyDetails?.unit_no}</h1>
									<h3 className='tw-text-sm tw-flex tw-min-w-fit tw-w-64'> <img src="/images/location-icon.svg" alt="Location" className='tw-mr-1' /> {propertyDetails?.project_city ?? "N/A"}, {propertyDetails?.project_state ?? "N/A"} </h3>
								</>
							)}
						</div>
						<div className="tw-flex md:tw-flex-row tw-flex-col tw-justify-center tw-my-4 lg:tw-my-0 tw-gap-3 tw-rounded-4">
							<div className='tw-flex tw-gap-2'>
								{loading ? (
									<Skeleton animation="wave" variant="circular" width={40} height={40} />
								) : (
									<div className='tw-w-10 tw-rounded-full'>
										<img className='tw-h-10 tw-w-full tw-rounded-full tw-object-cover tw-object-top' src={propertyDetails?.crm_profile_pic || Crm_exec_profile_icon} alt="CRM executive profile"></img>
									</div>
								)}
								<div className="tw-min-w-fit">
									{loading ? (
										<div className='tw-flex tw-flex-col'>
											<Skeleton animation="wave" variant="text" width={120} height={40} />
											<Skeleton animation="wave" variant="text" width={120} height={40} />
										</div>
									) : (
										<>
											<h3 className='tw-text-sm tw-font-bold tw-text-black'>{propertyDetails?.crm_executive_name ?? "N/A"}</h3>
											<h3 className='tw-text-sm tw-min-w-fit'>Relationship Manager</h3>
										</>
									)}
								</div>
							</div>
							<div className='tw-flex tw-flex-col'>
								{loading ? (
									<div className='tw-flex tw-flex-col'>
										<Skeleton animation="wave" variant="text" width={120} height={40} />
										<Skeleton animation="wave" variant="text" width={120} height={40} />
									</div>
								) : (
									<>
										<div className='tw-flex'>
											<a href={`tel:${propertyDetails?.crm_phone || "N/A"}`} className='tw-flex md:tw-hidden' >
												<img src={'/images/phone.svg'} alt="" className='tw-mr-2' />
												<span className='tw-text-sm' >+91 {propertyDetails?.crm_phone || "N/A"}</span>
											</a>
											<div className='tw-hidden md:tw-flex' >
												<img src={'/images/phone.svg'} alt="" className='tw-mr-2' />
												<span className='tw-text-sm' >+91 {propertyDetails?.crm_phone || "N/A"}</span>
											</div>
										</div>
										<Tooltip title={'Copy Email'} arrow>
											<button className='tw-w-72 tw-text-sm tw-flex tw-items-center tw-gap-2 tw-cursor-pointer'
												onClick={() => {
													copyToClipboard(propertyDetails?.crm_email)
													setIsCopied(true);
													setTimeout(() => setIsCopied(false), 2000);
												}}>
												<img src="/images/mail.svg" alt="mail" />
												<h2 className='tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap'>
													{propertyDetails?.crm_email ?? "N/A"}
												</h2>
												{isCopied ? <LuClipboardCheck className='tw-text-lg' /> : <BiCopy className='tw-text-lg' />}
											</button>
										</Tooltip>
									</>
								)}
							</div>
						</div>
					</div>
					<div className='tw-flex md:tw-flex-row tw-flex-col tw-gap-4 tw-justify-between tw-mt-3'>
						<div className='md:tw-w-3/5 md:tw-flex md:tw-justify-between tw-grid tw-grid-cols-2 md:tw-gap-6 tw-gap-4 md:tw-pr-8 md:tw-border-r tw-w-full'>
							<div className='tw-flex'>
								{loading ? (
									<div className='tw-flex tw-flex-col'>
										<Skeleton animation="wave" variant="text" width={80} height={40} />
										<Skeleton animation="wave" variant="text" width={80} height={40} />
									</div>
								) : (
									<>
										<img className='tw-w-min tw-h-5 tw-mr-2' src={"/images/resize.svg"} alt='Property'></img>
										<div className='tw-flex tw-flex-col'>
											<p className='fs13'>Saleable Area&nbsp;
												<Tooltip title={
													<div className='tw-flex tw-flex-col tw-h-auto tw-w-auto'>
														{propertyDetails?.carpet_area != 0 &&
															<div className="tw-flex tw-justify-between tw-py-2">
																<span>Carpet Area:</span>
																<span className="text_end">
																	{formatNumberToIndianSystemArea(propertyDetails?.carpet_area)} SFT
																</span>
															</div>
														}
														{propertyDetails?.balcony_area != 0 &&
															<div className="tw-flex tw-justify-between tw-py-2">
																<span>Balcony Area:</span>
																<span className="text_end">
																	{formatNumberToIndianSystemArea(propertyDetails?.balcony_area)} SFT
																</span>
															</div>
														}
														{propertyDetails?.common_area != 0 &&
															<div className="tw-flex tw-justify-between tw-py-2">
																<span>Common Area:</span>
																<span className="text_end">
																	{formatNumberToIndianSystemArea(propertyDetails?.common_area)} SFT
																</span>
															</div>
														}
														{propertyDetails?.uds_area != 0 &&
															<div className="tw-flex tw-justify-between tw-py-2">
																<span>UDS Area:</span>
																<span className="text_end">
																	{formatNumberToIndianSystemArea(propertyDetails?.uds_area)} SFT
																</span>
															</div>
														}
														{propertyDetails?.saleable_area != 0 &&
															<div className="tw-flex tw-justify-between tw-py-2 tw-border-t-2 tw-border-[#484C54]">
																<span>Total Saleable Area:</span>
																<span className="text_end">
																	{formatNumberToIndianSystemArea(propertyDetails?.saleable_area)} SFT
																</span>
															</div>
														}
													</div>
												}
													arrow placement='top'
													classes={{ tooltip: 'custom-tooltip-color' }}
													enterTouchDelay={0}
													leaveTouchDelay={5000}
												>
													<InfoOutlinedIcon style={{ fontSize: '18px', cursor: 'pointer' }} />
												</Tooltip>
											</p>
											<h3 className='fs13 tw-font-bold tw-text-[#3C4049]'>{formatNumberToIndianSystemArea(propertyDetails?.saleable_area) ?? "N/A"} SFT</h3>
										</div>
									</>
								)}
							</div>
							<div className='tw-flex'>
								{loading ? (
									<div className='tw-flex tw-flex-col'>
										<Skeleton animation="wave" variant="text" width={80} height={40} />
										<Skeleton animation="wave" variant="text" width={80} height={40} />
									</div>
								) : (
									<>
										<img className='tw-w-min tw-h-5 tw-mr-2' src={"/images/floor-plan-icon.svg"} alt='unit type' />
										<div className='tw-flex tw-flex-col'>
											<h3 className='fs13'>Unit Type</h3>
											<h3 className='fs13 tw-font-bold tw-text-[#3C4049]'>{propertyDetails?.bedrooms || 0}</h3>
										</div>
									</>
								)}
							</div>
							<div className='tw-flex'>
								{loading ? (
									<div className='tw-flex tw-flex-col'>
										<Skeleton animation="wave" variant="text" width={80} height={40} />
										<Skeleton animation="wave" variant="text" width={80} height={40} />
									</div>
								) : (
									<>
										<img className='tw-w-min tw-h-5 tw-mr-2' src={"/images/car-icon.svg"} alt="" />
										<div className='tw-flex tw-flex-col'>
											<h3 className='fs13'>Car Parking</h3>
											<h3 className='fs13 tw-font-bold tw-text-black'>{propertyDetails?.no_of_parkings || 0}</h3>
										</div>
									</>
								)}
							</div>
							<div className='tw-flex '>
								{loading ? (
									<div className='tw-flex tw-flex-col'>
										<Skeleton animation="wave" variant="text" width={80} height={40} />
										<Skeleton animation="wave" variant="text" width={80} height={40} />
									</div>
								) : (
									<>
										<img className='tw-w-min tw-h-5 tw-mr-2' src='/images/compass-icon.svg' alt='Compass Icon'></img>
										<div className='tw-flex tw-flex-col'>
											<h3 className='fs13'>Facing</h3>
											<h3 className='fs13 tw-font-bold tw-text-black'>{(propertyDetails?.facing ?? "N/A")?.split(" ")[0]}</h3>
										</div>
									</>
								)}
							</div>
						</div>
						<div className='md:tw-w-2/5 md:tw-flex md:tw-justify-end md:tw-gap-6 tw-grid tw-grid-cols-2 md:tw-shrink-0'>
							<div>
								{loading ? (
									<div className='tw-flex tw-flex-col'>
										<Skeleton animation="wave" variant="text" width={80} height={40} />
										<Skeleton animation="wave" variant="text" width={80} height={40} />
									</div>
								) : (
									<>
										<p className='fs13'>Balance Due Amount</p>
										<p className='fs13 tw-font-bold tw-text-black'>&#8377; {formatNumberToIndianSystem(propertyDetails?.balance_amount) ?? "N/A"}</p>
									</>
								)}
							</div>
							<div className='tw-flex tw-items-center tw-cursor-pointer tw-gap-2'>
								{loading ? (
									<>
										<Skeleton animation="wave" variant="text" width={100} height={30} />
									</>
								) : (
									<p className='tw-text-[#1F69FF] tw-font-medium fs13 tw-w-[100%]' onClick={() => setShowAccountStatementModel(true)}>View account statement <span className='tw-pl-1'><ArrowForwardIcon sx={{ color: '#1F69FF' }} /></span> </p>
								)}

							</div>
						</div>
					</div>
					<div className='tw-hidden lg:tw-block'>
						{showCarousel && (
							<FullscreenCarousel
								showCarousel={showCarousel}
								setShowCarousel={setShowCarousel}
								images={images}
								projectData={projectData}
							/>
						)}
					</div>
					<div className="tab-header tw-mt-4 !tw-text-xs">
						<button className={currentTab === 0 ? "tab-button active" : "tab-button"} onClick={() => handleTabChange(0)}>My Tasks</button>
						<button className={currentTab === 1 ? "tab-button active" : "tab-button"} onClick={() => handleTabChange(1)}>About Property</button>
						<button className={currentTab === 2 ? "tab-button active" : "tab-button"} onClick={() => handleTabChange(2)}>Updates</button>
						<button className={currentTab === 3 ? "tab-button active" : "tab-button"} onClick={() => handleTabChange(3)}>Payments</button>
						<button className={currentTab === 4 ? "tab-button active" : "tab-button"} onClick={() => handleTabChange(4)}>Receipts</button>
						<button className={currentTab === 5 ? "tab-button active" : "tab-button"} onClick={() => handleTabChange(5)}>Documents</button>
					</div>
					<div className="tab-content">
						{currentTab === 0 && <div><MyTasks setCurrentTab={setCurrentTab} /></div>}
						{currentTab === 1 && <div><AboutProperty
							blueprintImages={blueprintImages}
							propertyData={propertyDetails}
							mainApplicant={mainApplicant}
							jointApplicantDetails={jointApplicantDetails}
							projectImages={images}
							videoDetail={propertyVideo}
						/></div>}
						{currentTab === 2 && <div><UpdatesTab projectId={propertyDetails?.project_id} videoDetail={constructionVideo} unitMilestones={unitMilestones} /></div>}
						{currentTab === 3 && <div><PaymentsTab unit_Id={propertyId} /></div>}
						{currentTab === 4 && <div> <RecieptsTab /> </div>}
						{currentTab === 5 && <div><Documents mainApplicant={mainApplicant} /></div>}
					</div>
				</div>
				<div className='tw-flex tw-flex-col tw-w-full xl:tw-w-1/4'>
					{tasks?.length > 0 ? (
						<>
							<p className='text-pri-all tw-text-black tw-mb-1 tw-text-lg tw-font-bold'>
								Pending Tasks
							</p>
							{(tasks.slice(0, 2) || []).map((task: any, index: any) => (
								<PendingTaskCardSidebar
									key={index}
									getMyTasks={getMyTasks}
									custUnitDetails={custUnitDetails}
									task={task}
								/>
							))}
							<button className='view-button' onClick={() => { navigate("/my-task-page") }} >View all</button>
						</>
					) : ""}
					<div className='tw-mt-5'>
						<PropertyBankDetailsCard
							propertyData={propertyDetails}
						/>
					</div>
					<div>
						<TdsInfoCard tdsData={tdsData} />
					</div>
					<div className="tw-w-full tw-max-w-full tw-h-[300px] tw-mt-6 tw-rounded-2xl tw-overflow-hidden tw-shadow-md tw-bg-black">
						<MyCarousel projectId={projectId} />
					</div>
				</div>
				{/* <AccountStatement
					showAccountStatementModel={showAccountStatementModel}
					setShowAccountStatementModel={setShowAccountStatementModel}
					unitId={propertyDetails?.unit_id}
					custUnitId={propertyDetails?.cust_unit_id}
					custProfileId={propertyDetails?.cust_profile_id}
				/> */}
				{/* <PDFViewer style={{ width: "100%", backgroundColor: "white", height: "80vh" }}>
           			<Statements 
						showAccountStatementModel={showAccountStatementModel}
						setShowAccountStatementModel={setShowAccountStatementModel}
						unitId={propertyDetails?.unit_id}
						custUnitId={propertyDetails?.cust_unit_id}
						custProfileId={propertyDetails?.cust_profile_id}
		   			/>
         		</PDFViewer> */}

				<Statements
					showAccountStatementModel={showAccountStatementModel}
					setShowAccountStatementModel={setShowAccountStatementModel}
					unitId={propertyDetails?.unit_id}
					custUnitId={propertyDetails?.cust_unit_id}
					custProfileId={propertyDetails?.cust_profile_id}
				/>


			</div>
		</div>
	);
}
