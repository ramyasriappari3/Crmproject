import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';

import Accordion from '@Components/accordion/Accordion'
import { useAppDispatch, useAppSelector } from '@Src/app/hooks';
import useParkingHook from './ParkingHooks';
import CustomDropdown from '@Components/custom-dropdown/CustomDropdown';
import CustomTextField from '@Components/custom-input/CustomTextField';
import { FlatActions, ValidationsActions } from '../../redux/features/create.parking.info.slice';
import FloorsRangeAccordion from './FloorsRangeAccordion';
import DisplayField from './DisplayField';

// Types
interface Option {
  value: string;
  label: string;
}

interface FlatAccordionProps {
  basis_of_no_of_eligible_car_parking: string;
  viewOnly: boolean;
}

interface AddFlatProps {
  project_id: string | undefined;
  tower_id: string | undefined;
  basis_of_no_of_eligible_car_parking: string;
  flatOptions: Option[];
  setFlatOptions: React.Dispatch<React.SetStateAction<Option[]>>;
}

interface FlatCardProps {
  basis_of_no_of_eligible_car_parking: string;
  flat: string;
  no_of_car_parkings: string;
  handleDeleteFlat: (flat: string) => void;
  viewOnly: boolean;
}

// Main Component
const FlatAccordion: React.FC<FlatAccordionProps> = ({ basis_of_no_of_eligible_car_parking, viewOnly }) => {
  const dispatch = useAppDispatch();
  const { parkingDetails } = useParkingHook();
  const { project_id, tower_id } = useParams();

  const sizeOptions = useAppSelector((state: any) => state.parkingInfo.flatSizes);
  const typeOptions = useAppSelector((state: any) => state.parkingInfo.flatTypes);

  const [flatOptions, setFlatOptions] = useState<Option[]>([]);

  const flatsRanges = useMemo(() =>
    Object.keys(parkingDetails?.[basis_of_no_of_eligible_car_parking || ""] || {}),
    [parkingDetails, basis_of_no_of_eligible_car_parking]);

  const getFlatDetails = useCallback((flat_range: string) =>
    parkingDetails?.[basis_of_no_of_eligible_car_parking || ""]?.[flat_range],
    [parkingDetails, basis_of_no_of_eligible_car_parking]);

  const handleDeleteFlat = useCallback((flat_range: string) => {
    dispatch(FlatActions({
      action_type: "DELETE",
      project_id,
      tower_id,
      basis_of_no_of_eligible_car_parking,
      flat_range,
    }));

    const options: Option[] = basis_of_no_of_eligible_car_parking === "flat_types" ? typeOptions : sizeOptions;
    const updatedOptions: Option[] = flat_range.split("_").reduce((acc: Option[], flat: string) => {
      const filteredOptions = options.filter((option: Option) => option.value === flat);
      return [...acc, ...filteredOptions];
    }, flatOptions);

    setFlatOptions(updatedOptions);
  }, [dispatch, basis_of_no_of_eligible_car_parking, typeOptions, sizeOptions, flatOptions]);

  useEffect(() => {
    setFlatOptions(basis_of_no_of_eligible_car_parking === "flat_types" ? typeOptions : sizeOptions);
  }, [basis_of_no_of_eligible_car_parking, typeOptions, sizeOptions]);

  // useEffect(() => {
  //   dispatch(ValidationsActions({
  //     action_type: "FLAT",
  //     flat: flatOptions.length === 0
  //   }));
  // }, [dispatch, flatOptions]);

  return (
    <Accordion tailwindStyle={"tw-bg-[#F7D1CD] tw-border-2 tw-border-black"}>
      <Accordion.Title>
        {basis_of_no_of_eligible_car_parking === "flat_sizes" ? "Flat Sizes" : "Flat Types"}
      </Accordion.Title>
      <Accordion.Content>
        {flatOptions.length > 0 && !viewOnly && (
          <AddFlat
            project_id={project_id}
            tower_id={tower_id}
            basis_of_no_of_eligible_car_parking={basis_of_no_of_eligible_car_parking}
            flatOptions={flatOptions}
            setFlatOptions={setFlatOptions}
          />
        )}
        <div className='tw-mt-6 tw-flex tw-flex-col tw-gap-6'>
          {flatsRanges.map((flat: string) => (
            <FlatCard
              key={flat}
              basis_of_no_of_eligible_car_parking={basis_of_no_of_eligible_car_parking}
              flat={flat}
              no_of_car_parkings={getFlatDetails(flat)?.no_of_car_parkings}
              handleDeleteFlat={handleDeleteFlat}
              viewOnly={viewOnly}
            />
          ))}
        </div>
      </Accordion.Content>
    </Accordion>
  )
}

// Sub-components
const AddFlat: React.FC<AddFlatProps> = React.memo(({
  project_id,
  tower_id,
  basis_of_no_of_eligible_car_parking,
  flatOptions,
  setFlatOptions,
}) => {
  const dispatch = useAppDispatch();
  const [flatValues, setFlatValues] = useState<Option[]>([]);
  const [flatValuesErr, setFlatValuesErr] = useState<boolean>(false);
  const [noOfParkings, setNoOfParkings] = useState<string>('');
  const [noOfParkingErrMessage, setNoOfParkingErr] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const handleAddCriteria = useCallback(() => {
    setFormSubmitted(true);
    if (!flatValuesErr && !noOfParkingErrMessage) {
      dispatch(FlatActions({
        action_type: "ADD",
        project_id,
        tower_id,
        basis_of_no_of_eligible_car_parking,
        flat_range: flatValues.map((flat: Option) => flat.value).join("_"),
        no_of_car_parkings: noOfParkings,
      }));

      const updatedOptions = flatOptions.filter(
        (option: Option) => !flatValues.some((selected: Option) => selected.value === option.value)
      );

      setFlatOptions(updatedOptions);
      setFlatValues([]);
      setNoOfParkings('');
      setFormSubmitted(false);
    }
  }, [dispatch, basis_of_no_of_eligible_car_parking, flatValues, noOfParkings, flatOptions, setFlatOptions, flatValuesErr, noOfParkingErrMessage]);

  return (
    <div className="-tw-ml-10 tw-p-4 tw-rounded-b-lg tw-shadow-xl  tw-border tw-border-t-0 tw-border-black/10">
      <p className="tw-text-lg tw-font-semibold tw-text-black tw-mb-2">
        Add Flat ranges
      </p>
      <div className="tw-grid tw-grid-cols-3 tw-gap-4">
        <CustomDropdown
          label={basis_of_no_of_eligible_car_parking === "flat_types" ? "Select Flat Types" : "Select Flat Sizes"}
          validationRules={["required"]}
          multi={true}
          selectedvalues={flatValues}
          setSelectedValues={setFlatValues}
          searchable={false}
          selectPlaceholder={"Select an item"}
          searchPlaceholder={"Search item"}
          options={flatOptions}
          sticky={true}
          setIsError={setFlatValuesErr}
          formSubmitted={formSubmitted}
        />
        <CustomTextField
          name=""
          placeholder="Enter no. of parkings"
          label="No. of parkings"
          value={noOfParkings}
          onChange={(data) => setNoOfParkings(data.target.value)}
          validationRules={["numeric", "required", "min_1", "max_100"]}
          formSubmitted={formSubmitted}
          onFocus={() => { }}
          setIsError={setNoOfParkingErr}
          isPassword={false}
        />
        <div className="tw-flex tw-flex-col tw-items-end tw-mt-5">
          <button
            onClick={handleAddCriteria}
            className="tw-p-3 tw-px-6 tw-text-white tw-w-1/2 tw-font-semibold tw-bg-blue-500 tw-rounded-lg tw-text-sm"
          >
            Add Criteria
          </button>
        </div>
      </div>
    </div>
  );
});

const FlatCard: React.FC<FlatCardProps> = React.memo(({
  basis_of_no_of_eligible_car_parking,
  flat,
  no_of_car_parkings,
  handleDeleteFlat,
  viewOnly
}) => (
  <div>
    <div className='tw-flex tw-justify-between'>
      <div className='tw-flex tw-gap-8'>
        <DisplayField
          label={"Flats"}
          value={flat.split("_").map((f: string) => basis_of_no_of_eligible_car_parking === "flat_sizes" ? f + " sft" : f).join(", ")}
        />
        <DisplayField label={"No. of parking"} value={no_of_car_parkings} />
      </div>
      {!viewOnly && (
        <div className='tw-flex tw-items-end tw-gap-4'>
          <button
            onClick={() => handleDeleteFlat(flat)}
            className='tw-h-8 tw-w-8 tw-flex tw-justify-center tw-items-center tw-text-white tw-bg-red-500 tw-rounded-lg'
          >
            <MdDelete size={15} />
          </button>
        </div>
      )}
    </div>
    <FloorsRangeAccordion flat_range={flat} viewOnly={viewOnly} />
  </div>
));

export default FlatAccordion;