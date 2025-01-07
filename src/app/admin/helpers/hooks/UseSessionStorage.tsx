import React, {useState} from "react";

export default function UseSessionStorage(keyName: string, defaultValue: any){
    const [storedValue, setStoredValue] = React.useState(() => {
      try {
        const value = window.sessionStorage.getItem(keyName);
        if (value) {
          return JSON.parse(value);
        } else {
          window.sessionStorage.setItem(keyName, JSON.stringify(defaultValue));
          return defaultValue;
        }
      } catch (err) {
        return defaultValue;
      }
    });
    const setValue = (newValue: any) => {
      try {
        window.sessionStorage.setItem(keyName, JSON.stringify(newValue));
      } catch (err) {}
      setStoredValue(newValue);
    };
    return [storedValue, setValue];
};
