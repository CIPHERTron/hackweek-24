"use client";
import { useState, useEffect } from "react";

/**
 * Custom hook to manage local storage.
 *
 * @param {string} key The key under which the data is stored in local storage.
 * @param {object} initialValue The initial value to use if there is no data in local storage.
 * @returns {[object, function]} The stored value and a function to update it.
 */
function useLocalStorage(key: any, initialValue: any) {
  // Function to get the initial value from local storage or default to the initial value
  const getStoredValue = () => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // Use useState to store the value
  const [storedValue, setStoredValue] = useState(getStoredValue);

  // useEffect to update local storage whenever the value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
