import React, { useEffect, useState } from 'react';
import "./BookSlots.scss";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IBookedParking, IParking } from '@Constants/global-interfaces';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Api from '@Src/app/admin/api/Api';
import car_icon from "@Src/assets/Images/car_icon.svg";
import unit_type_icon from "@Src/assets/Images/unit_type_icon.svg"
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Stack, Avatar } from '@mui/material';


interface CalculationFields {
    basic_rate: number;
    basic_rate_gst: number;
    basic_total_amount: number;
    floor_rate: number;
    floor_gst: number;
    floor_total_amount: number;
    car_parking_gst: number;
    car_parking_with_gst: number;
    amenity_gst: number;
    amenity_with_gst: number;
    total_sale_consideration_without_gst: number;
    total_sale_consideration_gst: number;
    total_sale_consideration_with_gst: any;
    legal_charges_gst: number;
    legal_charges_total: number;
    maintaince_rate: string;
    maintaince_amount: string;
    maintaince_amount_gst: number;
    maintaince_amount_with_gst: number;
    corpus_fund_rate: string;
    corpus_fund_amt: string;
    document_without_gst: number;
    document_gst: number;
    document_with_gst: any;
    total_payable_amount: number;
    paid_amount: number;
    balance_amount: number;
    total_amount_five_perc_GST: number;
    total_amount_ts_plus_othchg: any;
}

interface CustomerBookingDetails {
    pan_card: string;
    mobile_number: string;
    login_user_id: string;
    cust_unit_id: string;
    cust_profile_id: string;
    customer_number: string;
    parking_charges: string;
    amenities_charges: string;
    total_handover_charges: string;
    unit_id: string;
    price_per_sq_ft: string;
    floor_rise_rate: string;
    total_sale_consideration: string;
    booking_date: string;
    booking_no: string;
    sale_order_number: string;
    booking_amount_paid: string;
    booking_due_amount: string;
    booking_payment_type: string | null;
    booking_payment_id: string | null;
    agreement_date: string | null;
    sale_deed_date: string | null;
    total_amount_paid: string;
    total_due_amount: string;
    other_charges: string;
    sgst_rate: string;
    cgst_rate: string;
    cost_calculation_url: string;
    corpus_fund_amt: string;
    corpus_per_sft_rate: string;
    legal_charges_amt: string;
    maintenance_amt: string;
    maintenance_gst_rate_central: string;
    legal_gst_rate_state: string;
    maintenance_per_sft_rate: string;
    unit_type_id: string;
    unit_no: string;
    flat_no_from_sap: string;
    project_id: string;
    tower_id: string;
    tower_or_sector_id: string;
    floor_id: string;
    launch_phase: string;
    covered_area: string;
    carpet_area: string;
    balcony_area: string;
    common_area: string;
    uds_area: string;
    saleable_area: string;
    pricing_refmaterial: string;
    pricing_refmaterial_desc: string;
    tax_classification1: string;
    tax_classification2: string;
    tax_classification3: string;
    tax_classification4: string;
    tax_classification5: string;
    confirmed_flat: string;
    mat_mas_deletion_ind: string;
    measure_unit: string;
    hsn_code: string;
    hsn_code_description: string;
    no_of_parkings: number;
    mortgaged_flat: string;
    base_unit: string;
    category: string;
    facing: string;
    description: string;
    per_sqft_rate: string;
    total_area: string;
    appartment_number: string;
    bedrooms: string;
    tower_code: string;
    tower_name: string;
    total_floors: number;
    floor_no: string;
    floor_name: string;
    total_flats: number | null;
    project_code: number;
    project_name: string;
    project_address: string;
    company_id: string;
    company_name: string;
    company_address: string;
    maintenance_gst_rate_state: string;
    legal_gst_rate_central: string;
    application_stage: string | null;
    application_status: string;
    application_comments: string | null;
    application_reject_reasons: string | null;
    created_on: string;
    joint_holder_present: boolean;
    no_of_joint_holders: string;
    amenity_type: string;
    amenities_description: string | null;
    amenity_amount: string;
    sales_order_number: string;
    sales_order_date: string;
    booking_id: string;
    booking_amount: string;
    per_sft_rate: string;
    total_sft: string;
    car_parking_amount: string;
    amenities_amount: string;
    crm_executive: string;
    sales_executive: string;
    car_parking_slots: string;
    interested_in_home_loans: boolean;
    sales_order_id: string;
    crm_email: string;
    crm_phone: string;
    crm_profile_pic: string,
    calculationFields: CalculationFields;
    total_billed_amount: string;
    total_payable_amount: string;
    balance_amount: number;
    basic_rate: any;
    total_gst_amount: any;
    total_amount_ts_plus_othchg: any;
    project_state: string;
    project_city: string;
    crm_executive_name: string;
}

interface Location {
    back_to_back: boolean;
    no_of_parkings: number;
}

interface ParkingLocation {
    back_to_back: boolean;
    no_of_parkings: number;
}

interface ParkingOption {
    locations: {
        [key: string]: ParkingLocation;
    };
}

interface ApplicableOptions {
    [key: string]: ParkingOption;
}

interface FlatTypeOrSize {
    floor_ranges: {
        [key: string]: {
            options: {
                [key: string]: {
                    locations: {
                        [locationKey: string]: {
                            back_to_back: boolean;
                            no_of_parkings: number;
                        }
                    }
                }
            }
        }
    };
    no_of_car_parkings: string;
}


interface ParkingRule {
    flat_types?: {
        [key: string]: FlatTypeOrSize;
    };
    flat_sizes?: {
        [key: string]: FlatTypeOrSize;
    };
    basis_of_no_of_eligible_car_parking: "flat_types" | "flat_sizes";
}


interface ParkingRuleData {
    rule_id: string;
    project_id: string;
    tower_id: string;
    rule_json: ParkingRule;
    rule_text: string;
    rule_start_date: string;
    rule_end_date: string;
    in_inforce: boolean;
    last_modified_by: string;
    last_modified_at: string;
}
interface BookedParking {
    project_code: string;
    tower_code: string;
    location_code: string;
    car_parking_slot_number: string;
    car_parking_code: string;
    cust_unit_id: string;
    booked_by: string;
    booked_date: string;
    cancelled_by: string | null;
    cancelled_date: string | null;
    cancelled_reason: string | null;
    last_modified_by: string;
    last_modified_at: string;
}

const BookSlots: React.FC = () => {
    const navigate = useNavigate();
    const { customerId, custUnitId } = useParams<{ customerId: string; custUnitId: string }>();
    const [parkingData, setParkingData] = useState<IParking>();
    const [selectedOption, setSelectedOption] = useState('');
    const [carParkingSlotNumbers, setCarParkingSlotNumbers] = useState<string>('');
    const [customerBookedData, setCustomerBookedData] = useState<BookedParking[]>([]);
    const [totalParkings, setTotalParkings] = useState(0);
    const [customerInfo, setCustomerInfo] = useState<CustomerBookingDetails | null>(null);
    const [customerUnits, setCustomerUnits] = useState<any[]>([]);
    const [parkingRules, setParkingRules] = useState<ParkingRuleData>();
    const [customerBooked, setCustomerBooked] = useState<boolean>(false);
    // const [basementKey, setBasementKey] = useState<string>();

    const getCustomerUnitsList = async (page: number = 1, perPage: number = 5) => {
        if (!customerId) {
            console.error("Customer profile ID is missing");
            return;
        }

        try {
            const { data, status, message }: any = await Api.get(
                "get_customer_units_list",
                { cust_profile_id: customerId, page, perPage }
            );
            if (status) {
                setCustomerUnits(data?.resultData);
                const currentUnit = data?.resultData.find((unit: any) => unit.cust_unit_id === custUnitId);
                if (currentUnit) {
                    setCustomerInfo(currentUnit);
                }
            } else {
                setCustomerUnits([]);
                console.error("Failed to fetch customer units:", message);
            }
        } catch (error) {
            console.error("Error fetching customer units:", error);
        }
    };
    const fetchParkingRules = async () => {
        if (!customerInfo) {
            console.error("Customer info is missing");
            return;
        }

        try {
            const response = await Api.get("crm_get_check_parking_rules", {
                project_id: customerInfo.project_id,
                tower_id: customerInfo.tower_id,
                in_inforce: true
            });
            console.log("Full Parking Rules API Response:", response);
            if (response.status && response.data && response.data.length > 0) {
                setParkingRules(response.data[0]);  // Set the first item in the data array
                console.log("Parking Rules set:", response.data[0]);
            } else {
                console.error('Failed to fetch parking rules:', response.message);
            }
        } catch (error) {
            console.error('Error fetching parking rules:', error);
        }
    };

    const fetchCustomerBookedParking = async () => {
        if (!custUnitId) {
            console.error("Customer info is missing");
            return;
        }

        try {
            const response = await Api.get("crm_get_customer_booked_parking", {
                cust_unit_id: custUnitId
            });
            console.log("Full Parking Rules API Response:", response);
            if (response.status && response.data && response.data.length > 0) {
                setCustomerBooked(true);  // Set the first item in the data array
                setCustomerBookedData(response.data);
                const carParkingSlotNumbers = response.data.map((item: { car_parking_slot_number: any; }) => item.car_parking_slot_number).join(', ');

                // Set the car parking slot numbers in state
                setCarParkingSlotNumbers(carParkingSlotNumbers);
                console.log(response.data);
                console.log("Parking Rules set:", response.data[0]);
            } else {
                console.error('Failed to fetch parking rules:', response.message);
            }
        } catch (error) {
            console.error('Error fetching parking rules:', error);
        }
    };


    useEffect(() => {
        if (customerId && custUnitId) {
            getCustomerUnitsList();
        }
    }, [customerId, custUnitId]);

    useEffect(() => {
        if (custUnitId) {
            fetchCustomerBookedParking();
        }
    }, [custUnitId]);
    useEffect(() => {
        if (customerInfo) {
            fetchParkingRules();
        }
    }, [customerInfo]);


    const handleBookNow = async () => {
        // if (!selectedOption) {
        //     toast.error("Please select a parking option before booking.");
        //     return;
        // }

        if (!customerInfo) {
            toast.error("Customer information is missing.");
            return;
        }

        const selectedParkingOption = getApplicableParkingOptions();
        
        if (!selectedParkingOption) {
            toast.error("No applicable parking options found.");
            return;
        }
        const basementKey = Object.keys(selectedParkingOption[selectedOption].locations);
       

        // Extract the basement information from the selected option
        const selectedBasements = Object.keys(selectedParkingOption[selectedOption].locations);
        

        // Check if there are any basements available
        if (selectedBasements.length === 0) {
            toast.error("No basements available for the selected option.");
            return;
        }

        // Use the first basement from the selected basements
        const basementToBook = selectedBasements[0]; // Get the first basement

        try {
            // First API call to get parking slots
            const slotsResponse = await Api.get("crm_get_parking_slots", {
                project_id: customerInfo.project_id,
                tower_id: customerInfo.tower_id,
                parking_location_code: basementToBook,

            });

            if (!slotsResponse.status) {
                toast.error("Failed to fetch parking slots: " + slotsResponse.message);
                return;
            }

            // Second API call to get parking location list
            const locationResponse = await Api.get("crm_get_parking_location_list", {
                project_id: customerInfo.project_id,
                tower_id: customerInfo.tower_id,
            });

            if (!locationResponse.statuscode) {
                toast.error("Failed to fetch parking locations: " + locationResponse.message);
                return;
            }

            // Extract the relevant parking location data
            const parkingLocations = locationResponse.data; // This is an array of parking locations

            // Find the selected parking location based on the basement code
            const selectedParkingLocation = parkingLocations.find((location: { parking_location_code: string; }) => location.parking_location_code === basementToBook);

            if (!selectedParkingLocation) {
                toast.error("Selected parking location not found.");
                return;
            }
            // Prepare the data to pass to SlotSelectionPage
            const dataToPass = {
                selectedOption,
                parkingLocation: {
                    project_name: customerInfo.project_name,
                    tower_name: customerInfo.tower_name,
                    project_code: customerInfo.project_code,
                    tower_code: parkingLocations[0].tower_code,
                    parking_location_name: selectedParkingLocation.parking_location_name,
                    tower_id: customerInfo.tower_id,
                    project_id: customerInfo.project_id,
                    floor_no: customerInfo.floor_no,
                    unit_no: customerInfo.unit_no,
                    cust_unit_id: customerInfo.cust_unit_id,
                    project_address: customerInfo.project_address,
                    project_city: customerInfo.project_city,
                    project_state: customerInfo.project_state
                },
                parkingSlots: slotsResponse.data, // Assuming the slots data is in response.data
                location_url: selectedParkingLocation.location_url, // Use the URL from the selected parking location
                // parkingQuantities: parkingQuantities,
                selectedParkingOption: selectedParkingOption[selectedOption],

            };

            navigate(`/crm/managecarparkingdetails/basement-slot-selection`, { state: dataToPass });
        } catch (error) {
            console.error("Error during API calls:", error);
            toast.error("An error occurred while fetching data.");
        }
    };

    // const handleOptions = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const newOptionKey = event.target.value;
    //     setSelectedOption(newOptionKey);
    //     setTotalParkings(calculateTotalParkings(newOptionKey)); // Update total parkings on change
    // };

    const getApplicableParkingOptions = () => {
        if (!customerInfo || !parkingRules) {
            console.log('Customer info or parking rules missing:', { customerInfo, parkingRules });
            return null;
        }

        const flatType = customerInfo.bedrooms; // e.g., "2BHK", "3BHK"
        const flatSize = parseFloat(customerInfo.saleable_area); // Assuming this is how flat size is represented
        const floorNo = parseInt(customerInfo.floor_no, 10); // Ensure floor_no is an integer


        const ruleJson = parkingRules.rule_json;

        if (!ruleJson || typeof ruleJson !== 'object') {
            console.log('Invalid rule JSON structure');
            return null;
        }

        let applicableRule = null;

        // Check for flat types first
        if (ruleJson.basis_of_no_of_eligible_car_parking === "flat_types" && ruleJson.flat_types) {
            

            for (const [key, rule] of Object.entries(ruleJson.flat_types)) {
                // Ensure there's a space after the number in keys
                const adjustedKey = key.replace(/(\d+)(?=\w)/g, '$1 '); // Add space after numbers if followed by letters
                const types = adjustedKey.split('_').map(type => type.trim()); // Split keys and trim whitespace
            
                // Trim whitespace from flatType
                const trimmedFlatType = flatType.trim();

                if (types.includes(trimmedFlatType)) {
                    applicableRule = rule;
                    console.log('Matching flat type rule found:', applicableRule);
                    break; // Exit once a match is found
                }
            }
        }


        // If no applicable rule found based on flat types, check for flat sizes
        if (!applicableRule && ruleJson.basis_of_no_of_eligible_car_parking === "flat_sizes" && ruleJson.flat_sizes) {
            console.log('Checking flat sizes');
            console.log('Available flat sizes:', Object.keys(ruleJson.flat_sizes));

            for (const sizeKey of Object.keys(ruleJson.flat_sizes)) {
                const sizeRange = sizeKey.split('_').map(Number);

                if (sizeRange.length === 1) {
                    // Single size key
                    if (flatSize === sizeRange[0]) {
                        applicableRule = ruleJson.flat_sizes[sizeKey];
                        console.log('Matching single size rule found:', applicableRule);
                        break;
                    }
                } else if (sizeRange.length > 1) {
                    // Multi-key combination or range key (not a range in this case)
                    if (sizeRange.includes(flatSize)) {
                        applicableRule = ruleJson.flat_sizes[sizeKey];
                        console.log('Matching multi-key size rule found:', applicableRule);
                        break;
                    }
                }
            }
        }

        if (!applicableRule) {
            toast.error('No applicable rule found');
            console.log('No applicable rule found for flat type or size:', { flatType, flatSize });
            return null;
        }

        // Find the applicable floor range
        for (const [floorRange, rangeRule] of Object.entries(applicableRule.floor_ranges)) {
            const [minFloor, maxFloor] = floorRange.split('_').map(Number);
            if (floorNo >= minFloor && floorNo <= maxFloor) {
                console.log('Matching floor range found:', floorRange);
                console.log('Applicable Options:', rangeRule.options);
                return rangeRule.options; // Return the options for the matching floor range
            }
        }

       
        return null;
    };


    useEffect(() => {
        // Fetch applicable parking options when the component mounts
        getApplicableParkingOptions();
    }, []);

    const applicableOptions = getApplicableParkingOptions() || {};

    useEffect(() => {
        // Set the selected option based on local storage or default to the first option
        if (applicableOptions) {
            if (customerBooked) {
                const storedOption = localStorage.getItem('selectedOption');
                if (storedOption && applicableOptions[storedOption]) {
                    setSelectedOption(storedOption);
                    setTotalParkings(calculateTotalParkings(storedOption)); // Calculate total parkings for the stored option
                }
            } else {
                // If customerBooked is false, set the first option as default
                const defaultOptionKey = Object.keys(applicableOptions)[0]; // Get the first option
                if (defaultOptionKey) {
                    setSelectedOption(defaultOptionKey);
                    setTotalParkings(calculateTotalParkings(defaultOptionKey)); // Calculate total parkings for the default option
                    localStorage.setItem('selectedOption', defaultOptionKey); // Persist the default option in local storage
                }
            }
        }
    }, [applicableOptions, customerBooked]);

    const handleOptionSelect = (optionKey: string, disabled: boolean) => {
        if (!disabled) {
            setSelectedOption(optionKey); // Update the selected option
            localStorage.setItem('selectedOption', optionKey); // Persist the selected option in local storage
            setTotalParkings(calculateTotalParkings(optionKey)); // Update total parkings for the selected option
        }
    };
    // Calculate total parkings for a given option key
    const calculateTotalParkings = (optionKey: string) => {
        if (applicableOptions && applicableOptions[optionKey]) {
            const option = applicableOptions[optionKey];
            const total = Object.values(option.locations).reduce(
                (sum, location) => sum + location.no_of_parkings,
                0
            );
            
            return total;

        }
        return 0;
    };

    const getAllTrimmedLocationKeys = (applicableOptions: ApplicableOptions): string => {
        const trimmedKeys: string[] = [];

        for (const optionId in applicableOptions) {
            const locations = applicableOptions[optionId].locations;
            for (const locationKey in locations) {
                const trimmedKey = locationKey.replace(/^Z/, ''); // Trim the "Z" from the key
                trimmedKeys.push(trimmedKey); // Store the trimmed key
            }
        }

        return trimmedKeys.join(', '); // Join the trimmed keys with commas and return
    };

    const optionKeys = Object.keys(applicableOptions);

    const formatBasements = (numbers: any[]) => {
        if (numbers.length === 0) return '';

        if (numbers.length === 1) {
            return `basement ${numbers[0]}`;
        } else if (numbers.length === 2) {
            return `basements ${numbers[0]} & ${numbers[1]}`;
        } else {
            const lastNumber = numbers.pop();
            return `basements ${numbers.join(', ')} & ${lastNumber}`;
        }
    };

    const getTransformedLocationKeys = () => {
        if (customerBooked) {
            // Assuming customerBookedData is an array of booked parking objects
            const locationKeys = customerBookedData.map((parking: BookedParking) => parking.location_code); // Extract location codes
    
            // Remove "ZB" prefix from each location code
            const transformedKeys = locationKeys.map(locationKey => locationKey.replace(/^ZB/, ''));
    
            // Use a Set to get unique basements
            const uniqueBasements = Array.from(new Set(transformedKeys));
    
            // Format the output
            const formattedBasements = uniqueBasements.map(key => key); // Just the keys without "basement"
    
            // Handle formatting based on the number of unique basements
            if (formattedBasements.length === 1) {
                return `basement ${formattedBasements[0]}`; // Only one unique basement
            } else if (formattedBasements.length === 2) {
                return `basement ${formattedBasements.join(' & ')}`; // Two unique basements
            } else {
                // Three or more unique basements
                const lastBasement = formattedBasements.pop(); 
                // Remove the last basement for separate handling
                return `basement ${formattedBasements.join(', ')} & ${lastBasement}`; // Join with commas and add the last one with '&'
            }
        } else {
            const defaultSelectedOption = applicableOptions[selectedOption];
    
            if (defaultSelectedOption && defaultSelectedOption.locations) {
                const basementNumbers = Object.keys(defaultSelectedOption.locations).map(locationKey => {
                    // Remove "ZB" prefix
                    return locationKey.replace(/^ZB/, '');
                });
    
                return formatBasements(basementNumbers);
            }
        }
    
        return '';
    };
    const renderParkingOptions = ({ disabled }: { disabled: boolean }) => {
        if (!applicableOptions) {
            return <p>No applicable parking options found for your flat size and floor.</p>;
        }

        const optionEntries = Object.entries(applicableOptions);
        const rows = [];

        // Create rows of two options each
        for (let i = 0; i < optionEntries.length; i += 2) {
            rows.push(optionEntries.slice(i, i + 2)); // Push pairs of options into rows
        }

        return (
            <div className="tw-flex tw-flex-col tw-items-center tw-w-full">
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="tw-flex tw-justify-between tw-items-stretch tw-w-full tw-mb-4">
                        {row.map(([optionKey, option], index) => (
                            <div
                                key={optionKey}
                                className={`tw-w-1/2 tw-border tw-rounded-lg tw-p-4 tw-mx-2 ${selectedOption === optionKey ? 'tw-border-blue-500' : 'tw-border-gray-200'}`}
                                onClick={() => handleOptionSelect(optionKey, disabled)} // Handle click on the entire box
                            >
                                <div className="tw-flex tw-items-center tw-mb-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        id={optionKey}
                                        name="parking_option"
                                        value={optionKey}
                                        className="tw-mr-2"
                                        onChange={() => handleOptionSelect(optionKey, disabled)} // Update on change
                                        checked={selectedOption === optionKey} // Ensure the radio button reflects the selected option
                                        disabled={disabled}
                                    />
                                    <label htmlFor={optionKey} className="tw-font-bold">Option {String.fromCharCode(65 + (rowIndex * 2) + index)}</label> {/* A, B, C, ... */}
                                </div>
                                <div className="tw-flex tw-flex-col">
                                    {Object.entries(option.locations).map(([basement, location]) => (
                                        <span key={basement}>
                                            {basement.replace(/^Z/, '')} - {location.no_of_parkings} Parking{location.no_of_parkings > 1 ? 's' : ''}
                                            {location.back_to_back ? ' (Back to Back)' : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };
    function getInitials(fullName: string) {
        const nameParts = fullName.split(" ");
        let second_name;
        let initials;
        if (nameParts[1] != undefined) {
            second_name = nameParts[1]?.substring(0, 1).toUpperCase() || nameParts[2]?.substring(0, 1).toUpperCase()
            initials = nameParts[0]?.substring(0, 1).toUpperCase() + second_name;
        } else {
            second_name = nameParts[0]?.substring(0, 2).toUpperCase();
            initials = second_name;
        }
        return initials.toUpperCase();
    }


  
    function findFloorRangeKey(floorNumber: any, scalableArea: any) {
        // Convert the floor number to an integer
        const floor = parseInt(floorNumber, 10);
        
        // Check if parkingRules is defined and has flat_sizes
        if (!parkingRules || !parkingRules.rule_json || !parkingRules.rule_json.flat_sizes) {
            console.error("Parking rules or flat sizes are not defined.");
            return null; // Handle the case where flat_sizes is not available
        }
    
        // Flag to check if a valid range is found
        let foundRange = false;
    
        // Iterate through each flat size in the data
        for (const flatSizeKey in parkingRules.rule_json.flat_sizes) {
            // Split the flat size key to get min and max area
            const sizeRange = flatSizeKey.split('_').map(Number);
            const minArea = Math.min(...sizeRange); // Get the minimum area
            const maxArea = Math.max(...sizeRange); // Get the maximum area
    
            // Check if the scalable area falls within the range
            if (scalableArea >= minArea && scalableArea <= maxArea) {
                const floorRanges = parkingRules.rule_json.flat_sizes[flatSizeKey].floor_ranges;
    
                // Iterate through the keys in floor_ranges to find the appropriate range
                for (const key in floorRanges) {
                    // Split the key to get the min and max values
                    const [minFloor, maxFloor] = key.split('_').map(Number);
                    
                    // Check if the floor number falls within the range
                    if (floor >= minFloor && floor <= maxFloor) {
                        foundRange = true; // Mark that a valid range was found
                        return key.replace('_', '-'); // Return the formatted key (e.g., "0-25")
                    }
                }
            }
        }
    
        // If no valid range was found, return a message or null
        if (!foundRange) {
            console.warn("No valid floor range found for the given scalable area and floor number.");
            return null; // Or return a specific message if needed
        }
    
        return null; // Handle out of range cases
    }


    return (
        <div className='tw-pt-4 book-slots-page-cont'>
            <div className='tw-flex tw-items-center tw-justify-between tw-mb-4'>
                <button onClick={() => navigate("/crm/admin/managecarparking")} className='tw-flex tw-items-center tw-gap-2'>
                    <IoMdArrowRoundBack className='tw-text-xl' /> {/* Adjust size as needed */}
                </button>
                <div
                    className='lg:tw-hidden text-pri-all tw-font-bold tw-flex tw-gap-4 tw-items-center'
                    onClick={() => { navigate('/my-task') }}
                >
                    <div><ChevronLeftIcon /></div>
                    <div>My tasks</div>
                </div>
            </div>
            <div className="section-container lg:tw-p-8 tw-mt-4">
                <div className='img-container'>
                    <img src={'/images/home_car.png'} alt="" />
                </div>
                <p className='text-pri-all tw-text-center tw-text-2xl tw-font-bold tw-mb-2'>Book your parking slots</p>
                <div className='tw-px-6'>
                    Your car parking slots are now available for booking. As per your property reservation, you have been allocated <span className='text-pri-all tw-font-semibold'>
                        {customerBooked ? `${carParkingSlotNumbers.split(', ').length} parking ${carParkingSlotNumbers.split(', ').length === 1 ? 'slot' : 'slots'}` : `${totalParkings} parking ${totalParkings === 1 ? 'slot' : 'slots'}`}
                    </span> in <span className='text-pri-all tw-font-semibold'>{customerInfo?.project_name}, {customerInfo?.tower_name}, {`${customerInfo?.floor_no || ''}${customerInfo?.unit_no || ''}`}</span><span> located in</span> <span className='text-pri-all tw-font-semibold'>{getTransformedLocationKeys()}</span>. Please note that once booked, car parking slots cannot be changed.
                </div>
                <div className="section-container tw-mt-8 tw-p-8">
                    <div className='tw-flex tw-items-center tw-justify-between'>
                        <div className='text-pri-all tw-font-bold'>Car parking slot booking</div>
                        {/* <div className='status-incomplete'>{customerBooked ? 'Completed' : 'Incomplete'}</div> */}
                        <div className={customerBooked ? 'status-completed' : 'status-incomplete'}>
                            {customerBooked ? 'Completed' : 'Incomplete'}
                        </div>
                    </div>
                    <hr className='border-bot'></hr>
                    <p className='text-pri-all tw-font-bold'>{`${customerInfo?.floor_no || ''}${customerInfo?.unit_no || ''}`}, {customerInfo?.tower_name}, {customerInfo?.project_name}</p>
                    <div>
                        <LocationOnIcon />
                        <span>{customerInfo?.project_city}, {customerInfo?.project_state}</span>
                    </div>
                    <div className='tw-flex tw-items-center tw-justify-between tw-mt-4'>
                        <div className='tw-flex tw-gap-1'>
                            <div className='icon'>
                                <img src={car_icon} alt="" />
                            </div>
                            <div className='txt'>
                                <p>Car parking</p>
                                {!customerBooked ? (
                                    <p className='text-pri-all tw-font-bold'>{totalParkings}</p>
                                ) : (
                                    <p className='text-pri-all tw-font-bold'>{carParkingSlotNumbers ? carParkingSlotNumbers.split(', ').length : 0}</p>
                                )}
                            </div>
                        </div>
                        {optionKeys.length === 1 && !customerBooked && (
                            <div className='tw-flex tw-gap-1'>
                                <div className='icon'>
                                    <img src={unit_type_icon} alt="" />
                                </div>
                                <div className='txt'>
                                    <p>Parking floors</p>
                                    <p className='text-pri-all tw-font-bold'>{getAllTrimmedLocationKeys(applicableOptions)}</p>
                                </div>
                            </div>
                        )}
                        {customerBooked && (
                            <div className='tw-flex tw-gap-1'>
                                <div className='icon'>
                                    <img src={unit_type_icon} alt="" />
                                </div>
                                <div className='txt'>
                                    <p>Parking floors</p>
                                    <p className='text-pri-all tw-font-bold'>{carParkingSlotNumbers}</p>
                                </div>
                            </div>
                        )}
                        <div className='tw-flex tw-gap-1'>
                            <div className='icon'>
                                <img src={'/images/clarity_building-line.png'} alt="" />
                            </div>
                            <div className='txt'>
                                <p>Block/Tower</p>
                                <p className='text-pri-all tw-font-bold'>{customerInfo?.tower_name}</p>
                            </div>
                        </div>
                    </div>
                    <div className='tw-flex tw-items-center tw-justify-between tw-mt-4'>
                        <div className='tw-flex tw-mt-5 ' >
                            {customerInfo?.crm_profile_pic != "" &&
                                customerInfo?.crm_profile_pic != null &&
                                customerInfo?.crm_profile_pic != undefined ? (
                                <Stack direction="row" spacing={1}>
                                    <Avatar
                                        alt="Remy Sharp"
                                        src={customerInfo?.crm_profile_pic}
                                        style={{ marginRight: "10px" }}
                                    />
                                </Stack>
                            ) : (
                                <Stack direction="row" spacing={2}>
                                    <Avatar style={{ marginRight: "10px" }}>
                                        {customerInfo?.crm_executive_name ? getInitials(customerInfo?.crm_executive_name) : null} {/* Show initials if fullName is defined */}
                                    </Avatar>
                                </Stack>
                            )}

                            <div className='tw-ml-3'>
                                <h5 className='tw-font-bold tw-text-black'>{customerInfo?.crm_executive_name}</h5>
                                <p className=' tw-font-light'>Relationship Manager</p>
                            </div>
                        </div>
                        <div className='tw-mt-5 tw-ml-5' >
                            <div className='tw-flex' >
                                <img src={'/images/phone.svg'} alt="" />
                                <p className='tw-ml-3 tw-font-light ' >{customerInfo?.crm_phone}</p>
                            </div>
                            <div className='tw-flex'>
                                <img src={'/images/mail.svg'} alt="" />
                                <a href={`mailto:${customerInfo?.crm_email}`} className='tw-ml-3 tw-font-light'style={{wordBreak : 'break-word'}}>
                                    {customerInfo?.crm_email}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    {optionKeys.length > 1 && !customerBooked && ( // Check if customer is not booked
                        <div className="section-container tw-mt-8 tw-p-8">
                            <p className='text-pri-all tw-font-bold'>Choose Parking Floor</p>
                            <div className="tw-mb-4 tw-tetx-black">
                                <span>As your flat is situated  between the {findFloorRangeKey(customerInfo?.floor_no,customerInfo?.saleable_area)?.split('-')[0]}th and {findFloorRangeKey(customerInfo?.floor_no,customerInfo?.saleable_area)?.split('-')[1]}th, you can select from the following parking floor combinations.</span>
                            </div>
                           <span className='tw-text-black'> {renderParkingOptions({ disabled: customerBooked })}</span>
                        </div>
                    )}
                </div>
                {!customerBooked && (
                    <button onClick={handleBookNow} className='book-now'>Book now!</button>
                )}
            </div>
            <div className='tw-mt-3 ' >
                <p className='tw-font-bold text-pri-all tw-text-center' > Need Help?</p>
                <p className='tw-text-center'>
                    <a href="mailto:support@myhomeconstructions.com" className='tw-text-blue-500 hover:tw-underline'>
                      support@myhomeconstructions.com
                    </a>
                </p>
            </div>
        </div>
    );
};

export default BookSlots;