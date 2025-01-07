import React, { useState, createContext, useContext, ReactNode, useEffect, useRef } from 'react';
import { MdRemoveCircle } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";

// Types and Interfaces
interface AccordionProps {
    children: ReactNode;
    tailwindStyle?: string;
}

interface AccordionTitleProps {
    children: ReactNode;
    tailwindStyle?: string;
}

interface AccordionContentProps {
    children: ReactNode;
}

interface AccordionContextType {
    isOpen: boolean;
    toggleAccordion: () => void;
}

// Context
const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

// Custom Hook
const useAccordionContext = () => {
    const context = useContext(AccordionContext);
    if (!context) {
        throw new Error('Accordion components must be used within an Accordion');
    }
    return context;
};

// Main Accordion Component
const Accordion: React.FC<AccordionProps> & {
    Title: React.FC<AccordionTitleProps>;
    Content: React.FC<AccordionContentProps>;
} = ({ children, tailwindStyle = "tw-border-black/40 tw-bg-blue-200/10" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const accordionRef = useRef<HTMLDivElement>(null);

    const toggleAccordion = () => setIsOpen(prev => !prev);

    useEffect(() => {
        const openTimer = setTimeout(() => setIsOpen(true), 500);

        const scrollToAccordionTop = () => {
            if (accordionRef.current) {
                const yOffset = -75; // Adjust this value to increase or decrease the top gap
                const y = accordionRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        };

        const scrollTimer = setTimeout(scrollToAccordionTop, 1000);

        return () => {
            clearTimeout(openTimer);
            clearTimeout(scrollTimer);
        };
    }, []);

    return (
        <AccordionContext.Provider value={{ isOpen, toggleAccordion }}>
            <div ref={accordionRef} className={`tw-p-2 tw-mt-2 tw-border tw-rounded-lg ${tailwindStyle}`}>
                {children}
            </div>
        </AccordionContext.Provider>
    );
};

// Accordion Title Component
Accordion.Title = function AccordionTitle({ children, tailwindStyle = "" }: AccordionTitleProps) {
    const { toggleAccordion, isOpen } = useAccordionContext();

    return (
        <div
            className={`group tw-relative tw-flex tw-px-4 tw-py-3 tw-gap-3 tw-items-center tw-cursor-pointer tw-text-sm tw-font-medium tw-transition-all tw-duration-300 tw-rounded-md tw-shadow-md hover:tw-shadow-xl tw-overflow-hidden ${
                isOpen 
                ? 'tw-bg-black tw-text-cyan-200'
                : 'tw-bg-slate-800 tw-text-slate-300 hover:tw-bg-slate-700'
            } ${tailwindStyle}`}
            onClick={toggleAccordion}
        >
            <div className="tw-absolute tw-inset-0 tw-bg-gradient-to-r tw-from-cyan-500/10 tw-via-teal-500/10 tw-to-blue-500/10 tw-opacity-0 group-hover:tw-opacity-100 tw-transition-opacity tw-duration-300"></div>
            <p className={`tw-text-xl tw-transition-all tw-duration-300 ${
                isOpen ? 'tw-rotate-180 tw-scale-110 tw-text-cyan-400' : 'tw-text-teal-400'
            }`}>
                {isOpen ? <MdRemoveCircle /> : <IoMdAddCircle />}
            </p>
            <div className="tw-uppercase tw-tracking-wide tw-relative tw-z-10">{children}</div>
            <div className={`tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-h-0.5 tw-bg-gradient-to-r tw-from-cyan-400 tw-via-teal-400 tw-to-blue-400 tw-transform tw-transition-transform tw-duration-300 ${
                isOpen ? 'tw-translate-x-0' : 'tw-translate-x-full'
            }`}></div>
        </div>
    );
};

// Accordion Content Component
Accordion.Content = function AccordionContent({ children }: AccordionContentProps) {
    const { isOpen } = useAccordionContext();

    return (
        <div
            className={`tw-overflow-hidden tw-pl-10 tw-transition-all tw-duration-500 ${isOpen ? 'tw-max-h-[5000vh] tw-opacity-100' : 'tw-max-h-0 tw-opacity-0'
                }`}
        >
            <div className="tw-mt-2">{children}</div>
        </div>
    );
};

export default Accordion;