import React, { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';

import Accordion from '@Components/accordion/Accordion'
import { useAppDispatch, useAppSelector } from '@Src/app/hooks';
import { OptionsActions } from '../../redux/features/create.parking.info.slice';
import DisplayField from './DisplayField';
import LocationAccordion from './LocationAccordion';
import { toast } from 'react-toastify';

// Interfaces
interface OptionAccordionProps {
    flat_range: string;
    floor_range: string;
    viewOnly: boolean;
}

interface OptionCardProps {
    flat_range: string;
    floor_range: string;
    total_no_of_parkings: number;
    option: string;
    index: number;
    handleDeleteOption: (option: string) => void;
    viewOnly: boolean;
}


type ParkingInfo = {
    no_of_parkings: number;
    back_to_back: boolean;
};

type ParkingObject = Record<string, ParkingInfo>;

// Main Component
const OptionAccordion: React.FC<OptionAccordionProps> = ({ flat_range, floor_range, viewOnly }) => {
    const dispatch = useAppDispatch();
    const { project_id, tower_id } = useParams<{ project_id: string; tower_id: string }>();
    const [existingObjects, setExistingObjects] = useState(new Set<string>());

    console.log(existingObjects, "existingObjects");

    const { parkingDetails, total_no_of_parkings, options, locationLength, initialLocationOptions } = useAppSelector((state: any) => {
        const details = state.parkingInfo.parkingDetails || {};
        const basis = details.basis_of_no_of_eligible_car_parking;
        return {
            parkingDetails: details,
            total_no_of_parkings: details[basis]?.[flat_range]?.no_of_car_parkings,
            options: Object.keys(details[basis]?.[flat_range]?.floor_ranges[floor_range]?.options || {}),
            locationLength: state.parkingInfo.locations.length,
            initialLocationOptions: state.parkingInfo.locations
        };
    });

    const indexedLocationOptions = React.useMemo(() => {
        return initialLocationOptions.reduce((acc: Record<number, string>, option: any, index: number) => {
            acc[index] = option.value;
            return acc;
        }, {} as Record<number, string>);
    }, [initialLocationOptions]);

    const sortLocations = React.useCallback((locations: Record<string, any>) => {
        return Object.fromEntries(
            Object.entries(locations).sort(([a], [b]) => {
                const indexA = Object.values(indexedLocationOptions).indexOf(a);
                const indexB = Object.values(indexedLocationOptions).indexOf(b);
                return indexA - indexB;
            })
        );
    }, [indexedLocationOptions]);

    const deleteObject = useCallback((object: ParkingObject) => {
        const sortedObject = sortLocations(object);
        const objectString = JSON.stringify(sortedObject);
        setExistingObjects(prevObjects => {
            const newObjects = new Set(prevObjects);
            newObjects.delete(objectString);
            return newObjects;
        });
    }, [sortLocations]);

    const addUniqueObject = useMemo(() => {
        return (newObject: ParkingObject): boolean => {
            const sortedObject = sortLocations(newObject);
            const objectString = JSON.stringify(sortedObject);
            if (!existingObjects.has(objectString)) {
                setExistingObjects(prevObjects => {
                    const newObjects = new Set(prevObjects);
                    newObjects.add(objectString);
                    return newObjects;
                });
                return true;
            }
            return false;
        };
    }, [sortLocations, existingObjects]);

    const handleAddOption = React.useCallback(() => {
        dispatch(OptionsActions({
            action_type: "ADD",
            project_id,
            tower_id,
            basis_of_no_of_eligible_car_parking: parkingDetails.basis_of_no_of_eligible_car_parking,
            flat_range,
            floor_range,
            option: new Date().getTime().toString()
        }));
    }, [dispatch, parkingDetails, flat_range, floor_range]);

    const handleDeleteOption = (option: string) => {
        dispatch(OptionsActions({
            action_type: "DELETE",
            project_id,
            tower_id,
            basis_of_no_of_eligible_car_parking: parkingDetails.basis_of_no_of_eligible_car_parking,
            flat_range,
            floor_range,
            option,
        }));
    };

    const currentObject = parkingDetails[parkingDetails.basis_of_no_of_eligible_car_parking][flat_range].floor_ranges[floor_range].options;

    const currTotalNoOfOptionsAvailable = total_no_of_parkings >= 2 ? (Number(total_no_of_parkings - 1) * Number(locationLength)) + (Number(locationLength) * Number(total_no_of_parkings)) : (Number(locationLength) * Number(total_no_of_parkings));

    return (
        <Accordion tailwindStyle="tw-bg-[#D1B3C4] tw-border-2 tw-border-black">
            <Accordion.Title>Options</Accordion.Title>
            <Accordion.Content>
                {!viewOnly && options.length < currTotalNoOfOptionsAvailable &&
                    <AddOptionButton handleAddOption={handleAddOption} />}
                <OptionList
                    options={options}
                    flat_range={flat_range}
                    floor_range={floor_range}
                    total_no_of_parkings={total_no_of_parkings}
                    handleDeleteOption={handleDeleteOption}
                    viewOnly={viewOnly}
                    addUniqueObject={addUniqueObject}
                    deleteObject={deleteObject}
                    currentObject={currentObject}
                />
            </Accordion.Content>
        </Accordion>
    )
}

// Sub-components
const AddOptionButton: React.FC<{ handleAddOption: () => void }> = ({ handleAddOption, }) => {


    return (
        <div className='tw-flex tw-justify-between mb-4 tw-pt-2 -tw-ml-10 tw-p-4 tw-rounded-b-lg tw-shadow-xl tw-mb-6 tw-border tw-border-t-0 tw-border-black/10'>
            <p className="tw-text-lg tw-font-semibold tw-text-black tw-mb-4">Add Option</p>
            <button
                onClick={handleAddOption}
                className="tw-p-3 tw-px-6 tw-text-white tw-w-fit tw-font-semibold tw-bg-blue-500 tw-rounded-lg tw-text-sm"
            >
                Add option
            </button>
        </div>
    )
};

const OptionList: React.FC<Omit<OptionCardProps, 'option' | 'index'> & { options: string[], addUniqueObject: (newObject: ParkingObject) => boolean, deleteObject: (object: ParkingObject) => void, currentObject: any }> = (props) => (
    <div className='tw-flex tw-flex-col tw-gap-6'>
        {props.options.map((option, index) => (
            <OptionCard
                key={option}
                {...props}
                option={option}
                index={index}
                addUniqueObject={props.addUniqueObject}
                deleteObject={props.deleteObject}
                currentObject={props.currentObject || {}}
            />
        ))}
    </div>
);

const OptionCard: React.FC<OptionCardProps & { addUniqueObject: (newObject: ParkingObject) => boolean, deleteObject: (object: ParkingObject) => void, currentObject: any }> = ({
    flat_range,
    floor_range,
    total_no_of_parkings,
    option,
    index,
    handleDeleteOption,
    viewOnly,
    addUniqueObject,
    deleteObject,
    currentObject
}) => (
    <div>
        <div className='tw-flex tw-justify-between'>
            <div className='tw-flex tw-gap-8'>
                <DisplayField
                    label="Option"
                    value={`Option ${index + 1}`}
                />
            </div>
            {!viewOnly && (
                <div className='tw-flex tw-items-end tw-gap-4'>
                    <button
                        onClick={() => {
                            deleteObject(currentObject[option]?.locations);
                            handleDeleteOption(option);
                        }}
                        className='tw-h-8 tw-w-8 tw-flex tw-justify-center tw-items-center tw-text-white tw-bg-red-500 tw-rounded-lg'
                    >
                        <MdDelete size={15} />
                    </button>
                </div>
            )}
        </div>
        <LocationAccordion
            flat_range={flat_range}
            floor_range={floor_range}
            total_no_of_parkings={total_no_of_parkings}
            option={option}
            viewOnly={viewOnly}
            addUniqueObject={addUniqueObject}
            handleDeleteOption={handleDeleteOption}
            deleteObject={deleteObject}
        />
    </div>
);

export default OptionAccordion;