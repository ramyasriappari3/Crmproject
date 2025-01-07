import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Tooltip } from "@mui/material";
import { useAppSelector } from "@Src/app/hooks";
import { LuFileSpreadsheet } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";

interface CustomTableComponent
  extends React.FC<{
    children: any;
  }> {
  TableTitles: React.FC<{ titles: any }>;
  Header: React.FC<{ headers: any[]; grid: any; }>;
  Value: React.FC<{ values: any[]; grid: any; handleView?: any; viewTitle?: any, isView?: boolean; isEdit?: boolean; isDelete?: boolean }>;
}

const CustomTable: CustomTableComponent = ({ children }) => {
  return <>{children}</>;
};

CustomTable.TableTitles = function TableTitles({ titles }: { titles: any }) {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // This will go back to the previous page
  };

  const TOWERS = useAppSelector(
    (state: any) => state.parkingInfo.towers
  );

  return (
    <div className="tw-my-4 tw-flex tw-gap-6 tw-text-sm tw-font-bold tw-text-blue-900 tw-items-center">
      {titles.tower_id && (
        <>
          <Tooltip title={"Back"}>
            <button onClick={goBack}>
              <IoMdArrowRoundBack size={30} />
            </button>
          </Tooltip>
          <div>
            <p className="tw-text-center tw-uppercase tw-text-xs tw-text-black tw-font-bold">
              Tower :
            </p>
            <p>
              {titles.tower_id && TOWERS.filter((tower: any) => tower.tower_id === titles.tower_id)[0].tower_name}
            </p>
          </div>
        </>
      )}
      {/* {titles.basis_of_no_of_eligible_car_parking && (
        <>
          <IoIosArrowForward />
          <div>
            <p className="tw-text-center tw-uppercase tw-text-xs tw-text-black tw-font-bold">
              Basis :
            </p>
            <p>
              {titles.basis_of_no_of_eligible_car_parking ===
                "based_on_flat_size_range"
                ? "Flat Size"
                : "Flat Type"}
            </p>
          </div>
        </>
      )} */}
      {titles.flat_range && (
        <>
          <IoIosArrowForward />
          <div>
            <p className="tw-text-center tw-uppercase tw-text-xs tw-text-black tw-font-bold">
              Flats :
            </p>
            <p>{titles.flat_range.split("_").join(", ")}</p>
          </div>
        </>
      )}
      {titles.no_of_car_parkings && (
        <>
          <IoIosArrowForward />
          <div>
            <p className="tw-text-center tw-uppercase tw-text-xs tw-text-black tw-font-bold">
              No. of car parkings :
            </p>
            <p>{titles.no_of_car_parkings}</p>
          </div>
        </>
      )}
      {/* {titles.allocation_basis && (
        <>
          <IoIosArrowForward />
          <div>
            <p className="tw-text-center tw-uppercase tw-text-xs tw-text-black tw-font-bold">
              Allocation Basis :{" "}
            </p>
            <p>
              {titles.allocation_basis === "floor_range"
                ? "Floor Range"
                : "No Floor Range"}
            </p>
          </div>
        </>
      )} */}
      {titles.floor_range && (
        <>
          <IoIosArrowForward />
          <div>
            <p className="tw-text-center tw-uppercase tw-text-xs tw-text-black tw-font-bold">
              Floor Range :{" "}
            </p>
            <p>
              {titles.floor_range === "0_99999"
                ? "All Floors"
                : titles.floor_range.split("_")[0] +
                " to " +
                titles.floor_range.split("_")[1]}
            </p>
          </div>
        </>
      )}
      {/* {titles.allocation_location && (
        <>
          <IoIosArrowForward />
          <div>
            <p className="tw-text-center tw-uppercase tw-text-xs tw-text-black tw-font-bold">
              Allocation Location :{" "}
            </p>
            <p>
              {titles.allocation_location === "multi" ? "Multi" : "Non-multi"}
            </p>
          </div>
        </>
      )} */}
      {titles.option && (
        <>
          <IoIosArrowForward />
          <div>
            <p className="tw-text-center tw-uppercase tw-text-xs tw-text-black tw-font-bold">
              Option :
            </p>
            <p> {titles.option}</p>
          </div>
        </>
      )}
    </div>
  );
};

CustomTable.Header = function TableHeader({
  headers,
  grid,
}: {
  headers: any[];
  grid: any;
}) {
  return (
    <div
      style={{
        gridTemplateColumns: `repeat(${headers.length + 1}, minmax(0, 1fr))`,
      }}
      className={
        "tw-grid tw-border tw-bg-[#6F8FAF] tw-font-medium tw-text-xs tw-items-center tw-text-white tw-rounded-lg"
      }
    >
      {headers &&
        headers.map((header: any, index: number) => (
          <p
            key={index}
            className="last:tw-border-r-0 tw-border-r tw-p-4 tw-border-black/20 tw-uppercase"
          >
            {header}
          </p>
        ))}
      <p

        className="last:tw-border-r-0 tw-border-r tw-p-4 tw-border-black/20 tw-uppercase"
      >
        Actions
      </p>
    </div>
  );
};

CustomTable.Value = function TableValue({
  values,
  grid,
  viewTitle,
  handleView,
  handleEdit,
  handleDelete,
  isView = true,
  isEdit = false,
  isDelete = false,
}: {
  values: any[];
  grid: any;
  viewTitle?: any;
  handleView?: any;
  handleEdit?: any;
  handleDelete?: any;
  isView?: any;
  isEdit?: any;
  isDelete?: boolean;
}) {
  return (
    <div
      style={{
        gridTemplateColumns: `repeat(${values.length + 1}, minmax(0, 1fr))`,
      }}
      className={
        "tw-grid tw-font-semibold tw-text-sm tw-items-center tw-mt-1 tw-border tw-border-black/20 tw-rounded-lg hover:tw-bg-blue-100 tw-transition-all tw-duration-300"
      }
    >
      {values &&
        values.map((value: any, index: number) => (
          <div
            key={index}
            className="last:tw-border-r-0 tw-border-r tw-p-2 tw-h-full tw-flex tw-items-center tw-border-black/20"
          >
            {value}
          </div>
        ))}
      <div className="tw-grid tw-grid-cols-3 tw-gap-6 tw-items-center tw-p-2 tw-px-6">
        {isView &&
          <button onClick={handleView}>
            <Tooltip placement="top" title={viewTitle}>
              <div className="tw-h-8 tw-w-full tw-rounded-lg tw-border tw-text-green-800 tw-border-green-800 tw-flex tw-justify-center tw-items-center hover:tw-bg-green-500 hover:tw-text-white hover:tw-border-none tw-transition-all tw-duration-300">
                <LuFileSpreadsheet size={15} />
              </div>
            </Tooltip>
          </button>
        }
        {isEdit && <button onClick={handleEdit}>
          <Tooltip placement="top" title={"Edit"}>
            <div className="tw-h-8 tw-w-full tw-rounded-lg tw-border tw-text-blue-800 tw-border-blue-800 tw-flex tw-justify-center tw-items-center hover:tw-bg-blue-500 hover:tw-text-white hover:tw-border-none tw-transition-all tw-duration-300">
              <MdOutlineEdit size={15} />
            </div>
          </Tooltip>
        </button>}
        {isDelete && <button onClick={handleDelete}>
          <Tooltip placement="top" title={"Delete"}>
            <div className="tw-h-8 tw-w-full tw-rounded-lg tw-border tw-text-red-800 tw-border-red-800 tw-flex tw-justify-center tw-items-center hover:tw-bg-red-500 hover:tw-text-white hover:tw-border-none tw-transition-all tw-duration-300">
              <MdDeleteOutline size={16} />
            </div>
          </Tooltip>
        </button>}
      </div>
    </div>
  );
};

export default CustomTable;
