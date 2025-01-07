import React, { useState, useEffect, useCallback, useMemo } from "react";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";

interface TextInputProps {
    name: string;
    placeholder?: string;
    label?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    validationRules?: string[];
    formSubmitted?: boolean;
    onFocus?: () => void;
    setIsError?: (isError: boolean) => void;
    isPassword?: boolean;
    disabled?: boolean;
}

const CustomTextField: React.FC<TextInputProps> = ({
    name,
    placeholder = "",
    label,
    value = "",
    onChange = () => { },
    validationRules = [],
    formSubmitted = false,
    onFocus = () => { },
    setIsError = () => { },
    isPassword = false,
    disabled = false
}) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(isPassword);

    const validateInput = useCallback(
        (inputValue: string) => {
            let error = "";

            if (validationRules.includes("email")) {
                const isValidEmail = /\S+@\S+\.\S+/.test(inputValue);
                if (!isValidEmail && inputValue.length > 0) {
                    error = "Please enter a valid email address";
                }
            }

            if (validationRules.includes("numeric")) {
                const isNumeric = /^\d+$/.test(inputValue);
                if (!isNumeric && inputValue.length > 0) {
                    error = "Please enter a valid numeric value";
                }
            }

            const minRule = validationRules.find((rule) => rule.startsWith("min_"));
            if (minRule) {
                const minValue = parseInt(minRule.split("_")[1], 10);
                const numericValue = Number(inputValue);
                if (!isNaN(numericValue) && numericValue < minValue) {
                    error = `The value must be ${minValue} or more`;
                }
            }


            const maxRule = validationRules.find((rule) => rule.startsWith("max_"));
            if (maxRule) {
                const maxValue = parseInt(maxRule.split("_")[1], 10);
                const numericValue = Number(inputValue);
                if (!isNaN(numericValue) && numericValue > maxValue) {
                    error = `The value must be ${maxValue} or less`;
                }
            }

            if (
                validationRules.includes("required") &&
                inputValue?.trim() === ""
            ) {
                error = "This field is required";
            }

            // Add more validation rules as needed

            return error;
        },
        [validationRules]
    );

    const validationResult = useMemo(
        () => validateInput(value),
        [validateInput, value]
    );

    useEffect(() => {
        setErrorMessage(validationResult);
        setIsError(validationResult.length > 0);
    }, [validationResult, setIsError]);

    // useEffect(() => {
    //     if (isFocused) {
    //         setErrorMessage("");
    //     }
    // }, [isFocused]);

    return (
        <div className="tw-flex tw-flex-col tw-gap-1 tw-pb-4 tw-relative">
            {label && (
                <label className="tw-text-black tw-text-xs">
                    {label}{" "}
                    {validationRules.includes("required") && (
                        <span className="tw-text-red-600">*</span>
                    )}
                </label>
            )}
            <input
                name={name}
                placeholder={placeholder}
                className={` ${disabled ? "tw-text-black/60" : "tw-text-black"} tw-p-2 focus:tw-outline-none placeholder:tw-text-black/50  tw-border tw-border-black/20 tw-rounded-lg`}
                type={showPassword ? "password" : "text"}
                value={value}
                onChange={onChange}
                onFocus={() => {
                    setIsFocused(true);
                    onFocus();
                }}
                onBlur={() => setIsFocused(false)}
                disabled={disabled}
            />
            {errorMessage && <ErrorMessage message={errorMessage} formSubmitted={formSubmitted} />}
            {isPassword && (
                <PasswordButton
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                />
            )}
        </div>
    );
};

interface ErrorMessageProps {
    message: string;
    formSubmitted: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, formSubmitted }) => (
    <p className="tw-absolute tw-text-[11px] tw-font-medium -tw-bottom-1 tw-left-1 tw-text-red-600">
        {message === "This field is required" ? formSubmitted ? message : "" : message}
    </p>
);

interface PasswordButtonProps {
    showPassword: boolean;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordButton: React.FC<PasswordButtonProps> = ({ showPassword, setShowPassword }) => (
    <button
        onClick={() => setShowPassword((prev) => !prev)}
        className="tw-absolute tw-text-black tw-top-[30px] tw-right-3"
    >
        {showPassword ? <IoIosEye size={20} /> : <IoIosEyeOff size={20} />}
    </button>
);

export default CustomTextField;