import React from 'react'

const CustomCountField = ({
    label,
    value,
    setValue,
    validationRules = [],
    maxValue,
    disabled
}: {
    label: any
    value: any;
    setValue: any
    validationRules?: any,
    maxValue?: any,
    disabled?: boolean
}) => {
    return (
        <div className="tw-flex tw-flex-col tw-gap-1 tw-pb-8 tw-relative">
            {label && (
                <label className="tw-text-black/60 dark:tw-text-white/60 tw-text-xs">
                    {label}{" "}
                    {validationRules.includes("required") && (
                        <span className="tw-text-red-600 dark:tw-text-red-300">*</span>
                    )}
                </label>
            )}
            <div className='tw-flex tw-gap-4 tw-items-center'>
                <button disabled={value == 1 || disabled} className='tw-px-4 tw-py-2 tw-bg-blue-500 tw-text-white tw-font-bold tw-rounded-lg tw-flex tw-h-fit disabled:tw-bg-blue-500/50' onClick={() => {
                    setValue((prev: any) => prev - 1)
                }}>
                    -
                </button>
                <p className='tw-text-black tw-font-bold'>{value}</p>
                <button disabled={value >= maxValue || disabled} className='tw-px-4 tw-py-2 tw-bg-blue-500 tw-text-white tw-font-bold tw-rounded-lg tw-flex tw-h-fit disabled:tw-bg-blue-500/50' onClick={() => {
                    setValue((prev: any) => prev + 1)
                }}>
                    +
                </button>
            </div>
        </div>
    )
}

export default CustomCountField