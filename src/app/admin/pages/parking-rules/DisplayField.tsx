import React from 'react'

interface DisplayFieldProps {
  label: string;
  value: any;
}

const DisplayField: React.FC<DisplayFieldProps> = ({ label, value }) => {
  return (
    <div className="tw-px-4">
      <div className="tw-flex tw-flex-col">
        <span className="tw-text-xs tw-font-extrabold tw-text-violet-800 tw-uppercase tw-tracking-wider tw-mb-1">{label}</span>
        <span className="tw-text-lg tw-font-medium tw-text-gray-900 tw-break-words tw-leading-relaxed">
          {typeof value === 'object' ? (
            <pre className="tw-text-sm tw-font-mono tw-p-2 tw-rounded tw-border-l-4 tw-border-red-400 tw-shadow-sm">
              {JSON.stringify(value, null, 2)}
            </pre>
          ) : (
            value
          )}
        </span>
      </div>
    </div>
  )
}

export default DisplayField