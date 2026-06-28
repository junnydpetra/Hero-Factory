import { createContext, useState, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Hero } from '../types/Hero';
import { heroService } from '../services/heroService';
import toast from 'react-hot-toast';

interface HeroContextData {
  heroes: Hero[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  loadHeroes: (page: number, search?: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
}

const HeroContext = createContext<HeroContextData | undefined>(undefined);

export function HeroProvider({ children }: { children: ReactNode }) {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const loadHeroes = useCallback(async (page: number, search?: string) => {
    setLoading(true);
    try {
      const response = await heroService.list(page, search);
      setHeroes(response.heroes);
      setTotalPages(Math.ceil(response.total / 10)); 
    } catch (error) {
      console.error('Erro ao buscar heróis:', error);
      toast.error('Erro ao carregar a lista de heróis.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <HeroContext.Provider
      value={{
        heroes,
        loading,
        currentPage,
        totalPages,
        searchTerm,
        loadHeroes,
        setSearchTerm,
        setCurrentPage,
      }}
    >
      {children}
    </HeroContext.Provider>
  );
}

export function useHero() {
  const context = useContext(HeroContext);
  if (context === undefined) {
    throw new Error('useHero deve ser usado dentro de um HeroProvider!');
  }
  return context;
}