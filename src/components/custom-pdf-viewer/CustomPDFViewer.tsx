import { BlobProvider, PDFDownloadLink } from '@react-pdf/renderer';
import { isWindowsOrMac } from '@Src/utils/globalUtilities';
import React, { useState } from 'react';
import loader from '@Src/assets/Images/bouncing-circles.svg';
import loader2 from '@Src/assets/Images/bouncing-circles-2.svg';

interface CustomToolbarProps {
    url: string;
    onClose: () => void; // Close function prop
    showCloseButton?: boolean; // Prop to show/hide the close button
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({ url, onClose, showCloseButton = true }) => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = url;
        link.download = 'your-file-name.pdf'; // Set a default name for the file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        const printWindow = window.open(url, '_blank'); // Open PDF in a new window
        if (printWindow) {
            printWindow.onload = () => {
                printWindow.print(); // Trigger the print dialog
            };
        }
    };

    return (
        <div className="custom-toolbar tw-bg-black tw-flex tw-justify-end tw-h-12">
            <button onClick={handleDownload} className="download-button tw-pr-4">
                <img src="/images/downloadwhite.png" alt="Download" />
            </button>
            <button onClick={handlePrint} className="print-button tw-pr-4">
                <img src="/images/printer.png" alt="Print" style={{ width: '17px', height: '17px' }} />
            </button>
            {showCloseButton && (  // Conditionally render the close button
                <button onClick={onClose} className="tw-pr-4">
                    <img src="/images/close_icon.png" alt="close" style={{ width: '17px', height: '17px' }} />
                </button>
            )}
        </div>
    );
};

const CustomPDFViewer = ({ children, type = 'view', buttonElement = '', fileName = '', onClose, showCloseButton = true }: { children: any, type: string, buttonElement: any, fileName: string, onClose: () => void, showCloseButton?: boolean }) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        onClose(); // Call the onClose function passed from the parent
    };

    if (!isVisible) {
        return null;
    }

    if (type === 'download') {
        return (
            <div>
                <PDFDownloadLink document={children} fileName={`${fileName}.pdf`}>
                    {({ blob, url, loading, error }) =>
                        loading ? <img src={loader} alt="loader" className="tw-w-6 tw-h-6" /> : <div>{buttonElement}</div>
                    }
                </PDFDownloadLink>
            </div>
        );
    }

    return (
        <BlobProvider document={children}>
            {({ blob, url, loading, error }) => {
                if (loading)
                    return (
                        <div className="tw-h-full tw-w-full tw-flex tw-justify-center tw-items-center">
                            <img src={loader2} alt="loader" className="tw-w-20 tw-h-20" />
                        </div>
                    );

                if (error) return <div>Failed to load PDF</div>;

                if (url) {
                    return (
                        <div style={{ width: '100%', height: '100%' }}>
                            <CustomToolbar url={url} onClose={handleClose} showCloseButton={showCloseButton} /> {/* Pass showCloseButton */}
                            {isWindowsOrMac() ? (
                                <div style={{ width: '100%', height: 'calc(100% - 50px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <iframe src={url + '#toolbar=0'} width="100%" height="100%" title="PDF Viewer" />
                                </div>
                            ) : (
                                <div className="tw-h-full tw-w-full tw-flex tw-justify-center tw-items-center">
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="tw-text-white tw-text-center tw-block tw-text-lg tw-font-bold tw-bg-black tw-px-4 tw-py-2 tw-rounded-md">
                                        Click to View Preview PDF
                                    </a>
                                </div>
                            )}
                        </div>
                    );
                }

                return null;
            }}
        </BlobProvider>
    );
};

export default CustomPDFViewer;
