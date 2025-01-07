import CustomTextField from "@Components/custom-input/CustomTextField";
import CustomTable from "@Components/custom-table/CustomTable";
import { OptionsActions } from "@Src/app/admin/redux/features/create.parking.info.slice";
import { useAppDispatch, useAppSelector } from "@Src/app/hooks";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const OptionsContainer = () => {
  const navigate = useNavigate();

  const {
    project_id,
    tower_id,
    basis_of_no_of_eligible_car_parking,
    flat_range,
    no_of_car_parkings,
    allocation_basis,
    floor_range,
    allocation_location,
  } = useParams();

  const grid = 3;

  const parkingDetails = useAppSelector(
    (state: any) => state.parkingInfo.parkingDetails
  );

  const locationNo = useAppSelector(
    (state: any) => state.parkingInfo.locations.length
  );

  const options = parkingDetails?.[project_id || ""].towers[tower_id || ""][
    basis_of_no_of_eligible_car_parking || ""
  ][flat_range || ""][allocation_basis || ""][floor_range || ""][
    allocation_location || ""
  ]?.no_of_locations_per_option
    ? Object.keys(
      parkingDetails?.[project_id || ""].towers[tower_id || ""][
        basis_of_no_of_eligible_car_parking || ""
      ][flat_range || ""][allocation_basis || ""][floor_range || ""][
        allocation_location || ""
      ]?.no_of_locations_per_option
    )
    : [];

  const getOptionDetails = (option: any) => {
    return parkingDetails?.[project_id || ""].towers[tower_id || ""][
      basis_of_no_of_eligible_car_parking || ""
    ][flat_range || ""][allocation_basis || ""][floor_range || ""][
      allocation_location || ""
    ]?.no_of_locations_per_option[option];
  };

  const handleNavigate = (option: any) => {
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
      "/" +
      option
    );
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
              floor_range,
              allocation_location,
            }}
          />
          <AddOptions
            project_id={project_id}
            tower_id={tower_id}
            basis_of_no_of_eligible_car_parking={
              basis_of_no_of_eligible_car_parking
            }
            flat_range={flat_range}
            allocation_basis={allocation_basis}
            floor_range={floor_range}
            allocation_location={allocation_location}
            locationNo={locationNo}
            no_of_car_parkings={no_of_car_parkings}
          />
          <p className="tw-text-3xl tw-font-semibold tw-text-black tw-mb-4">
            Option list :
          </p>
          <CustomTable.Header
            headers={["Option", "No. of locations"]}
            grid={grid}
          />

          {options &&
            options?.map((option: any, index: any) => (
              <CustomTable.Value
                values={[
                  "Option " + (index + 1),
                  getOptionDetails(option),
                  // <button
                  //   onClick={() => {
                  //     handleNavigate(option);
                  //   }}
                  //   className="tw-p-2 tw-px-3 tw-bg-green-600 tw-text-white tw-rounded-md tw-text-xs"
                  // >
                  //   Allocate Basement
                  // </button>,
                ]}
                grid={grid}
                handleView={() => {
                  handleNavigate(option);
                }}
                viewTitle={"Allocate Basement"}
              />
            ))}
        </CustomTable>
      </div>
    </div>
  );
};

export default OptionsContainer;

const AddOptions = ({
  project_id,
  tower_id,
  basis_of_no_of_eligible_car_parking,
  flat_range,
  allocation_basis,
  floor_range,
  allocation_location,
  locationNo,
  no_of_car_parkings
}: {
  project_id: any;
  tower_id: any;
  basis_of_no_of_eligible_car_parking: any;
  flat_range: any;
  allocation_basis: any;
  floor_range: any;
  allocation_location: any;
  locationNo: any;
  no_of_car_parkings: any
}) => {
  const dispatch = useAppDispatch();

  const [noOfOptions, setNoOfOptions] = useState("");

  const [optionValues, setOptionValues] = useState<any>({});

  useEffect(() => {
    if (noOfOptions) {
      const valueObject: { [key: string]: string } = {};
      const numOptions = Number(noOfOptions);

      // Create object with keys option1, option2, etc.
      for (let i = 1; i <= numOptions; i++) {
        valueObject[`option${i}`] = "";
      }

      // Update the state with the new valueObject
      setOptionValues(valueObject);
    } else {
      setOptionValues({});
    }
  }, [noOfOptions]);

  const handleAddFloorRanges = (option: any) => {
    dispatch(
      OptionsActions({
        action_type: "ADD",
        project_id,
        tower_id,
        basis_of_no_of_eligible_car_parking,
        flat_range,
        allocation_basis,
        floor_range,
        allocation_location,
        total_no_of_options: noOfOptions,
        no_of_locations_per_option: optionValues,
      })
    );

    setNoOfOptions("");
  };

  const handleOptionChange = (option: any, value: any) => {
    setOptionValues((prev: any) => ({
      ...prev,
      [option]: value,
    }));
  };

  return (
    <div className="tw-shadow-md tw-rounded-lg tw-border tw-p-4 tw-mb-4">
      <p className="tw-text-3xl tw-font-semibold tw-text-black tw-mb-4">
        Add Options
      </p>
      <div className="tw-flex tw-flex-col tw-gap-4">
        <div className="tw-w-1/4">
          <CustomTextField
            name=""
            placeholder="Enter no. of options"
            label="No. of options"
            value={noOfOptions}
            onChange={(data) => {
              const { value } = data.target;
              setNoOfOptions(value);
            }}
            validationRules={["required"]}
            formSubmitted={false}
            onFocus={() => { }}
            setIsError={() => { }}
            isPassword={false}
          />
        </div>
        {optionValues &&
          Object.keys(optionValues).map((option, index: number) => (
            <div
              className="tw-border tw-p-4 tw-rounded-lg tw-grid tw-grid-cols-2 tw-w-1/2 tw-items-center"
              key={index}
            >
              <p>Option {index + 1} :</p>
              <CustomTextField
                name=""
                placeholder="Enter no. of locations"
                label="No. of locations"
                value={optionValues[option]}
                onChange={(data) => {
                  const { value } = data.target;
                  handleOptionChange(option, value);
                }}
                validationRules={["numeric", "max_" + Math.min(locationNo, no_of_car_parkings), "required"]}
                formSubmitted={false}
                onFocus={() => { }}
                setIsError={() => { }}
                isPassword={false}
              />
            </div>
          ))}
        <div className="tw-col-span-4 tw-flex tw-justify-end">
          <button
            onClick={handleAddFloorRanges}
            className=" tw-p-3 tw-px-6 tw-text-white tw-font-semibold tw-bg-blue-500 tw-rounded-lg tw-text-sm"
          >
            Add Option
          </button>
        </div>
      </div>
    </div>
  );
};
