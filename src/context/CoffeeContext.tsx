import { createContext, useContext } from 'react';
import type { CoffeeStore } from '../types';

export const CoffeeContext = createContext<CoffeeStore | null>(null);

export function useCoffee(): CoffeeStore {
  const ctx = useContext(CoffeeContext);
  if (!ctx) throw new Error('useCoffee must be used within CoffeeContext');
  return ctx;
}
