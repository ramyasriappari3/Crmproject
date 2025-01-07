import React, { createContext, useState } from 'react';

// Interface for context value
interface ContextType {
  isTrue: boolean;
  unit_id: string | null;
  cust_unit_id: string | null;
  cust_profile_id: string | null;
  modifiedBy: string | null;
  userApplicationStatus: string | null;
  toggleState: () => void;
  setUnitId: (id: string | null) => void;
  setCustUnitId: (id: string | null) => void;
  setCustProfileId: (id: string | null) => void;
  setModifiedBy: (name: string | null) => void;
  setUserApplicationStatus: (status: string | null) => void;
}

// Creating a context
export const MyContext = createContext<ContextType>({
  isTrue: false,
  unit_id: null,
  cust_unit_id: null,
  cust_profile_id: null,
  modifiedBy: null,
  userApplicationStatus: null,
  toggleState: () => { },
  setUnitId: () => { },
  setCustUnitId: () => { },
  setCustProfileId: () => { },
  setModifiedBy: () => { },
  setUserApplicationStatus: () => { },
});

// Context Provider component
const MyContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTrue, setIsTrue] = useState<boolean>(false); // Initial state is false
  const [unit_id, setUnitId] = useState<string | null>(null); // Initial state is null
  const [cust_unit_id, setCustUnitId] = useState<string | null>(null); // Initial state is null
  const [cust_profile_id, setCustProfileId] = useState<string | null>(null); // Initial state is null
  const [modifiedBy, setModifiedBy] = useState<string | null>(null); // Initial state is null
  const [userApplicationStatus, setUserApplicationStatus] = useState<string | null>(null); // Initial state is null

  const toggleState = () => {
    setIsTrue(prevState => !prevState); // Toggle between true and false
  };

  return (
    <MyContext.Provider
      value={{
        isTrue,
        unit_id,
        cust_unit_id,
        cust_profile_id,
        modifiedBy,
        userApplicationStatus,
        toggleState,
        setUnitId,
        setCustUnitId,
        setCustProfileId,
        setModifiedBy,
        setUserApplicationStatus,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export { MyContextProvider };
