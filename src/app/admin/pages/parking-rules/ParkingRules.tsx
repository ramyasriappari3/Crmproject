import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Dialog, TextField, Tooltip } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { IoMdArrowRoundBack } from 'react-icons/io';

import { useAppDispatch, useAppSelector } from '@Src/app/hooks';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import {
  CurrectRuleActions,
  EligibilityActions,
  getParkingProjectTowerFlatSizes,
  getParkingProjectTowerFlatTypes,
  getParkingProjectTowerFloors,
  getParkingProjectTowerLocations,
  postParkingRules,
  ValidationsActions
} from '../../redux/features/create.parking.info.slice';
import useParkingHook from './ParkingHooks';
import CustomDropdown from '@Components/custom-dropdown/CustomDropdown';
import FlatAccordion from './FlatAccordion';
import { toast } from 'react-toastify';
import { GiFamilyTree } from "react-icons/gi";
import { PiTreeStructureFill } from "react-icons/pi";

const ParkingRules = () => {
  // Hooks
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { project_id, tower_id, rule_id } = useParams();
  const { parkingDetails } = useParkingHook();
  const { currTower, rule_object } = useLocation().state;

  // State
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [eligilityBasis, setEligibilityBasis] = useState<any>([]);
  const [isBasis, setIsBasis] = useState<boolean>(false);
  const [showText, setShowText] = useState(false);
  const [jsonInText, setJsonInText] = useState('');

  console.log(startDate);

  // Memoized values
  const basis_of_no_of_eligible_car_parking = useMemo(() =>
    parkingDetails?.basis_of_no_of_eligible_car_parking || "flat_sizes",
    [parkingDetails, project_id, tower_id]);

  const flatSizes = useAppSelector(
    useCallback((state: any) =>
      state.parkingInfo.flatSizes,
      [tower_id])
  );

  const flatTypes = useAppSelector(
    useCallback((state: any) =>
      state.parkingInfo.flatTypes,
      [tower_id])
  );

  const noOfFloors = useAppSelector(
    useCallback((state: any) =>
      state.parkingInfo.noOfFloors,
      [tower_id])
  );

  const locationsArr = useAppSelector(
    useCallback((state: any) =>
      state.parkingInfo.locations,
      [tower_id])
  );
  // Callbacks
  const handleDateChange = useCallback((name: string, value: any) => {
    if (name === "startDate") {
      setStartDate(value);
      // Reset end date if it's before the new start date
      if (endDate && value > endDate) {
        setEndDate(null);
      }
    } else {
      setEndDate(value);
    }
  }, [endDate]);

  const getLocations = useCallback(async () => {
    dispatch(showSpinner());
    await dispatch(
      getParkingProjectTowerLocations({
        url_name: "crm_get_parking_towers_locations",
        params_data: { project_id, tower_id },
      })
    ).unwrap();
    dispatch(hideSpinner());
  }, [dispatch, project_id, tower_id]);

  const getFloors = useCallback(async () => {
    dispatch(showSpinner());
    await dispatch(
      getParkingProjectTowerFloors({
        url_name: "crm_get_parking_towers_floors",
        params_data: { tower_id },
      })
    ).unwrap();
    dispatch(hideSpinner());
  }, [dispatch, tower_id]);

  const getFlatTypes = useCallback(async () => {
    dispatch(showSpinner());
    await dispatch(
      getParkingProjectTowerFlatTypes({
        url_name: "crm_get_parking_towers_flat_types",
        params_data: { tower_id },
      })
    ).unwrap();
    dispatch(hideSpinner());
  }, [dispatch, tower_id]);

  const getFlatSizes = useCallback(async () => {
    dispatch(showSpinner());
    await dispatch(
      getParkingProjectTowerFlatSizes({
        url_name: "crm_get_parking_towers_flat_sizes",
        params_data: { tower_id },
      })
    ).unwrap();
    dispatch(hideSpinner());
  }, [dispatch, tower_id]);

  const handleAddEligibility = useCallback(() => {
    dispatch(
      EligibilityActions({
        action_type: "ADD",
        project_id,
        tower_id,
        basis_of_no_of_eligible_car_parking: eligilityBasis?.[0]?.value,
      })
    );
  }, [dispatch, project_id, tower_id, eligilityBasis]);

  //  Validate the parking rule JSON
  const validateParkingAllocationJSON = (json: any, flatsLen: any, totalFloors: any) => {
    //check if start and end date have been added
    if (!startDate || startDate === null) {
      throw new Error(`Please add Start Date`);
    }

    if (startDate == "Invalid Date") {
      throw new Error(`Please enter valid Start Date`);
    }

    if (!endDate || endDate === null) {
      throw new Error(`Please add End Date`);
    }

    if (endDate == "Invalid Date") {
      throw new Error(`Please enter valid End Date`);
    }

    if (new Date(endDate) < new Date(startDate)) {
      throw new Error(`End Date must be the same or after the Start Date`);
    }

    // Convert totalFloors to number if it's a string
    totalFloors = Number(totalFloors);

    // Check if all flats have been added
    const addedFlats = Object.keys(json[basis_of_no_of_eligible_car_parking]);
    const indiFlats = addedFlats.flatMap((item: any) => item.split('_'));
    if (indiFlats?.length !== flatsLen) {
      throw new Error(`Please add ${flatsLen > 1 ? "all" : ""} the given flat${flatsLen > 1 ? "s" : ""}`);
    }

    for (let flat of addedFlats) {
      const flatObject = json[basis_of_no_of_eligible_car_parking][flat];

      // Check if all floors have been added
      const floorRanges = Object.keys(flatObject?.floor_ranges);

      // Check if the last range ends with the total number of floors
      const lastRange = floorRanges[floorRanges.length - 1];

      if (floorRanges.length === 0 || lastRange?.split("_")[1] != totalFloors) {
        throw new Error(`Please add all floor for the flat${flat.split("_").length > 1 ? "s" : ""} ${flat.split("_").join(", ")}`);
      }

      // Check if each floor range has at least one option
      for (let range of floorRanges) {
        const options = flatObject.floor_ranges[range].options;
        if (Object.keys(options).length === 0) {
          throw new Error(`Please add an option for floors ${range.split("_").join(" to ")}, in flat${flat.split("_").length > 1 ? "s" : ""} ${flat.split("_").join(", ")}`);
        }

        // Check if the total number of parkings in each option matches the flat's total
        for (let optionId in options) {
          const option = options[optionId];
          let totalParkingsInOption = 0;
          for (let location in option.locations) {
            totalParkingsInOption += option.locations[location].no_of_parkings;
          }
          if (totalParkingsInOption !== Number(flatObject.no_of_car_parkings)) {
            throw new Error(`Please allocate all parkings to the location in option ${optionId}, in floor range ${range.split("_").join(" to ")}, for flat${flat.split("_").length > 1 ? "s" : ""} ${flat.split("_").join(", ")}`);
          }
        }
      }
    }

    // If we've made it this far, the JSON is valid
    return true;
  }

  //JSON to text
  const convertParkingAllocationToText = (json: any) => {
    let result = "";

    for (const [flatSize, flatData] of Object.entries(json[basis_of_no_of_eligible_car_parking]) as [any, any]) {
      const parkings = flatData.no_of_car_parkings;
      const floorRanges = flatData.floor_ranges;
      // Format flat sizes
      const flatSizes = flatSize.split("_");
      let formattedFlatSize;
      if (flatSizes.length > 1) {
        const lastIndex = flatSizes.length - 1;
        formattedFlatSize = flatSizes.slice(0, lastIndex).join(", ") + " & " + flatSizes[lastIndex];
      } else {
        formattedFlatSize = flatSizes[0];
      }

      result += `${parkings} parking for ${formattedFlatSize}. \n`;

      for (const [floorRange, floorData] of Object.entries(floorRanges) as [any, any]) {
        const [start, end] = floorRange.split('_');
        const options = floorData.options;
        const optionCount = Object.keys(options).length;

        result += `          From floor ${start} to ${end}, customer has ${optionCount} option${optionCount > 1 ? 's' : ''} \n`;

        let optionNumber = 1;
        for (const option of Object.values(options) as any) {
          result += `                      In option-${optionNumber}, \n`;
          const locations = option.locations;
          const locationDescriptions = [];

          for (const [location, locationData] of Object.entries(locations) as [any, any]) {
            console.log(locationData, "locationData");
            locationDescriptions.push(`                                 ${locationData.no_of_parkings} ${locationData.back_to_back === true ? " back-to-back " : ""}parking${locationData.no_of_parkings > 1 ? 's' : ''} in ${locationsArr.filter((loc: any) => loc.value === location)[0]?.label} \n`);
          }

          result += locationDescriptions.join('') + ' \n';
          optionNumber++;
        }
      }

      result = result + ' \n';
    }

    return result
  }

  const handleValidateRule = useCallback(async () => {

    try {
      const isValid = validateParkingAllocationJSON(
        parkingDetails,
        basis_of_no_of_eligible_car_parking === "flat_sizes" ?
          flatSizes.map((flat: any) => flat.value)?.length : flatTypes.map((flat: any) => flat.value)?.length,
        noOfFloors
      );

      if (isValid) {
        const text = convertParkingAllocationToText(parkingDetails);
        setJsonInText(text);
        setShowText(true);

      }
    } catch (error: any) {
      toast.error(error.message);
    }

  }, [parkingDetails, startDate, endDate]);

  const submitRule = async () => {
    dispatch(showSpinner());
    await dispatch(
      postParkingRules({
        url_name: "crm_post_parking_rules",
        body: {
          project_id,
          tower_ids: [tower_id],
          rule_json: parkingDetails,
          rule_text: jsonInText,
          rule_start_date: startDate,
          rule_end_date: endDate,
          in_inforce: true
        },
      })
    ).unwrap();
    toast.success("Parking rule added successfully!");
    navigate(-1);
  }

  // Effects
  useEffect(() => {
    if (parkingDetails.basis_of_no_of_eligible_car_parking) {
      setIsBasis(true);
    } else {
      setIsBasis(false);
    }
  }, [parkingDetails]);

  useEffect(() => {
    if (rule_object) {
      dispatch(CurrectRuleActions({
        action_type: "ADD",
        project_id,
        tower_id,
        currect_rule: rule_object?.rule_json
      }));
    }
  }, [rule_object]);

  useEffect(() => {
    // dispatch(ValidationsActions({}));
    if (rule_object) {
      setStartDate(rule_object.rule_start_date)
      setEndDate(rule_object.rule_end_date)
      setJsonInText(rule_object.rule_text)
    }

    setEligibilityBasis(basis_of_no_of_eligible_car_parking === "flat_sizes" ?
      [{ value: "flat_sizes", label: "Flat Sizes" }] :
      [{ value: "flat_types", label: "Flat Types" }]
    )
    getFlatTypes();
    getFlatSizes();
    getFloors();
    getLocations();
  }, [dispatch, basis_of_no_of_eligible_car_parking, getFlatTypes, getFlatSizes, getFloors, getLocations, rule_object]);

  const memoizedFlatAccordion = useMemo(() => {
    if (!isBasis) return null;
    return (
      <FlatAccordion
        basis_of_no_of_eligible_car_parking={eligilityBasis[0]?.value}
        viewOnly={!!rule_id}
      />
    );
  }, [isBasis, eligilityBasis, rule_id]);

  // Render helpers
  const renderDatePicker = (label: string, value: any, onChange: (value: any) => void, isEndDate: boolean = false) => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        className='tw-w-full'
        label={label}
        inputFormat="dd-MM-yyyy"
        disabled={!!rule_id || (isEndDate && !startDate)}
        value={value}
        onChange={onChange}
        minDate={isEndDate ? startDate : undefined}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
              "& label": {
                left: "unset",
                transformOrigin: "left",
                fontSize: "0.9rem",
              },
              "& legend": {
                textAlign: "left",
                fontSize: "0.68rem",
              },
            }}
            inputProps={{
              ...params.inputProps,
              style: { marginTop: 2, fontSize: 14, marginBottom: 2, fontWeight: 550 }
            }}
            error={false}
          />
        )}
        InputAdornmentProps={{ style: { marginRight: 15 } }}
      />
    </LocalizationProvider>
  );

  // JSX
  return (
    <div className="tw-min-h-[85vh] tw-w-full tw-bg-white tw-p-6 tw-shadow-lg tw-rounded-2xl tw-mt-4">
      <div className="tw-flex tw-justify-between">
        <div className="tw-flex tw-gap-4 tw-text-black tw-text-3xl tw-font-bold tw-items-start tw-mb-4">
          <button onClick={() => navigate(-1)}>
            <IoMdArrowRoundBack />
          </button>
          <p className=''>
            <span className='tw-text-red-700'>{currTower?.tower_name}</span>'s Parking Rules
          </p>
        </div>
        <div className='tw-flex tw-gap-4 tw-justify-end tw-w-1/2'>
          <div className='tw-w-1/2'>
            <p className='tw-mb-2 tw-text-xs'>
              Parking allocation basis :
            </p>
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
                { value: "flat_sizes", label: "Flat Sizes" },
                { value: "flat_types", label: "Flat Types" },
              ]}
              disable={isBasis}
            />
          </div>
          {!isBasis && (
            <div className='tw-mt-6'>
              <button
                onClick={handleAddEligibility}
                className="tw-p-[11px] tw-px-4 tw-text-white tw-font-semibold tw-bg-blue-500 tw-rounded-lg tw-text-sm"
              >
                Add Criteria
              </button>
            </div>
          )}
        </div>
      </div>
      {isBasis &&
        <div className='tw-flex tw-gap-4 tw-justify-between tw-items-center tw-mb-4'>
          {rule_id ?
            <Tooltip title={"Rule summary"} placement="right">
              <button onClick={() => setShowText(true)} className='tw-p-3 tw-flex tw-gap-2 tw-border-2 tw-border-orange-500 tw-text-orange-500 tw-rounded-lg tw-text-lg hover:tw-bg-orange-500 hover:tw-text-white tw-transition-all tw-duration-500'>
                <PiTreeStructureFill size={25} />
              </button>
            </Tooltip> : <div></div>}
          <div className='tw-flex tw-justify-end tw-gap-4'>
            <div className='tw-w-1/3'>
              {renderDatePicker("Start date", startDate, (value) => handleDateChange("startDate", value))}
            </div>
            <div className='tw-w-1/3'>
              {renderDatePicker("End date", endDate, (value) => handleDateChange("endDate", value), true)}
            </div>
          </div>
        </div>}

      {memoizedFlatAccordion}
      {!rule_id && isBasis && (
        <div className='tw-w-full tw-justify-end tw-flex'>
          <button
            className='tw-mt-6 tw-px-4 tw-py-2 tw-bg-green-500 tw-text-white tw-rounded-lg'
            onClick={handleValidateRule}
          >
            Create Parking Rule
          </button>
        </div>
      )}

      <Dialog open={showText} onClose={() => setShowText(false)}>
        <div className='tw-flex tw-flex-col tw-gap-4 tw-p-6'>
          <p className='tw-text-xl tw-font-bold'>Parking rule summary</p>
          <pre
            className='tw-text-lg tw-text-blue-800 tw-font-inherit tw-whitespace-pre-wrap tw-break-words'
            style={{ fontFamily: 'inherit' }}
          >
            {jsonInText}
          </pre>
          <div className='tw-flex tw-justify-between tw-gap-6 tw-text-sm'>
            <button onClick={() => setShowText(false)} className='tw-mt-6 tw-px-4 tw-py-2 tw-bg-red-500 tw-text-white tw-rounded-lg'>
              {rule_id ? "Close" : "Cancel and change rule"}
            </button>
            {!rule_id && <button onClick={submitRule} className='tw-mt-6 tw-px-4 tw-py-2 tw-bg-green-500 tw-text-white tw-rounded-lg'>
              Submit rule
            </button>}
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default ParkingRules;