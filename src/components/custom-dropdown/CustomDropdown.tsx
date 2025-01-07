import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaSortDown } from "react-icons/fa";

interface DropdownOption {
    value: any;
    label: string;
}

interface DropdownProps {
    label?: string;
    validationRules?: string[];
    multi?: boolean;
    loading?: boolean;
    selectedvalues: DropdownOption[];
    setSelectedValues: React.Dispatch<React.SetStateAction<DropdownOption[]>>;
    searchable?: boolean;
    selectPlaceholder?: string;
    searchPlaceholder?: string;
    options: DropdownOption[];
    sticky?: boolean;
    disable?: boolean;
    formSubmitted?: boolean;
    setIsError?: any
}

const CustomDropdown: React.FC<DropdownProps> = ({
    label,
    validationRules = [],
    multi = true,
    loading = false,
    selectedvalues = [],
    setSelectedValues,
    searchable = false,
    selectPlaceholder = "Select an item",
    searchPlaceholder = "Search item",
    options = [],
    sticky = false,
    disable = false,
    formSubmitted = false,
    setIsError = () => { },
}) => {
    const dropdownRef = useRef<HTMLButtonElement>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchValue, setSearchValue] = useState<string>("");
    const [showItems, setShowItems] = useState<boolean>(false);

    const handleDeleteValue = (index: number) => {
        setSelectedValues((prev) => prev.filter((_, idx) => idx !== index));
    };

    const handleToggleShowItems = () => {
        setShowItems((prev) => !prev);
    };

    const handleHideItems = () => {
        setShowItems(false);
    };

    const handleItemSelect = (item: DropdownOption) => {
        const isItemAlreadySelected = selectedvalues.some(
            (value) => value.value === item.value
        );
        if (!isItemAlreadySelected && multi) {
            setSelectedValues((prev) => [...prev, item]);
        } else {
            setSelectedValues([item]);
        }
        setSearchValue("");
        setShowItems(false);
    };

    const validateInput = useCallback(
        (inputValue: any) => {
            let error = "";

            if (
                validationRules.includes("required") &&
                !inputValue[0]?.value
            ) {
                error = "This field is required";
            }

            // Add more validation rules as needed

            return error;
        },
        [validationRules, formSubmitted]
    );

    const validationResult = useMemo(
        () => validateInput(selectedvalues),
        [validateInput, selectedvalues]
    );

    useEffect(() => {
        setErrorMessage(validationResult);
        setIsError(validationResult.length > 0);
    }, [validationResult, setIsError]);

    return (
        <div className="tw-flex tw-flex-col tw-gap-1 tw-pb-4 tw-relative tw-transition-none">
            {label && (
                <label className="tw-text-black tw-text-xs">
                    {label}{" "}
                    {validationRules.includes("required") && (
                        <span className="tw-text-red-600">*</span>
                    )}
                </label>
            )}
            <div className="tw-relative tw-bg-white tw-text-black tw-p-2 focus:tw-outline-none placeholder:tw-text-black/50 tw-border tw-border-black/20 tw-flex tw-gap-2 tw-justify-between tw-transition-none tw-rounded-lg">
                <div className="tw-flex tw-gap-2 tw-flex-wrap tw-w-full">
                    {selectedvalues &&
                        multi &&
                        selectedvalues.map((value, index) => (
                            <div
                                key={index}
                                className="tw-text-[12px] tw-py-[3px] tw-px-3 tw-border tw-border-blue-500 tw-rounded-[4px] tw-flex tw-gap-1 tw-transition-none tw-font-medium tw-z-10"
                            >
                                <p>{value.label}</p>{" "}
                                <IoMdClose
                                    onClick={() => handleDeleteValue(index)}
                                    size={12}
                                    className="tw-ml-1 tw-mt-[2.5px] tw-cursor-pointer tw-transition-none"
                                />
                            </div>
                        ))}
                    {!multi && (
                        <p className="tw-text-black dark:tw-text-fieldColor-dark">
                            {selectedvalues[0]?.label}
                        </p>
                    )}
                    {selectedvalues.length === 0 && !searchable && (
                        <p className="tw-text-black/50 dark:tw-text-fieldColor-dark/50">
                            {selectPlaceholder}
                        </p>
                    )}
                    {searchable && (
                        <input
                            value={searchValue}
                            placeholder={searchPlaceholder}
                            className="tw-bg-transparent focus:!tw-outline-none focus:tw-border-none !tw-outline-none placeholder:tw-text-black/50 dark:placeholder:tw-text-fieldColor-dark/60 tw-border-none"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setShowItems(true);
                                setSearchValue(event.target.value);
                            }}
                        />
                    )}
                </div>
                {!disable && <button
                    ref={dropdownRef}
                    className="tw-absolute tw-w-full tw-top-0 tw-left-0 tw-pr-2 tw-flex tw-justify-end tw-items-center tw-h-full tw-text-black tw-transition-none"
                    onClick={handleToggleShowItems}
                    onBlur={() =>
                        setTimeout(() => {
                            handleHideItems();
                        }, 500)
                    }
                >
                    <FaSortDown className="tw-mb-[5px]" size={18} />
                </button>}
            </div>

            <div className="tw-relative">
                {showItems && (
                    <div className={`${sticky ? "tw-sticky" : "tw-absolute"} tw-left-0 tw-top-0 tw-w-full tw-z-10 tw-max-h-44 tw-overflow-auto tw-bg-fieldColor-dark`}>
                        {options
                            .filter((item) => {
                                if (searchValue.length > 0) {
                                    return item.label
                                        .toLowerCase()
                                        .includes(searchValue.toLowerCase());
                                } else {
                                    return true;
                                }
                            })
                            .map((item) => {
                                const isSelected = selectedvalues.some(
                                    (value) => value.value === item.value
                                );
                                const backgroundColor = isSelected
                                    ? "tw-bg-blue-800 tw-text-white tw-border"
                                    : "tw-bg-white tw-border";
                                const hoverBackground = isSelected
                                    ? ""
                                    : "hover:tw-bg-blue-200";

                                return (
                                    <div
                                        key={item.value}
                                        onClick={() => handleItemSelect(item)}
                                        className={`tw-cursor-pointer tw-p-2 ${backgroundColor} ${hoverBackground} tw-text-black`}
                                    >
                                        {item.label}
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>

            {errorMessage && <ErrorMessage message={errorMessage} formSubmitted={formSubmitted} />}
        </div>
    );
};

export default CustomDropdown;

interface ErrorMessageProps {
    message: string;
    formSubmitted: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, formSubmitted }) => (
    <p className="tw-absolute tw-text-[11px] tw-font-medium -tw-bottom-1 tw-left-1 tw-text-red-600 dark:tw-text-red-300">
        {message === "This field is required" ? formSubmitted ? message : "" : message}
    </p>
);