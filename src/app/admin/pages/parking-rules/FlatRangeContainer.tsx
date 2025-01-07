import CustomDropdown from "@Components/custom-dropdown/CustomDropdown";
import CustomTextField from "@Components/custom-input/CustomTextField";
import { FlatActions } from "@Src/app/admin/redux/features/create.parking.info.slice";
import { useAppDispatch, useAppSelector } from "@Src/app/hooks";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useParkingHook from "./ParkingHooks";
import CustomTable from "@Components/custom-table/CustomTable";

const FlatRangeContainer = () => {
  const dispatch = useAppDispatch();
  const { parkingDetails } = useParkingHook();

  const sizeOptions = useAppSelector(
    (state: any) => state.parkingInfo.flatSizes
  );

  const typeOptions = useAppSelector(
    (state: any) => state.parkingInfo.flatTypes
  );

  const navigate = useNavigate();
  const {
    project_id,
    tower_id,
    basis_of_no_of_eligible_car_parking
  } = useParams();

  const grid = 4;
  const [flatOptions, setFlatOptions] = useState([]);

  console.log(flatOptions, "flatOptions");

  const flatsRanges = Object.keys(
    parkingDetails?.[project_id || ""].towers[tower_id || ""][
    basis_of_no_of_eligible_car_parking || ""
    ]
  );

  const getFlatDetails = (flat_range: any) => {
    return parkingDetails?.[project_id || ""].towers[tower_id || ""][
      basis_of_no_of_eligible_car_parking || ""
    ][flat_range];
  };

  console.log(parkingDetails, "allParkingCriterias");

  const handleNavigate = (
    flat_range: any,
    no_of_car_parkings: any,
    allocation_basis: any
  ) => {
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
      allocation_basis
    );
  };

  useEffect(() => {
    if (basis_of_no_of_eligible_car_parking === "based_on_flat_type") {
      setFlatOptions(typeOptions);
    } else {
      setFlatOptions(sizeOptions);
    }
  }, [])

  return (
    <div className="tw-min-h-[85vh] tw-w-full tw-bg-white tw-mt-6 tw-p-6 tw-shadow-lg tw-rounded-2xl">
      <CustomTable>
        <CustomTable.TableTitles
          titles={{
            project_id,
            tower_id,
            basis_of_no_of_eligible_car_parking,
          }}
        />
        <div className="tw-mt-5 tw-flex tw-flex-col tw-gap-4">
          {flatOptions && flatOptions.length > 0 && (
            <AddFlat
              project_id={project_id}
              tower_id={tower_id}
              basis_of_no_of_eligible_car_parking={
                basis_of_no_of_eligible_car_parking
              }
              flatOptions={flatOptions}
              setFlatOptions={setFlatOptions}
            />
          )}
        </div>
        <p className="tw-text-3xl tw-font-semibold tw-text-black tw-mb-4">
          Flat range list :
        </p>
        <CustomTable.Header
          headers={["Flats", "No. of parkings", "Floor Range Basis"]}
          grid={grid}
        />
        {flatsRanges?.map((flat: any, index: any) => (
          <CustomTable.Value
            values={[
              flat.split("_").join(", "),
              getFlatDetails(flat)?.no_of_car_parkings,
              getFlatDetails(flat)?.allocation_basis === "floor_range"
                ? "Yes"
                : "No",
              // <button
              //   onClick={() =>
              //     handleNavigate(
              //       flat,
              //       getFlatDetails(flat)?.no_of_car_parkings,
              //       getFlatDetails(flat)?.allocation_basis
              //     )
              //   }
              //   className="tw-p-2 tw-px-3 tw-bg-green-600 tw-text-white tw-rounded-md tw-text-xs"
              // >
              //   {getFlatDetails(flat)?.allocation_basis === "floor_range"
              //     ? "Create Floor Ranges"
              //     : "Create Options"}
              // </button>,
            ]}
            grid={grid}
            handleView={() =>
              handleNavigate(
                flat,
                getFlatDetails(flat)?.no_of_car_parkings,
                getFlatDetails(flat)?.allocation_basis
              )}
            viewTitle={getFlatDetails(flat)?.allocation_basis === "floor_range"
              ? "Create Floor Ranges"
              : "Create Options"}
          />
        ))}
      </CustomTable>
    </div>
  );
};

export default FlatRangeContainer;

const AddFlat = ({
  project_id,
  tower_id,
  basis_of_no_of_eligible_car_parking,
  flatOptions,
  setFlatOptions,
}: {
  project_id: any;
  tower_id: any;
  basis_of_no_of_eligible_car_parking: any;
  flatOptions: any;
  setFlatOptions: any;
}) => {
  const dispatch = useAppDispatch();

  const [flatValues, setFlatValues] = useState<any>([]);
  const [noOfParkings, setNoOfParkings] = useState<any>(null);
  const [floorRules, setFloorRules] = useState<any>([
    {
      value: "no_floor_range",
      label: "No",
    },
  ]);

  const reset = () => {
    setFlatValues([]);
    setNoOfParkings("");
    setFloorRules([
      {
        value: "no_floor_range",
        label: "No",
      },
    ]);
  };

  const handleAddCriteria = () => {
    dispatch(
      FlatActions({
        action_type: "ADD",
        project_id,
        tower_id,
        basis_of_no_of_eligible_car_parking,
        flat_range: basis_of_no_of_eligible_car_parking === "based_on_no_criteria" ?
          flatOptions.map((flat: any) => flat.value).join("_")
          : flatValues.map((flat: any) => flat.value).join("_"),
        no_of_car_parkings: noOfParkings,
        allocation_basis: floorRules[0].value,
      })
    );

    const updatedOptions = flatOptions.filter(
      (option: any) =>
        !flatValues.some((selected: any) => selected.value === option.value)
    );

    setFlatOptions(updatedOptions);



    reset();
  };

  return (
    <div className="tw-shadow-md tw-rounded-lg tw-border tw-p-4 tw-mb-4">
      <p className="tw-text-3xl tw-font-semibold tw-text-black tw-mb-4">
        Add Flat ranges
      </p>
      <div className="tw-grid tw-grid-cols-3 tw-gap-4">
        {basis_of_no_of_eligible_car_parking !== "based_on_no_criteria" && 
        <CustomDropdown
          label={basis_of_no_of_eligible_car_parking === "based_on_flat_type" ? "Select Flat Types" : "Select Flat Sizes"}
          validationRules={["required"]}
          multi={true}
          selectedvalues={flatValues}
          setSelectedValues={setFlatValues}
          searchable={false}
          selectPlaceholder={"Select an item"}
          searchPlaceholder={"Search item"}
          options={flatOptions}
        />}
        <CustomTextField
          name=""
          placeholder="Enter no. of parkings"
          label="No. of parkings"
          value={noOfParkings}
          onChange={(data) => {
            const { value } = data.target;
            setNoOfParkings(value);
          }}
          validationRules={["required"]}
          formSubmitted={false}
          onFocus={() => { }}
          setIsError={() => { }}
          isPassword={false}
        />
        <CustomDropdown
          label="Floors Ranges Basis"
          validationRules={["required"]}
          multi={false}
          selectedvalues={floorRules}
          setSelectedValues={setFloorRules}
          searchable={false}
          selectPlaceholder={"Select an item"}
          searchPlaceholder={"Search item"}
          options={[
            {
              value: "floor_range",
              label: "Yes",
            },
            {
              value: "no_floor_range",
              label: "No",
            },
          ]}
        />
        <div className="tw-col-span-3 tw-flex tw-justify-end">
          <button
            onClick={handleAddCriteria}
            className=" tw-p-3 tw-px-6 tw-text-white tw-font-semibold tw-bg-blue-500 tw-rounded-lg tw-text-sm"
          >
            Add Criteria
          </button>
        </div>
      </div>
    </div>
  );
};
