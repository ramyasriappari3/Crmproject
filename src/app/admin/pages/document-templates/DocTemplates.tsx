import React, { useCallback, useEffect, useRef, useState } from 'react'

interface PageData {
    id: number;
    title: string;
    // Add other properties as needed
}

const DocTemplates = () => {
    const [scale, setScale] = useState(0.4);
    const pageGap = 200; // Gap between pages in pixels
    const scaleStep = 0.05;
    const minScale = 0.1;
    const maxScale = 0.4;  

    // Sample page data - replace this with your actual data source
    const pages: PageData[] = [
        { id: 1, title: "Document Template 1" },
        { id: 2, title: "Document Template 2" },
        { id: 3, title: "Document Template 3" },
        { id: 4, title: "Document Template 4" },
        { id: 5, title: "Document Template 5" },
        { id: 6, title: "Document Template 6" },
        // Add more pages as needed
    ];

    const zoomIn = () => {
        setScale(prevScale => Math.min(prevScale + scaleStep, maxScale));
    };

    const zoomOut = () => {
        setScale(prevScale => Math.max(prevScale - scaleStep, minScale));
    };

    return (
        <div style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            height: '90vh',
            padding: '1rem',
            transform: 'scale(0.95)',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '0.5rem'
        }}>
            <div style={{
                position: 'absolute',
                top: '1rem',
                right: '2rem',
                display: 'flex',
                gap: '0.5rem'
            }}>
                <button
                    onClick={zoomOut}
                    style={{
                        padding: '0.5rem',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '9999px',
                        transition: 'background-color 0.3s',
                        cursor: scale <= minScale ? 'not-allowed' : 'pointer'
                    }}
                    disabled={scale <= minScale}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.5rem', width: '1.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                </button>
                <button
                    onClick={zoomIn}
                    style={{
                        padding: '0.5rem',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '9999px',
                        transition: 'background-color 0.3s',
                        cursor: scale >= maxScale ? 'not-allowed' : 'pointer'
                    }}
                    disabled={scale >= maxScale}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.5rem', width: '1.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
            <div style={{
                flexGrow: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <div style={{ display: 'inline-block', transform: `scale(${scale})` }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: `-${400}px`
                    }}>
                        {pages.map((page, index) => (
                            <Node
                                type='page'
                                key={page.id}
                                styles={{
                                    padding: 50
                                }}
                            >
                                <Node styles={{ padding: 50, marginBottom: 50 }} type='view'>
                                    <Node type='text'>{page.title}</Node>
                                </Node>
                                <Node styles={{ padding: 50 }} type='view'>
                                    <Node type='text'>{page.title}</Node>
                                </Node>
                                <Node styles={{ padding: 50 }} type='view'>
                                    <Node type='text'>{page.title}</Node>
                                </Node>
                            </Node>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const Node = ({ type, children, styles }: { type: string, children: React.ReactNode, styles?: React.CSSProperties }) => {
    const [dimensions, setDimensions] = useState({
        width: styles?.width || "100%",
        height: styles?.height || "100%"
    });
    const [isSelected, setIsSelected] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const nodeRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setIsSelected(!isSelected);
        }
    }, [isSelected]);

    const handleResizeStart = useCallback((direction: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
        setResizeDirection(direction);
    }, []);

    const handleResize = useCallback((e: MouseEvent) => {
        if (isResizing && nodeRef.current && nodeRef.current.parentElement) {
            const parentRect = nodeRef.current.parentElement.getBoundingClientRect();
            const rect = nodeRef.current.getBoundingClientRect();
            let newWidth = parseFloat(dimensions.width as string);
            let newHeight = parseFloat(dimensions.height as string);

            switch (resizeDirection) {
                case 'right':
                    newWidth = ((e.clientX - rect.left) / parentRect.width) * 100;
                    break;
                case 'bottom':
                    newHeight = ((e.clientY - rect.top) / parentRect.height) * 100;
                    break;
            }

            setDimensions({
                width: resizeDirection === 'right' ? `${Math.max(0, Math.min(100, newWidth))}%` : dimensions.width,
                height: resizeDirection === 'bottom' ? `${Math.max(0, Math.min(100, newHeight))}%` : dimensions.height
            });
        }
    }, [isResizing, resizeDirection, dimensions]);

    const handleResizeEnd = useCallback(() => {
        setIsResizing(false);
        setResizeDirection(null);
    }, []);

    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleResize);
            document.addEventListener('mouseup', handleResizeEnd);
        }
        return () => {
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('mouseup', handleResizeEnd);
        };
    }, [isResizing, handleResize, handleResizeEnd]);

    const resizeHandle = (direction: string) => (
        <div
            onMouseDown={handleResizeStart(direction)}
            style={{
                position: 'absolute',
                backgroundColor: 'blue',
                opacity: 0.8,
                ...(direction === 'right'
                    ? { width: 4, height: '100%', right: -2, top: 0, cursor: 'ew-resize' }
                    : { width: '100%', height: 2, bottom: -2, left: 0, cursor: 'ns-resize' }),
            }}
        />
    );

    switch (type) {
        case 'page':
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: '2480px',
                    minHeight: '3508px',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    marginBottom: '20px',
                    position: 'relative',
                    ...styles
                }}>
                    {children}
                </div>
            );
        case 'view':
            return (
                <div
                    ref={nodeRef}
                    onClick={handleMouseDown}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        ...styles,
                        display: 'flex',
                        flexDirection: 'column',
                        width: dimensions.width,
                        height: dimensions.height,
                        border: isSelected ? '1px solid black' : 'none',
                        borderRight: isSelected ? '5px dashed blue' : 'none',
                        borderBottom: isSelected ? '5px dashed blue' : 'none',
                        position: 'relative',
                        backgroundColor: isHovered ? 'rgba(0, 0, 255, 0.1)' : 'transparent',
                        transition: 'background-color 0.3s ease',
                    }}
                >
                    {children}
                    {isSelected && (
                        <>
                            {resizeHandle('right')}
                            {resizeHandle('bottom')}
                        </>
                    )}
                </div>
            );
        case 'text':
            return (
                <p style={{
                    fontSize: '2rem',
                    ...styles
                }}>
                    {children}
                </p>
            );
        default:
            return null;
    }
}

export default DocTemplates;    