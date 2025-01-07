import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';

import Accordion from '@Components/accordion/Accordion';
import { useAppDispatch, useAppSelector } from '@Src/app/hooks';
import DisplayField from './DisplayField';
import CustomDropdown from '@Components/custom-dropdown/CustomDropdown';
import CustomCountField from '@Components/custom-input/CustomCountField';
import { LocationAllocationActions, OptionsActions } from '../../redux/features/create.parking.info.slice';
import { toast } from 'react-toastify';

interface LocationAccordionProps {
    flat_range: string;
    floor_range: string;
    total_no_of_parkings: number;
    option: string;
    viewOnly: boolean;
    handleDeleteOption: (option: string) => void;
}

interface Option {
    value: string | boolean;
    label: string;
}


type ParkingInfo = {
    no_of_parkings: number;
    back_to_back: boolean;
};

type ParkingObject = Record<string, ParkingInfo>;

const LocationAccordion: React.FC<LocationAccordionProps & { addUniqueObject: (newObject: ParkingObject) => boolean, deleteObject: (currentObject: ParkingObject) => void }> = ({
    flat_range,
    floor_range,
    total_no_of_parkings,
    option,
    viewOnly,
    addUniqueObject,
    handleDeleteOption,
    deleteObject
}) => {
    const { project_id = "", tower_id = "" } = useParams<{ project_id: string; tower_id: string }>();
    const dispatch = useAppDispatch();

    const { parkingDetails, basis_of_no_of_eligible_car_parking, locations, initialLocationOptions } = useAppSelector(
        (state: any) => ({
            parkingDetails: state.parkingInfo.parkingDetails,
            basis_of_no_of_eligible_car_parking: state.parkingInfo.parkingDetails?.basis_of_no_of_eligible_car_parking || "",
            locations: Object.keys(state.parkingInfo.parkingDetails?.[state.parkingInfo.parkingDetails?.basis_of_no_of_eligible_car_parking || ""]?.[flat_range]?.floor_ranges[floor_range]?.options[option]?.locations || {}),
            initialLocationOptions: state.parkingInfo.locations
        })
    );


    const [location, setLocations] = useState<Option[]>([]);
    const [locationOptions, setLocationOptions] = useState<Option[]>(initialLocationOptions);
    const [noOfParking, setNoOfParking] = useState<number>(1);
    const [backToBack, setBackToBack] = useState<Option[]>([{ value: false, label: "No" }]);
    const [remaining_parking, set_remaining_parking] = useState(total_no_of_parkings);

    const getLocationDetails = (loc: string) => {
        return parkingDetails?.[basis_of_no_of_eligible_car_parking]?.[flat_range]?.floor_ranges[floor_range]?.options[option]?.locations[loc];
    }

    const handleDeleteLocation = (loc: string) => {
        dispatch(LocationAllocationActions({
            action_type: "DELETE",
            project_id,
            tower_id,
            basis_of_no_of_eligible_car_parking,
            flat_range,
            total_no_of_parkings,
            floor_range,
            option,
            location: loc
        }));

        deleteObject(parkingDetails?.[basis_of_no_of_eligible_car_parking]?.[flat_range]?.floor_ranges[floor_range]?.options[option]?.locations);

        setLocationOptions([
            ...locationOptions,
            ...initialLocationOptions.filter((opt: Option) => opt.value === loc)
        ]);

        set_remaining_parking(remaining_parking + getLocationDetails(loc).no_of_parkings);
    };


    useEffect(() => {
        if (remaining_parking === 0) {
            const newObject = parkingDetails?.[basis_of_no_of_eligible_car_parking]?.[flat_range]?.floor_ranges[floor_range]?.options[option].locations;
            const isUnique = addUniqueObject(newObject);
            if (!isUnique) {
                handleDeleteOption(option);
                toast.error("Option already exists");
            }
        }
    }, [remaining_parking]);
    return (
        <Accordion tailwindStyle="tw-bg-[#B392AC] tw-border-2 tw-border-black">
            <Accordion.Title>Parking Locations</Accordion.Title>
            <Accordion.Content>
                {remaining_parking > 0 && !viewOnly && (
                    <LocationAllocations
                        project_id={project_id}
                        tower_id={tower_id}
                        basis_of_no_of_eligible_car_parking={basis_of_no_of_eligible_car_parking}
                        flat_range={flat_range}
                        total_no_of_parkings={total_no_of_parkings}
                        floor_range={floor_range}
                        option={option}
                        remaining_parking={remaining_parking}
                        set_remaining_parking={set_remaining_parking}
                        initialLocationOptions={initialLocationOptions}
                        location={location}
                        locationOptions={locationOptions}
                        noOfParking={noOfParking}
                        backToBack={backToBack}
                        setLocations={setLocations}
                        setLocationOptions={setLocationOptions}
                        setNoOfParking={setNoOfParking}
                        setBackToBack={setBackToBack}
                    />
                )}
                <LocationList
                    locations={locations}
                    getLocationDetails={getLocationDetails}
                    initialLocationOptions={initialLocationOptions}
                    handleDeleteLocation={handleDeleteLocation}
                    viewOnly={viewOnly}
                />
            </Accordion.Content>
        </Accordion>
    )
}

interface LocationAllocationsProps {
    project_id: string;
    tower_id: string;
    basis_of_no_of_eligible_car_parking: string;
    flat_range: string;
    total_no_of_parkings: number;
    floor_range: string;
    option: string;
    remaining_parking: number;
    set_remaining_parking: React.Dispatch<React.SetStateAction<number>>;
    initialLocationOptions: Option[];
    location: Option[];
    locationOptions: Option[];
    noOfParking: number;
    backToBack: Option[];
    setLocations: React.Dispatch<React.SetStateAction<Option[]>>;
    setLocationOptions: React.Dispatch<React.SetStateAction<Option[]>>;
    setNoOfParking: React.Dispatch<React.SetStateAction<number>>;
    setBackToBack: React.Dispatch<React.SetStateAction<Option[]>>;
}

const LocationAllocations: React.FC<LocationAllocationsProps> = ({
    project_id,
    tower_id,
    basis_of_no_of_eligible_car_parking,
    flat_range,
    total_no_of_parkings,
    floor_range,
    option,
    remaining_parking,
    set_remaining_parking,
    initialLocationOptions,
    location,
    locationOptions,
    noOfParking,
    backToBack,
    setLocations,
    setLocationOptions,
    setNoOfParking,
    setBackToBack,
}) => {
    const dispatch = useAppDispatch();
    const [locationErr, setLocationErr] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

    const handleAddLocation = () => {
        setFormSubmitted(true);
        if (!locationErr) {
            dispatch(
                LocationAllocationActions({
                    action_type: "ADD",
                    project_id,
                    tower_id,
                    basis_of_no_of_eligible_car_parking,
                    flat_range,
                    total_no_of_parkings,
                    floor_range,
                    option,
                    location: location[0]?.value as string,
                    no_of_parkings: noOfParking,
                    back_to_back: backToBack[0].value as boolean,
                })
            );

            const updatedOptions = locationOptions.filter(
                (opt: Option) => !location.some((selected: Option) => selected.value === opt.value)
            );

            setLocationOptions(updatedOptions);
            setLocations([]);
            set_remaining_parking(remaining_parking - noOfParking);
            setNoOfParking(1);
            setFormSubmitted(false);
            setBackToBack([{ value: false, label: "No" }]);
        }
    };

    useEffect(() => {
        if (locationOptions.length === 1) {
            setNoOfParking(remaining_parking);
        }
    }, [locationOptions, remaining_parking]);

    return (
        <div className="-tw-ml-10 tw-p-4 tw-rounded-b-lg tw-shadow-xl  tw-border tw-border-t-0 tw-border-black/10">
            <p className="tw-text-lg tw-font-semibold tw-text-black tw-mb-2">
                Add Locations ( {remaining_parking} parkings can be allocated to this location )
            </p>
            <div className="tw-grid tw-grid-cols-3 tw-gap-4">
                <CustomDropdown
                    label="Select location"
                    validationRules={["required"]}
                    multi={false}
                    selectedvalues={location}
                    setSelectedValues={setLocations}
                    searchable={false}
                    selectPlaceholder="Select an item"
                    searchPlaceholder="Search item"
                    options={locationOptions}
                    setIsError={setLocationErr}
                    formSubmitted={formSubmitted}
                    sticky={true}
                />
                <div className='tw-flex tw-gap-4'>
                    <div className='tw-w-1/2'>
                        <CustomCountField
                            label="No. of parking"
                            value={noOfParking}
                            setValue={setNoOfParking}
                            maxValue={remaining_parking}
                            disabled={locationOptions.length === 1}
                        />
                    </div>
                    <div className='tw-w-1/2'>
                        {noOfParking === 2 &&
                            <CustomDropdown
                                label="Back to back"
                                validationRules={["required"]}
                                multi={false}
                                selectedvalues={backToBack}
                                setSelectedValues={setBackToBack}
                                searchable={false}
                                selectPlaceholder="Select an item"
                                searchPlaceholder="Search item"
                                options={[
                                    { value: true, label: "Yes" },
                                    { value: false, label: "No" },
                                ]}
                                sticky={true}
                            />}
                    </div>
                </div>
                <div className="tw-flex tw-flex-col tw-items-end tw-mt-5">
                    <button
                        onClick={handleAddLocation}
                        className="tw-w-2/3 tw-p-3 tw-px-6 tw-text-white tw-font-semibold tw-bg-blue-500 tw-rounded-lg tw-text-sm"
                    >
                        Allocate location
                    </button>
                </div>
            </div>
        </div>
    );
};

interface LocationListProps {
    locations: string[];
    getLocationDetails: (loc: string) => any;
    initialLocationOptions: Option[];
    handleDeleteLocation: (loc: string) => void;
    viewOnly: boolean;
}

const LocationList: React.FC<LocationListProps> = ({
    locations,
    getLocationDetails,
    initialLocationOptions,
    handleDeleteLocation,
    viewOnly
}) => (
    <div className='-tw-ml-10 tw-mt-6 tw-grid tw-grid-cols-3 tw-gap-6 tw-px-4'>
        {locations.map((location) => (
            <LocationCard
                key={location}
                location={location}
                back_to_back={getLocationDetails(location).back_to_back}
                no_of_parkings={getLocationDetails(location).no_of_parkings}
                initialLocationOptions={initialLocationOptions}
                handleDeleteLocation={handleDeleteLocation}
                viewOnly={viewOnly}
            />
        ))}
    </div>
);

interface LocationCardProps {
    location: string;
    back_to_back: boolean;
    no_of_parkings: number;
    initialLocationOptions: Option[];
    handleDeleteLocation: (loc: string) => void;
    viewOnly: boolean;
}

const LocationCard: React.FC<LocationCardProps> = ({
    location,
    back_to_back,
    no_of_parkings,
    initialLocationOptions,
    handleDeleteLocation,
    viewOnly
}) => {
    return (
        <div className='tw-bg-gradient-to-br tw-from-gray-800 tw-to-gray-900 tw-p-4 tw-rounded-lg tw-shadow-md tw-border tw-border-yellow-500/50 tw-transition-all tw-duration-300 hover:tw-shadow-lg hover:tw-scale-[1.01] hover:tw-border-yellow-500'>
            <div className='tw-flex tw-flex-col tw-gap-3'>
                <div className='tw-flex tw-justify-between tw-items-center'>
                    <span className='tw-text-lg tw-font-bold tw-text-yellow-400 tw-truncate tw-max-w-[70%]'>
                        {initialLocationOptions?.find((option: Option) => option.value === location)?.label}
                    </span>
                    {!viewOnly && (
                        <button
                            onClick={() => handleDeleteLocation(location)}
                            className='tw-group tw-h-8 tw-w-8 tw-flex tw-justify-center tw-items-center tw-bg-red-500/80 tw-rounded-md tw-transition-all tw-duration-300 hover:tw-bg-red-600'
                            aria-label="Delete location"
                        >
                            <MdDelete size={18} className='tw-text-white tw-transition-transform tw-duration-300 group-hover:tw-scale-110' />
                        </button>
                    )}
                </div>
                <div className='tw-flex tw-justify-between tw-items-stretch tw-bg-gray-700/50 tw-rounded-md tw-overflow-hidden'>
                    <div className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-flex-1 tw-p-2 tw-bg-blue-400/10'>
                        <span className='tw-text-xs tw-font-medium tw-text-yellow-300'>Parking Slots</span>
                        <span className='tw-text-xl tw-font-bold tw-text-blue-400'>{no_of_parkings}</span>
                    </div>
                    <div className='tw-w-[1px] tw-bg-yellow-500/30'></div>
                    <div className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-flex-1 tw-p-2'>
                        <span className='tw-text-xs tw-font-medium tw-text-yellow-300'>Back to Back</span>
                        <span className={`tw-text-lg tw-font-semibold ${back_to_back ? 'tw-text-green-400' : 'tw-text-red-400'}`}>
                            {back_to_back ? "Yes" : "No"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LocationAccordion;