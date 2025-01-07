import CustomDropdown from "@Components/custom-dropdown/CustomDropdown";
import CustomCountField from "@Components/custom-input/CustomCountField";
import CustomTextField from "@Components/custom-input/CustomTextField";
import CustomTable from "@Components/custom-table/CustomTable";
import { LocationAllocationActions } from "@Src/app/admin/redux/features/create.parking.info.slice";
import { useAppDispatch, useAppSelector } from "@Src/app/hooks";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const LocationAllocationContainder = () => {
  const navigate = useNavigate();
  const grid = 3;
  const {
    project_id,
    tower_id,
    basis_of_no_of_eligible_car_parking,
    flat_range,
    no_of_car_parkings,
    allocation_basis,
    floor_range,
    allocation_location,
    option,
  } = useParams();

  const parkingDetails = useAppSelector(
    (state: any) => state.parkingInfo.parkingDetails
  );

  const initialLocationOptions = useAppSelector(
    (state: any) => state.parkingInfo.locations
  );


  const locations = Object.keys(
    parkingDetails?.[project_id || ""].towers[tower_id || ""][basis_of_no_of_eligible_car_parking || ""][
    flat_range || ""
    ][allocation_basis || ""][floor_range || ""][allocation_location || ""][
    option || ""
    ]
  );

  const getLocationDetails = (location: any) => {
    return parkingDetails?.[project_id || ""].towers[tower_id || ""][
      basis_of_no_of_eligible_car_parking || ""
    ][flat_range || ""][allocation_basis || ""][floor_range || ""][
      allocation_location || ""
    ][option || ""][location];
  };

  console.log(parkingDetails, "allParkingCriterias");

  const noOfLocationsPerOption =
    parkingDetails?.[project_id || ""].towers[tower_id || ""][
    basis_of_no_of_eligible_car_parking || ""
    ][flat_range || ""][allocation_basis || ""][floor_range || ""][
    allocation_location || ""
    ]["no_of_locations_per_option"][option || ""];

  const [remaining_parking, set_remaining_parking] = useState(Number(no_of_car_parkings) - noOfLocationsPerOption);

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
              option,
            }}
          />
          {locations.length < noOfLocationsPerOption && (
            <LocationAllocations
              project_id={project_id}
              tower_id={tower_id}
              basis_of_no_of_eligible_car_parking={
                basis_of_no_of_eligible_car_parking
              }
              flat_range={flat_range}
              no_of_car_parkings={no_of_car_parkings}
              allocation_basis={allocation_basis}
              floor_range={floor_range}
              allocation_location={allocation_location}
              option={option}
              remaining_parking={remaining_parking}
              set_remaining_parking={set_remaining_parking}
              initialLocationOptions={initialLocationOptions}
            />
          )}
          <p className="tw-text-3xl tw-font-semibold tw-text-black tw-mb-4">
            Locations list :
          </p>
          <CustomTable.Header
            headers={["Location", "Back to back", "No. of parkings"]}
            grid={grid}
          />
          {locations &&
            locations.map((location: any, index: any) => (
              <CustomTable.Value
                values={[
                  location,
                  getLocationDetails(location)?.back_to_back ? "Yes" : "no",
                  getLocationDetails(location)?.no_of_parkings,
                ]}
                grid={grid}
                isView={false}
              />
            ))}
        </CustomTable>
      </div>
    </div>
  );
};

export default LocationAllocationContainder;

const LocationAllocations = ({
  project_id,
  tower_id,
  basis_of_no_of_eligible_car_parking,
  flat_range,
  no_of_car_parkings,
  allocation_basis,
  floor_range,
  allocation_location,
  option,
  remaining_parking,
  set_remaining_parking,
  initialLocationOptions,
}: {
  project_id: any;
  tower_id: any;
  basis_of_no_of_eligible_car_parking: any;
  flat_range: any;
  no_of_car_parkings: any;
  allocation_basis: any;
  floor_range: any;
  allocation_location: any;
  option: any;
  remaining_parking: any;
  set_remaining_parking: any
  initialLocationOptions: any
}) => {
  const dispatch = useAppDispatch();

  const [location, setLocations] = useState<any>([]);
  const [noOfParking, setNoOfParking] = useState<any>(1);

  const [backToBack, setBackToBack] = useState<any>([
    {
      value: false,
      label: "No",
    },
  ]);



  const handleAddLocation = () => {
    dispatch(
      LocationAllocationActions({
        action_type: "ADD",
        project_id,
        tower_id,
        basis_of_no_of_eligible_car_parking,
        flat_range,
        no_of_car_parkings,
        allocation_basis,
        floor_range,
        allocation_location,
        option,
        location: location[0]?.value,
        no_of_parkings: noOfParking,
        back_to_back: backToBack[0].value,
      })
    );

    set_remaining_parking(remaining_parking - (noOfParking - 1));
    setNoOfParking(1);
  };

  return (
    <div className="tw-shadow-md tw-rounded-lg tw-border tw-p-4 tw-mb-4">
      <p className="tw-text-3xl tw-font-semibold tw-text-black tw-mb-4">
        Add Locations ( {remaining_parking - (noOfParking - 1)} remaining parking for this location )
      </p>
      <div className="tw-grid tw-grid-cols-3 tw-gap-4">
        <CustomDropdown
          label="Select location"
          validationRules={["required"]}
          multi={false}
          selectedvalues={location}
          setSelectedValues={setLocations}
          searchable={false}
          selectPlaceholder={"Select an item"}
          searchPlaceholder={"Search item"}
          options={initialLocationOptions}
        />

        <CustomCountField label={"No. of parking"} value={noOfParking} setValue={setNoOfParking} />

        {/* <CustomTextField
          name=""
          placeholder="Enter No. of parking"
          label="No. of parkings"
          value={noOfParking}
          onChange={(data) => {
            const { value } = data.target;
            setNoOfParking(value);
          }}
          validationRules={["required"]}
          formSubmitted={false}
          onFocus={() => { }}
          setIsError={() => { }}
          isPassword={false}
        /> */}
        {Number(noOfParking) >= 2 && <CustomDropdown
          label="Back to back"
          validationRules={["required"]}
          multi={false}
          selectedvalues={backToBack}
          setSelectedValues={setBackToBack}
          searchable={false}
          selectPlaceholder={"Select an item"}
          searchPlaceholder={"Search item"}
          options={[
            {
              value: true,
              label: "Yes",
            },
            {
              value: false,
              label: "No",
            },
          ]}
        />}
        <div className="tw-col-span-4 tw-flex tw-justify-end">
          <button
            onClick={handleAddLocation}
            className=" tw-p-3 tw-px-6 tw-text-white tw-font-semibold tw-bg-blue-500 tw-rounded-lg tw-text-sm"
          >
            Allocate location
          </button>
        </div>
      </div>
    </div>
  );
};
