import React, { createContext, useState, useContext } from 'react';

interface ParkingValidationsContextType {
  flatValidated: boolean;
  setFlatValidated: React.Dispatch<React.SetStateAction<boolean>>;
  floorsValidated: boolean;
  setFloorValidated: React.Dispatch<React.SetStateAction<boolean>>;
  optionsValidated: boolean;
  setOptionsValidated: React.Dispatch<React.SetStateAction<boolean>>;
  locationsValidated: boolean;
  setLocationsValidated: React.Dispatch<React.SetStateAction<boolean>>;
}

const ParkingValidationsContext = createContext<ParkingValidationsContextType | undefined>(undefined);

export const ParkingValidationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flatValidated, setFlatValidated] = useState(false);
  const [floorsValidated, setFloorValidated] = useState(false);
  const [optionsValidated, setOptionsValidated] = useState(false);
  const [locationsValidated, setLocationsValidated] = useState(false);

  return (
    <ParkingValidationsContext.Provider value={{
      flatValidated,
      setFlatValidated,
      floorsValidated,
      setFloorValidated,
      optionsValidated,
      setOptionsValidated,
      locationsValidated,
      setLocationsValidated
    }}>
      {children}
    </ParkingValidationsContext.Provider>
  );
};

export const useParkingValidationsContext = () => {
  const context = useContext(ParkingValidationsContext);
  if (context === undefined) {
    throw new Error('useParkingValidationsContext must be used within a ParkingValidationsProvider');
  }
  return context;
};