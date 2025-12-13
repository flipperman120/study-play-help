import React, { createContext, useContext, useState, useCallback } from 'react';

interface CasinoContextType {
  chips: number;
  addChips: (amount: number) => void;
  removeChips: (amount: number) => boolean;
  resetChips: () => void;
}

const CasinoContext = createContext<CasinoContextType | undefined>(undefined);

const INITIAL_CHIPS = 1000;

export const CasinoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chips, setChips] = useState(INITIAL_CHIPS);

  const addChips = useCallback((amount: number) => {
    setChips(prev => prev + amount);
  }, []);

  const removeChips = useCallback((amount: number): boolean => {
    if (chips >= amount) {
      setChips(prev => prev - amount);
      return true;
    }
    return false;
  }, [chips]);

  const resetChips = useCallback(() => {
    setChips(INITIAL_CHIPS);
  }, []);

  return (
    <CasinoContext.Provider value={{ chips, addChips, removeChips, resetChips }}>
      {children}
    </CasinoContext.Provider>
  );
};

export const useCasino = () => {
  const context = useContext(CasinoContext);
  if (!context) {
    throw new Error('useCasino must be used within a CasinoProvider');
  }
  return context;
};
