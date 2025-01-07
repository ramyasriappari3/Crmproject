import CustomDropdown from "@Components/custom-dropdown/CustomDropdown";
import { EligibilityActions, getParkingProjectTowerFlatSizes, getParkingProjectTowerFlatTypes, getParkingProjectTowerFloors, getParkingProjectTowerLocations } from "@Src/app/admin/redux/features/create.parking.info.slice";
import { useAppDispatch, useAppSelector } from "@Src/app/hooks";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useParkingHook from "./ParkingHooks";
import { hideSpinner, showSpinner } from "@Src/features/global/globalSlice";
import CustomTable from "@Components/custom-table/CustomTable";

const BasisEligibilityContainer = () => {
  const dispatch = useAppDispatch();
  const { project_id, tower_id } = useParams();
  const { parkingDetails } = useParkingHook();

  const [allFlats, setAllFlats] = useState();
  console.log(parkingDetails, "allParkingCriterias");

  const getLocations = async () => {
    dispatch(showSpinner());

    await dispatch(
      getParkingProjectTowerLocations({
        url_name: "crm_get_parking_towers_locations",
        params_data: { project_id, tower_id },
      })
    ).unwrap();

    dispatch(hideSpinner());
  }

  const getFloors = async () => {
    dispatch(showSpinner());

    await dispatch(
      getParkingProjectTowerFloors({
        url_name: "crm_get_parking_towers_floors",
        params_data: { tower_id },
      })
    ).unwrap();

    dispatch(hideSpinner());
  }

  const getFlatTypes = async () => {
    dispatch(showSpinner());

    const { data } = await dispatch(
      getParkingProjectTowerFlatTypes({
        url_name: "crm_get_parking_towers_flat_types",
        params_data: { tower_id },
      })
    ).unwrap();

    const flats = data.map((flat: any) => flat.saleable_area).join("_");
    setAllFlats(flats);

    dispatch(hideSpinner());
  }

  const getFlatSizes = async () => {
    dispatch(showSpinner());

    await dispatch(
      getParkingProjectTowerFlatSizes({
        url_name: "crm_get_parking_towers_flat_sizes",
        params_data: { tower_id },
      })
    ).unwrap();

    dispatch(hideSpinner());
  }

  useEffect(() => {
    getFlatTypes();
    getFlatSizes();
    getFloors();
    getLocations();
  }, [])

  return (
    <div className="tw-min-h-[85vh] tw-w-full tw-bg-white tw-mt-6 tw-p-6 tw-shadow-lg tw-rounded-2xl">
      <div className="tw-flex tw-flex-col tw-gap-4">
        <CustomTable>
          <CustomTable.TableTitles titles={{ tower_id }} />
          <BasisEligibility project_id={project_id} tower_id={tower_id} allFlats={allFlats} />
        </CustomTable>

      </div>
    </div>
  );
};

export default BasisEligibilityContainer;

const BasisEligibility = (
  { project_id, tower_id, allFlats }: { project_id: any; tower_id: any; allFlats: any }
) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const parkingDetails = useAppSelector(
    (state: any) => state.parkingInfo.parkingDetails
  );

  const [eligilityBasis, setEligibilityBasis] = useState([
    {
      value: "based_on_flat_size_range",
      label: "Floor Sizes",
    },
  ]);

  const [isBasis, setIsBasis] = useState<boolean>();

  const handleAddEligibility = () => {
    dispatch(
      EligibilityActions({
        action_type: "ADD",
        project_id,
        tower_id,
        basis_of_no_of_eligible_car_parking: eligilityBasis[0].value,
        all_flats_id: allFlats
      })
    );

    navigate("/crm/parking/" + project_id + "/" + tower_id + "/" + eligilityBasis[0].value);
  };

  const handleViewEligibility = () => {
    navigate("/crm/parking/" + project_id + "/" + tower_id + "/" + eligilityBasis[0].value);
  }

  useEffect(() => {
    if (parkingDetails[project_id || ""].towers[tower_id || ""].basis_of_no_of_eligible_car_parking === eligilityBasis[0].value) {
      setIsBasis(true);
    } else {
      setIsBasis(false);
    }
  }, [eligilityBasis])

  return (
    <div className="tw-shadow-md tw-rounded-lg tw-border tw-p-4 tw-mb-4">
      <p className="tw-text-3xl tw-font-semibold tw-text-black tw-mb-4">
        Select Parking Basis
      </p>
      <div className="tw-flex tw-flex-col tw-justify-between tw-h-[50vh] tw-gap-4">
        <CustomDropdown
          label=""
          validationRules={[]}
          multi={false}
          selectedvalues={eligilityBasis}
          setSelectedValues={setEligibilityBasis}
          searchable={false}
          selectPlaceholder={"Select an item"}
          searchPlaceholder={"Search item"}
          options={[
            {
              value: "based_on_flat_size_range",
              label: "Floor Sizes",
            },
            {
              value: "based_on_flat_type",
              label: "Floor Types",
            },
            {
              value: "based_on_no_criteria",
              label: "No Criteria"
            },
          ]}
        />
        <div className="tw-flex tw-justify-end tw-w-full">
          {isBasis ?
            <button
              onClick={handleViewEligibility}
              className=" tw-p-3 tw-px-6 tw-text-white tw-font-semibold tw-bg-blue-500 tw-rounded-lg tw-text-sm"
            >
              View Criteria
            </button>
            : <button
              onClick={handleAddEligibility}
              className=" tw-p-3 tw-px-6 tw-text-white tw-font-semibold tw-bg-blue-500 tw-rounded-lg tw-text-sm"
            >
              Add Criteria
            </button>}
        </div>
      </div>
    </div>
  );
};
