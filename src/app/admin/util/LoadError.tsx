import React, { useState, useEffect, ReactNode } from 'react';

interface LoadErrorProps {
  children: ReactNode;
}

const LoadError: React.FC<LoadErrorProps> = ({ children }) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const handleReload = () => {
    window.location.reload();
  };
  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.log(error);
      if (error.error && error.error.name === 'ChunkLoadError' && !hasError) {
        setHasError(true);
      }
    };
      window.addEventListener('error', errorHandler);
    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);
  if (hasError) {
    return (
      <div>
        <p>There was a problem loading the application. Please reload the page.</p>
        <button onClick={handleReload}>Reload</button>
      </div>
    );
  }
  return <>{children}</>;
};

export default LoadError;
