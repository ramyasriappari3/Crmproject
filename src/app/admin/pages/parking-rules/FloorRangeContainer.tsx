import CustomDropdown from "@Components/custom-dropdown/CustomDropdown";
import CustomTextField from "@Components/custom-input/CustomTextField";
import CustomTable from "@Components/custom-table/CustomTable";
import { FloorRangeActions } from "@Src/app/admin/redux/features/create.parking.info.slice";
import { useAppDispatch, useAppSelector } from "@Src/app/hooks";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const FloorRangeContainer = () => {
  const navigate = useNavigate();

  const {
    project_id,
    tower_id,
    basis_of_no_of_eligible_car_parking,
    flat_range,
    no_of_car_parkings,
    allocation_basis,
  } = useParams();

  const grid = 3;
  const parkingDetails = useAppSelector(
    (state: any) => state.parkingInfo.parkingDetails
  );

  const total_no_of_floors = useAppSelector(
    (state: any) => state.parkingInfo.noOfFloors
  );

  const floorRanges = Object.keys(
    parkingDetails?.[project_id || ""].towers[tower_id || ""][
    basis_of_no_of_eligible_car_parking || ""
    ][flat_range || ""][allocation_basis || ""]
  );

  const getFloorsDetails = (floor_range: any) => {
    return parkingDetails?.[project_id || ""].towers[tower_id || ""][
      basis_of_no_of_eligible_car_parking || ""
    ][flat_range || ""][allocation_basis || ""][floor_range];
  };

  const handleNavigate = (floor_range: any, allocation_location: any) => {
    if (allocation_location === "multi") {
      navigate(
        "/crm/parking/" +
        project_id +
        "/" +
        tower_id +
        "/" +
        basis_of_no_of_eligible_car_parking +
        "/" +
        flat_range +
        "/" +
        no_of_car_parkings +
        "/" +
        allocation_basis +
        "/" +
        floor_range +
        "/" +
        allocation_location
      );
    } else {
      navigate(
        "/crm/parking/" +
        project_id +
        "/" +
        tower_id +
        "/" +
        basis_of_no_of_eligible_car_parking +
        "/" +
        flat_range +
        "/" +
        no_of_car_parkings +
        "/" +
        allocation_basis +
        "/" +
        floor_range +
        "/" +
        allocation_location +
        "/option1"
      );
    }
  };

  console.log(parkingDetails, "allParkingCriterias");
  return (
    <div className="tw-min-h-[85vh] tw-w-full tw-bg-white tw-mt-6 tw-p-6 tw-shadow-lg tw-rounded-2xl">
      <div className="tw-flex tw-flex-col">
        <CustomTable>
          <CustomTable.TableTitles
            titles={{
              project_id,
              tower_id,
              basis_of_no_of_eligible_car_parking,
              flat_range,
              allocation_basis,
            }}
          />
          <AddFloorRanges
            project_id={project_id}
            tower_id={tower_id}
            basis_of_no_of_eligible_car_parking={
              basis_of_no_of_eligible_car_parking
            }
            flat_range={flat_range}
            no_of_car_parkings={no_of_car_parkings}
            allocation_basis={allocation_basis}
            total_no_of_floors={total_no_of_floors}
          />
          <p className="tw-text-3xl tw-font-semibold tw-text-black tw-mb-4">
            Floor range list :
          </p>
          <CustomTable.Header
            headers={["Floors", "Multi-locations Options"]}
            grid={grid}
          />

          {floorRanges?.map((floors: any, index: any) => (
            <CustomTable.Value
              values={[
                floors === "0_99999"
                  ? "All Floors"
                  : floors.split("_").join(" - "),
                getFloorsDetails(floors)?.allocation_location === "multi"
                  ? "Yes"
                  : "No",
                // <button
                //   onClick={() => {
                //     handleNavigate(
                //       floors,
                //       getFloorsDetails(floors)?.allocation_location
                //     );
                //   }}
                //   className="tw-p-2 tw-px-3 tw-bg-green-600 tw-text-white tw-rounded-md tw-text-xs"
                // >
                //   {getFloorsDetails(floors)?.allocation_location === "multi"
                //     ? "Create Options"
                //     : "Allocate Basement"}
                // </button>,
              ]}
              grid={grid}
              handleView={() => {
                handleNavigate(
                  floors,
                  getFloorsDetails(floors)?.allocation_location
                );
              }}
              viewTitle={getFloorsDetails(floors)?.allocation_location === "multi"
                ? "Create Options"
                : "Allocate Basement"}
            />
          ))}
        </CustomTable>
      </div>
    </div>
  );
};

export default FloorRangeContainer;

const AddFloorRanges = ({
  project_id,
  tower_id,
  basis_of_no_of_eligible_car_parking,
  flat_range,
  no_of_car_parkings,
  allocation_basis,
  total_no_of_floors
}: {
  project_id: any;
  tower_id: any;
  basis_of_no_of_eligible_car_parking: any;
  flat_range: any;
  no_of_car_parkings: any;
  allocation_basis: any;
  total_no_of_floors: any
}) => {
  const dispatch = useAppDispatch();
  const [currFloorRange, setCurrFloorRange] = useState<any>({
    min: "0",
    max: "",
  });

  const [multiLocation, setMultiLocation] = useState<any>([
    {
      value: "non-multi",
      label: "No",
    },
  ]);

  const reset = () => {
    setCurrFloorRange({
      min: String(Number(currFloorRange.max) + 1),
      max: "",
    });
    setMultiLocation([
      {
        value: "non-multi",
        label: "No",
      },
    ]);
  };

  const handleAddFloorRanges = () => {
    dispatch(
      FloorRangeActions({
        action_type: "ADD",
        project_id,
        tower_id,
        basis_of_no_of_eligible_car_parking,
        flat_range,
        no_of_car_parkings,
        allocation_basis,
        floor_range:
          allocation_basis === "no_floor_range"
            ? "0_99999"
            : [currFloorRange.min, currFloorRange.max].join("_"),
        allocation_location: multiLocation[0].value,
      })
    );

    reset();
  };
  if (currFloorRange.min >= total_no_of_floors) {
    return null;
  }

  return (

    <div className="tw-shadow-md tw-rounded-lg tw-border tw-p-4 tw-mb-4">
      <p className="tw-text-3xl tw-font-semibold tw-text-black tw-mb-4">
        {allocation_basis === "floor_range"
          ? "Create Floor Ranges"
          : "Get multi-locations options for all floors"}
      </p>
      <div className="tw-grid tw-grid-cols-3 tw-gap-4">
        {allocation_basis === "floor_range" && (
          <>
            <CustomTextField
              name=""
              placeholder="Enter min. range"
              label="Min. range"
              value={currFloorRange.min}
              onChange={(data) => {
                const { value } = data.target;
                setCurrFloorRange((prev: any) => ({
                  ...prev,
                  min: value,
                }));
              }}
              validationRules={["required"]}
              formSubmitted={false}
              onFocus={() => { }}
              setIsError={() => { }}
              isPassword={false}
              disabled={true}
            />
            <CustomTextField
              name=""
              placeholder="Enter max. range"
              label="Max. range"
              value={currFloorRange.max}
              onChange={(data) => {
                const { value } = data.target;
                setCurrFloorRange((prev: any) => ({
                  ...prev,
                  max: value,
                }));
              }}
              validationRules={["numeric", "min_" + currFloorRange.min, "max_" + total_no_of_floors, "required"]}
              formSubmitted={false}
              onFocus={() => { }}
              setIsError={() => { }}
              isPassword={false}
            />
          </>
        )}
        <CustomDropdown
          label="Multi locations"
          validationRules={["required"]}
          multi={false}
          selectedvalues={multiLocation}
          setSelectedValues={setMultiLocation}
          searchable={false}
          selectPlaceholder={"Select an item"}
          searchPlaceholder={"Search item"}
          options={[
            {
              value: "multi",
              label: "Yes",
            },
            {
              value: "non-multi",
              label: "No",
            },
          ]}
        />
        <div className="tw-col-span-4 tw-flex tw-justify-end">
          <button
            onClick={handleAddFloorRanges}
            className=" tw-p-3 tw-px-6 tw-text-white tw-font-semibold tw-bg-blue-500 tw-rounded-lg tw-text-sm"
          >
            Add Floor ranges
          </button>
        </div>
      </div>
    </div>
  );
};
