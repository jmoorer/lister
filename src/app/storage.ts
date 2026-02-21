import { effect, signal, WritableSignal } from '@angular/core';
import { z } from 'zod';

export function createLocalStorageSignal<T>(
  key: string,
  initialValue: T,
  schema: z.ZodSchema<T>,
): WritableSignal<T> {
  function isBrowser() {
    return typeof window !== 'undefined';
  }
  // 1. Initialize the signal with the default value.
  const storeSignal = signal<T>(initialValue);

  // 2. Load the value from localStorage if in a browser environment
  //    and a value exists.

  try {
    if (isBrowser()) {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) {
        const parsedValue = schema.parse(JSON.parse(storedValue));
        storeSignal.set(parsedValue);
      }
    }
  } catch (error) {
    console.error(`Error loading key "${key}" from localStorage:`, error);
  }

  // 3. Use an effect to automatically sync the signal's value to localStorage
  //    whenever it changes. The effect is only created in the browser.

  effect(() => {
    const currentValue = storeSignal(); // Reading the signal makes it a dependency
    try {
      if (isBrowser()) {
        localStorage.setItem(key, JSON.stringify(schema.parse(currentValue))); // LocalStorage only stores strings
      }
    } catch (error) {
      console.error(`Error saving key "${key}" to localStorage:`, error);
    }
  });

  return storeSignal;
}
