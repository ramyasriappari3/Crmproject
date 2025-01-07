import React from 'react';
import { Stepper, Step, StepLabel, StepConnector } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Import the checkmark icon
import './VerticalStepper.scss';

interface SelectedSlot {
    car_parking_slot_number: string; // Example property
    car_parking_code: string; // Example property
}

interface Location {
    back_to_back: boolean; // Example property
    no_of_parkings: number; // Example property
}

interface VerticalStepperProps {
    steps: any; // Accept selectedParkingOption as a prop
    currentLocationIndex: number; // Accept currentLocationIndex to determine active/completed steps
    onStepClick: (index: number) => void; // Function to handle step click
    selectedSlots: SelectedSlot[]; // Add selectedSlots to the props
    isCompleted?: boolean; // New prop to indicate if the booking is completed
    setSteps: any;
}

// Custom styles for the StepConnector
const CustomStepConnector = (props: any) => {
    return (
        <StepConnector
            {...props}
            sx={{
                height: '100%',
                width: '1px',
                borderRadius: '1px',
                backgroundColor: props.completed ? 'green' : 'grey',
                '&.Mui-active': {
                    backgroundColor: 'green',
                },
                '&.Mui-disabled': {
                    backgroundColor: 'grey',
                },
            }}
        />
    );
};

const VerticalStepper: React.FC<VerticalStepperProps> = ({
    steps,
    currentLocationIndex,
    onStepClick,
}) => {
    return (
        <div className="stepper-container">
            <Stepper orientation="vertical" activeStep={currentLocationIndex} connector={<CustomStepConnector />}>
                {steps.map((step: any, index: any) => (
                    <Step key={index} completed={step.isCompleted}>
                        <StepLabel
                            onClick={() => {
                                // Allow click only on completed or active steps
                                if (step.isCompleted || step.isActive) {
                                    onStepClick(index);
                                }
                            }}
                            sx={{
                                '&.Mui-active': {
                                    backgroundColor: 'transparent', // Remove background for active step
                                    border: 'none', // Remove border for active step
                                },
                            }}
                            icon={
                                step.isCompleted ? (
                                    <CheckCircleIcon className="checkmark" style={{ color: 'green' }} />
                                ) : (
                                    <span style={{
                                        backgroundColor: step.isActive || step.selectedSlots.length > 0 ? 'green' : 'grey',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {index + 1}
                                    </span>
                                )
                            }
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <h4 style={{ fontWeight: step.isActive ? 'bold' : 'normal', margin: 0 }}>{step.title}</h4>
                                {step.isCompleted && step.selectedSlots.length > 0 && (
                                    <div className="selected-slots" style={{ marginTop: '4px', marginLeft: '3px' }}>
                                        <p style={{ margin: 0 }}>
                                            {step.selectedSlots.map((slot: any) => slot.car_parking_slot_number).join(', ')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div className="tw-mt-4">
                <p className='tw-text-sm tw-font-bold tw-text-black'>Need Help?</p>
                <p className='tw-text-[13px] tw-font-normal tw-text-[#989FAE] tw-cursor-pointer'>
                    <a href="mailto:support@myhomeconstructions.com">support@myhomeconstructions.com</a>
                </p>
            </div>
        </div>
    );
};

export default VerticalStepper;
