import { useState, useCallback } from 'react';
import type { CoffeeRecord } from '../types';

const STORAGE_KEY = 'coffee_records_v1';

function loadRecords(): CoffeeRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CoffeeRecord[]) : [];
  } catch {
    return [];
  }
}

function saveRecords(records: CoffeeRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function useCoffeeRecords() {
  const [records, setRecords] = useState<CoffeeRecord[]>(() => loadRecords());

  const addRecord = useCallback((record: Omit<CoffeeRecord, 'id' | 'createdAt'>): string => {
    const newRecord: CoffeeRecord = {
      ...record,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setRecords((prev) => {
      const next = [newRecord, ...prev];
      saveRecords(next);
      return next;
    });
    return newRecord.id;
  }, []);

  const updateRecord = useCallback((id: string, updates: Partial<CoffeeRecord>): void => {
    setRecords((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r));
      saveRecords(next);
      return next;
    });
  }, []);

  const deleteRecord = useCallback((id: string): void => {
    setRecords((prev) => {
      const next = prev.filter((r) => r.id !== id);
      saveRecords(next);
      return next;
    });
  }, []);

  const getRecord = useCallback((id: string): CoffeeRecord | undefined => records.find((r) => r.id === id), [records]);

  return { records, addRecord, updateRecord, deleteRecord, getRecord };
}
