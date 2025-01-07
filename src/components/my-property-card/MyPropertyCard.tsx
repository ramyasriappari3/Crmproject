import React, { useCallback, useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import "./MyPropertyCard.scss";
import { useNavigate } from "react-router-dom";
import {
  capitalizeFirstLetter,
  checkForFalsyValues,
  formatNumberToIndianSystem,
  formatNumberToIndianSystemArea,
} from "@Src/utils/globalUtilities";
import Carousel from "better-react-carousel";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AutoCarousel from "@Components/AutoCarousel/AutoCarousel";
import MyCarousel from "@Components/AutoCarousel/MyCarousel";
import TouchAppIcon from '@mui/icons-material/TouchApp';

export interface ProjectImage {
  image_type: string;
  images_url: string;
}

type ProgressBarData = {
  applicationStatus: boolean;
  tenPercOfReciept: boolean;
  carParkingStatus: boolean;
  aggrementOfSale: boolean;
  allpaymentsDone: boolean;
  saleDeedRegistration: boolean;
  possessionHandover: boolean;
};

export interface MyPropertyProps {
  unit_id: number;
  project_image: ProjectImage[];
  unit_type: string;
  project_name: string;
  tower_code: string;
  unit_no: string;
  floor_no: string;
  saleable_area: number;
  covered_area: number;
  common_area: number;
  carpet_area: number;
  balcony_area: number;
  uds_area: number;
  bedrooms: number;
  no_of_parkings: number;
  facing: string;
  total_sale_consideration_with_gst: number;
  total_amount_paid: number;
  total_due_amount: number;
  project_city: string;
  project_state: string;
  total_billed_amount: string;
  total_payable_amount: string;
  balance_amount: string;
  progress_bar_data: ProgressBarData;
}

const DotStylingComponent: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <span
    className="dot-style"
    style={{
      display: "inline-block",
      backgroundColor: isActive ? "#fff" : "#3C4049",
      border: "1px solid #DFE1E7",
      // opacity: isActive ? 1 : 0.5,
      transition: "all 0.3s ease-in-out",
      height: "8px",
      width: "8px",
      borderRadius: "50%",
      cursor: "pointer",
    }}
  ></span>
);

const MyPropertyCard: React.FC<MyPropertyProps> = ({
  unit_id,
  project_image,
  unit_type,
  project_name,
  tower_code,
  unit_no,
  floor_no,
  progress_bar_data,
  project_city,
  project_state,
  saleable_area,
  covered_area,
  common_area,
  balcony_area,
  uds_area,
  carpet_area,
  bedrooms,
  no_of_parkings,
  facing,
  total_billed_amount,
  total_payable_amount,
  balance_amount,
}) => {
  const navigate = useNavigate();

  const steps = [
    {
      label: (
        <span>
          Application
          <br />
          Submitted
        </span>
      ),
      completed: progress_bar_data?.applicationStatus ?? false,
    },
    {
      label: (
        <span>
          10% Payment <br />
          Completed
        </span>
      ),
      completed: progress_bar_data?.tenPercOfReciept ?? false,
    },
    {
      label: (
        <span>
          Car Parkings <br /> Allotted
        </span>
      ),
      completed: progress_bar_data?.carParkingStatus ?? false,
    },
    {
      label: (
        <span>
          Agreement
          <br />
          of Sale
        </span>
      ),
      completed: progress_bar_data?.aggrementOfSale ?? false,
    },
    {
      label: (
        <span>
          All Payments <br /> Done
        </span>
      ),
      completed: progress_bar_data?.allpaymentsDone ?? false,
    },
    {
      label: (
        <span>
          Sale Deed <br /> Registration
        </span>
      ),
      completed: progress_bar_data?.saleDeedRegistration ?? false,
    },
    {
      label: (
        <span>
          Possession
          <br />
          Handover
        </span>
      ),
      completed: progress_bar_data?.possessionHandover ?? false,
    },
  ];

  const sortedProjectImages = (project_image || [])
    ?.filter((image: any) => image.image_type !== "site image")
    ?.sort(
      (a: any, b: any) =>
        parseInt(a.image_sequence, 10) - parseInt(b.image_sequence, 10)
    )
    ?.slice(0, 4);
  return (
    <div
      onClick={() => navigate(`/my-property-details/unitId/${unit_id}`)}
      className="property-cont-main tw-cursor-pointer tw-bg-white tw-border tw-rounded-2xl tw-overflow-hidden tw-w-full !tw-shadow-md"
    >
      <div className="md:tw-flex tw-w-full">
        {/* <div className="left-cont">
          <Carousel
            cols={1}
            rows={1}
            gap={0}
            loop
            autoplay={3000}
            showDots
            dot={DotStylingComponent}
            hideArrow
            containerClassName={"carousel-container"}
          >
            {sortedProjectImages?.map((image: any, index: any) => (
              <Carousel.Item key={index}>
                <img
                  src={image?.images_url}
                  alt="carousel"
                  className="carousel-image tw-w-auto !tw-h-60 !tw-object-fill"
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div> */}
        <div className="tw-bg-slate-400 md:tw-w-[32%] tw-w-full">
          <AutoCarousel sortedProjectImages={sortedProjectImages} />
        </div>

        {/* <div className="left-cont">
                    {<img src={project_image?.find(image => image.image_type === 'main image')?.images_url || '/images/my-property-img.png'} alt="project_image" />}
                </div> */}
        <div className="md:tw-w-[68%] tw-w-full tw-p-5 tw-py-6 tw-flex tw-flex-col tw-gap-4 md:tw-border-b">
          <div className="tw-flex tw-flex-col">
            <div className="tw-flex tw-justify-between lg:tw-gap-0 tw-gap-16 tw-text-xs tw-pb-1">
              <p className="tw-text-[#333333]">
                {unit_type}
              </p>
              <div className="lg:tw-hidden tw-flex tw-justify-between tw-items-center">
                <p className='tw-text-[#656C7B] tw-text-xs'>Go to DashBoard</p>
                <TouchAppIcon />
              </div>
            </div>

            <div className="tw-font-bold tw-text-xl tw-text-black tw-pb-1">
              {capitalizeFirstLetter(project_name) ?? "N/A"}, Tower{" "}
              {parseInt(tower_code, 10).toString() ?? "N/A"}, Unit{" "}
              {parseInt(floor_no, 10).toString()}
              {unit_no ?? "N/A"}
            </div>
            <div className="tw-flex tw-gap-1 tw-text-xs">
              <img src="/images/location-icon.svg" alt="" className="tw-mr-1" />
              <p className="tw-text-[#656C7B]">
                {project_city}, {project_state}
              </p>
            </div>
          </div>
          <div className="tw-grid md:tw-grid-cols-4 tw-grid-cols-2 md:tw-border-none tw-border-b tw-text-xs">
            <div className="tw-flex tw-justify-start tw-gap-1 tw-items-start md:tw-mb-0">
              <div className="tw-w-6 tw-h-6">
                <img
                  src={"/images/resize.svg"}
                  alt=""
                  className="tw-w-full tw-h-full tw-mr-2"
                />
              </div>
              <Tooltip
                title={
                  <div className="tw-flex tw-flex-col tw-h-auto tw-w-auto tw-z-50">
                    {carpet_area != 0 && (
                      <div className="tw-flex tw-justify-between tw-py-2">
                        <span>Carpet Area:</span>
                        <span className="text_end">
                          {formatNumberToIndianSystemArea(carpet_area)} SFT
                        </span>
                      </div>
                    )}
                    {balcony_area != 0 && (
                      <div className="tw-flex tw-justify-between tw-py-2">
                        <span>Balcony Area:</span>
                        <span className="text_end">
                          {formatNumberToIndianSystemArea(balcony_area)} SFT
                        </span>
                      </div>
                    )}
                    {common_area != 0 && (
                      <div className="tw-flex tw-justify-between tw-py-2">
                        <span>Common Area:</span>
                        <span className="text_end">
                          {formatNumberToIndianSystemArea(common_area)} SFT
                        </span>
                      </div>
                    )}
                    {uds_area != 0 && (
                      <div className="tw-flex tw-justify-between tw-py-2">
                        <span>UDS Area:</span>
                        <span className="text_end">
                          {formatNumberToIndianSystemArea(uds_area)} SFT
                        </span>
                      </div>
                    )}
                    {saleable_area != 0 && (
                      <div className="tw-flex tw-justify-between tw-py-2 tw-border-t-2 tw-border-[#484C54]">
                        <span>Total Saleable Area:</span>
                        <span className="text_end">
                          {formatNumberToIndianSystemArea(saleable_area)} SFT
                        </span>
                      </div>
                    )}
                  </div>
                }
                classes={{ tooltip: "custom-tooltip-color" }}
                enterTouchDelay={0}
                leaveTouchDelay={5000}
                arrow
                placement="top"
              >
                <div>
                  <p className="tw-flex tw-text-[#656C7B]">
                    Saleable Area&nbsp;
                    <InfoOutlinedIcon
                      style={{ fontSize: "16px", color: "black" }}
                    />
                  </p>
                  <p className="tw-font-bold tw-text-black">
                    {formatNumberToIndianSystemArea(saleable_area) || 0} SFT
                  </p>
                </div>
              </Tooltip>
            </div>
            <div className="tw-flex tw-justify-start tw-gap-1 tw-items-start  md:tw-mb-0 tw-mb-4">
              <div className="tw-w-6 tw-h-6">
                <img
                  src={"/images/floor-plan-icon.svg"}
                  alt=""
                  className="tw-w-full tw-h-full tw-mr-2"
                />
              </div>
              <div>
                <p className="">Unit Type</p>
                <p className="tw-font-bold tw-text-black">{bedrooms || 0}</p>
              </div>
            </div>
            <div className="tw-flex tw-justify-start tw-gap-1 tw-items-start  md:tw-mb-0 tw-mb-4">
              <div className="tw-w-6 tw-h-6">
                <img
                  src={"/images/car-icon.svg"}
                  alt=""
                  className="tw-w-full tw-h-full tw-mr-2"
                />
              </div>
              <div>
                <p>Car Parking</p>
                <p className="tw-font-bold tw-text-black">
                  {no_of_parkings || 0}{" "}
                </p>
              </div>
            </div>
            <div className="tw-flex tw-justify-start tw-gap-1 tw-items-start  md:tw-mb-0 tw-mb-4">
              <div className="tw-w-6 tw-h-6">
                <img
                  src={"/images/compass-icon.svg"}
                  alt=""
                  className="tw-w-full tw-h-full tw-mr-2"
                />
              </div>
              <div>
                <p>Facing</p>
                <p className="tw-font-bold tw-text-black ">
                  {(facing || "N/A")?.split(" ")[0]}{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="tw-grid md:tw-grid-cols-3 tw-grid-cols-2 md:tw-gap-0 tw-gap-6 tw-text-xs">
            <div className="">
              <p>Total Amount Billed</p>
              <div className="tw-flex tw-flex-wrap">
                <p className="tw-font-bold tw-text-black tw-inline-block">
                  &#8377; {formatNumberToIndianSystem(total_billed_amount) || 0}
                </p>
                <p className="tw-text-[12px]">(includes GST)</p>
              </div>
            </div>
            <div className="">
              <p>Total Amount Paid</p>
              <p className="tw-font-bold tw-text-black">
                &#8377; {formatNumberToIndianSystem(total_payable_amount) || 0}
              </p>
            </div>
            <div className="">
              <p>Balance Due Amount</p>
              <p className="tw-font-bold tw-text-black">
                &#8377; {formatNumberToIndianSystem(balance_amount) || 0}
              </p>
            </div>
          </div>

          {/* <div className='tw-flex tw-justify-between tw-mt-2 property-status' >
                        <div>
                            <p>Current Status</p>
                            <p className='tw-font-bold' >{currentStatus ? currentStatus : "N/A"}</p>
                        </div>
                        <button className='makePaymentButton' >
                            <img src="/images/arrow-right.svg" alt="" className='tw-mr-3' />
                            Make Payment
                        </button>
                    </div> */}
        </div>
      </div>
      <div className="progress-bar-cont">
        <div className="progress">
          {steps.map((step, index) => (
            <div key={index} className="progress-cont">
              <div
                className={`${step.completed ? "circle" : "circle circle2"}`}
              ></div>
              <p className={step.completed ? "p-complete" : ""}>{step.label}</p>
            </div>
          ))}

          {/* <div className='progress-cont' >
                        <span className='circle' ></span>
                        <p className='p-complete'>Application <br /> Submitted</p>
                    </div>
                    <div className='progress-cont' >
                        <span className='circle' ></span>
                        <p className='p-complete'>10% Payment
                            <br /> Completed </p>
                    </div>
                    <div className='progress-cont' >
                        <span className='circle circle2' ></span>
                        <p>Agreement <br /> of Sale </p>
                    </div>
                    <div className='progress-cont' >
                        <span className='circle circle2' ></span>
                        <p>Car Parkings <br /> Allotted </p>
                    </div>
                    <div className='progress-cont' >
                        <span className='circle circle2' ></span>
                        <p>All Payments <br /> Done </p>
                    </div>
                    <div className='progress-cont' >
                        <span className='circle circle2' ></span>
                        <p>Sale deed <br /> Registration </p>
                    </div>
                    <div className='progress-cont' >
                        <span className='circle circle2' ></span>
                        <p>Possession <br /> Handover</p>
                    </div> */}
        </div>
        <div className="indicator-cont">
          {steps.map((status, index) => (
            <div
              key={index}
              className={`indicator ${status.completed ? "completed" : ""}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Debounce function with TypeScript types

export default MyPropertyCard;
