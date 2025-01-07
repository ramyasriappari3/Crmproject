import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { MdDelete } from 'react-icons/md';

import Accordion from '@Components/accordion/Accordion'
import CustomTextField from '@Components/custom-input/CustomTextField';
import { useAppDispatch, useAppSelector } from '@Src/app/hooks';
import { FloorRangeActions } from '../../redux/features/create.parking.info.slice';
import OptionAccordion from './OptionAccordion';
import DisplayField from './DisplayField';

// Interfaces
interface FloorsRangeAccordionProps {
    flat_range: string;
    viewOnly: boolean;
}

interface AddFloorRangesProps {
    project_id: string;
    tower_id: string;
    basis_of_no_of_eligible_car_parking: string;
    flat_range: string;
    total_no_of_floors: number;
    currFloorRange: { min: string; max: string };
    setCurrFloorRange: React.Dispatch<React.SetStateAction<{ min: string; max: string }>>;
}

interface FloorCardProps {
    flat_range: string;
    floor_range: string;
    handleDeleteFloorRange: () => void;
    viewOnly: boolean;
}

// Main Component
const FloorsRangeAccordion: React.FC<FloorsRangeAccordionProps> = ({ flat_range, viewOnly }) => {
    const { project_id, tower_id } = useParams<{ project_id: string; tower_id: string }>();
    const dispatch = useAppDispatch();

    const { parkingDetails, basis_of_no_of_eligible_car_parking, total_no_of_floors, floorRanges } = useAppSelector(
        (state: any) => ({
            parkingDetails: state.parkingInfo.parkingDetails,
            basis_of_no_of_eligible_car_parking: state.parkingInfo.parkingDetails?.basis_of_no_of_eligible_car_parking,
            total_no_of_floors: state.parkingInfo.noOfFloors,
            floorRanges: Object.keys(state.parkingInfo.parkingDetails?.[state.parkingInfo.parkingDetails?.basis_of_no_of_eligible_car_parking || ""]?.[flat_range || ""]?.floor_ranges || {})
        })
    );

    const [currFloorRange, setCurrFloorRange] = useState<{ min: string; max: string }>({
        min: "0",
        max: "",
    });

    const handleDeleteFloorRange = () => {
        dispatch(FloorRangeActions({
            action_type: "DELETE",
            project_id,
            tower_id,
            basis_of_no_of_eligible_car_parking,
            flat_range,
        }));
        setCurrFloorRange({ min: "0", max: "" });
    }

    return (
        <Accordion tailwindStyle="tw-bg-[#E8C2CA] tw-border-2 tw-border-black">
            <Accordion.Title>Floor Ranges</Accordion.Title>
            <Accordion.Content>
                {Number(currFloorRange.min) <= Number(total_no_of_floors) && !viewOnly && (
                    <AddFloorRanges
                        project_id={project_id || ""}
                        tower_id={tower_id || ""}
                        basis_of_no_of_eligible_car_parking={basis_of_no_of_eligible_car_parking}
                        flat_range={flat_range}
                        total_no_of_floors={total_no_of_floors}
                        currFloorRange={currFloorRange}
                        setCurrFloorRange={setCurrFloorRange}
                    />
                )}
                {!viewOnly && floorRanges.length > 0 && (
                    <DeleteAllButton handleDeleteFloorRange={handleDeleteFloorRange} />
                )}
                <FloorRangesList
                    floorRanges={floorRanges}
                    flat_range={flat_range}
                    handleDeleteFloorRange={handleDeleteFloorRange}
                    viewOnly={viewOnly}
                />
            </Accordion.Content>
        </Accordion>
    )
}

// Sub-components
const AddFloorRanges: React.FC<AddFloorRangesProps> = ({
    project_id,
    tower_id,
    basis_of_no_of_eligible_car_parking,
    flat_range,
    total_no_of_floors,
    currFloorRange,
    setCurrFloorRange
}) => {
    const dispatch = useAppDispatch();
    const [maxValueErr, setMaxValueErr] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

    const reset = () => {
        setFormSubmitted(false);
        setCurrFloorRange({
            min: String(Number(currFloorRange.max) + 1),
            max: "",
        });
    };

    const handleMaxFloors = () => {
        setCurrFloorRange(prev => ({ ...prev, max: String(total_no_of_floors) }));
    }

    const handleAddFloorRanges = () => {
        setFormSubmitted(true);
        if (!maxValueErr) {
            dispatch(FloorRangeActions({
                action_type: "ADD",
                project_id,
                tower_id,
                basis_of_no_of_eligible_car_parking,
                flat_range,
                floor_range: [currFloorRange.min, currFloorRange.max].join("_"),
            }));
            reset();
        }
    };

    return (
        <div className="-tw-ml-10 tw-p-4 tw-rounded-b-lg tw-shadow-xl tw-mb-6  tw-border tw-border-t-0 tw-border-black/10">
            <p className="tw-text-lg tw-font-semibold tw-text-black tw-mb-4">Add Floor Ranges</p>
            <div className="tw-grid tw-grid-cols-3 tw-gap-4">
                <CustomTextField
                    name=""
                    placeholder="Enter min. floor"
                    label="Min. floor"
                    value={currFloorRange.min}
                    onChange={(data) => {
                        const { value } = data.target;
                        setCurrFloorRange(prev => ({ ...prev, min: value }));
                    }}
                    validationRules={[]}
                    formSubmitted={formSubmitted}
                    onFocus={() => { }}
                    setIsError={() => { }}
                    isPassword={false}
                    disabled={true}
                />
                <CustomTextField
                    name=""
                    placeholder="Enter max. floor"
                    label={`Max. floor - 0 to ${total_no_of_floors}`}
                    value={currFloorRange.max}
                    onChange={(data) => {
                        const { value } = data.target;
                        setCurrFloorRange(prev => ({ ...prev, max: value }));
                    }}
                    validationRules={["numeric", `min_${currFloorRange.min}`, `max_${total_no_of_floors}`, "required"]}
                    formSubmitted={formSubmitted}
                    onFocus={() => { }}
                    setIsError={setMaxValueErr}
                    isPassword={false}
                />
                <div className="tw-flex tw-gap-2 tw-justify-between tw-my-4 tw-pr-2">
                    {!currFloorRange?.max ?
                        <Tooltip title={`Max floors = ${total_no_of_floors}`}>
                            <button
                                onClick={handleMaxFloors}
                                className="tw-px-3 tw-text-blue-500 tw-w-fit tw-font-semibold tw-border-2 tw-border-blue-500 tw-rounded-lg tw-text-[10px] tw-h-8 tw-bg-yellow-200 tw-mt-2"
                            >
                                Max floors
                            </button>
                        </Tooltip>
                        :
                        <div></div>

                    }
                    <button
                        onClick={handleAddFloorRanges}
                        className="tw-p-3 tw-px-6 tw-text-white tw-w-1/2 tw-font-semibold tw-bg-blue-500 tw-rounded-lg tw-text-sm"
                    >
                        Add floor ranges
                    </button>
                </div>
            </div>
        </div>
    );
};

const DeleteAllButton: React.FC<{ handleDeleteFloorRange: () => void }> = ({ handleDeleteFloorRange }) => (
    <div className='tw-flex tw-justify-start'>
        <button onClick={handleDeleteFloorRange} className='tw-mt-6 tw-h-10 tw-px-4 tw-gap-1 tw-items-center tw-flex tw-justify-center tw-text-white tw-bg-red-500 tw-rounded-lg'>
            <MdDelete /> <p>Delete All Floors Ranges</p>
        </button>
    </div>
);

const FloorRangesList: React.FC<{ floorRanges: string[], flat_range: string, handleDeleteFloorRange: () => void, viewOnly: boolean }> = ({ floorRanges, flat_range, handleDeleteFloorRange, viewOnly }) => (
    <div className='tw-mt-2 tw-flex tw-flex-col tw-gap-6'>
        {floorRanges.map((floor_range: string) => (
            <FloorCard
                key={floor_range}
                flat_range={flat_range}
                floor_range={floor_range}
                handleDeleteFloorRange={handleDeleteFloorRange}
                viewOnly={viewOnly}
            />
        ))}
    </div>
);

const FloorCard: React.FC<FloorCardProps> = ({ flat_range, floor_range, viewOnly }) => (
    <div>
        <div className='tw-flex tw-justify-between'>
            <div className='tw-flex tw-gap-8'>
                <DisplayField label="Floors" value={floor_range.split("_").join(" to ")} />
            </div>
        </div>
        <OptionAccordion flat_range={flat_range} floor_range={floor_range} viewOnly={viewOnly} />
    </div>
);

export default FloorsRangeAccordion;