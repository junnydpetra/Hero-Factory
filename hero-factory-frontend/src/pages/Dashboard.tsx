import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useHero } from '../context/HeroContext';
import { useDebounce } from '../hooks/useDebounce';
import { HeroGrid } from '../components/HeroGrid';
import { ConfirmModal } from '../components/Modals/ConfirmModal';
import { CreateHeroModal } from '../components/Modals/CreateHeroModal';
import { EditHeroModal } from '../components/Modals/EditHeroModal';
import { HeroDetailsModal } from '../components/Modals/HeroDetailsModal';
import type { Hero } from '../types/Hero';
import { heroService } from '../services/heroService';

export function Dashboard() {
  const { heroes, loading, currentPage, totalPages, searchTerm, loadHeroes, setSearchTerm, setCurrentPage } = useHero();
  
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<Hero | null>(null);
  const [viewingHero, setViewingHero] = useState<Hero | null>(null);
  
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    hero: Hero | null;
    action: 'delete' | 'activate' | null;
    loading: boolean;
  }>({
    isOpen: false,
    hero: null,
    action: null,
    loading: false
  });

  useEffect(() => {
    loadHeroes(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch, loadHeroes]);

  useEffect(() => {
    const handleClickOutside = () => setMenuOpenId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleToggleMenu = (id: string) => setMenuOpenId(prev => prev === id ? null : id);

  const handleActionClick = (action: 'edit' | 'delete' | 'activate', hero: Hero) => {
    setMenuOpenId(null);
    if (action === 'edit') {
      setEditingHero(hero);
      return;
    }
    if (action === 'delete' || action === 'activate') {
      setConfirmModal({ isOpen: true, hero, action, loading: false });
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.hero || !confirmModal.action) return;
    setConfirmModal(prev => ({ ...prev, loading: true }));
    try {
      if (confirmModal.action === 'delete') {
        await heroService.delete(confirmModal.hero.id);
        toast.success('Herói desativado com sucesso!');
      } else if (confirmModal.action === 'activate') {
        await heroService.reactivate(confirmModal.hero.id);
        toast.success('Herói reativado com sucesso!');
      }
      await loadHeroes(currentPage, debouncedSearch);
      setConfirmModal({ isOpen: false, hero: null, action: null, loading: false });
    } catch (error) {
      toast.error('Erro ao processar a ação.');
      setConfirmModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCancelModal = () => {
    setConfirmModal({ isOpen: false, hero: null, action: null, loading: false });
  };
  
  const handleSearchClick = () => {
    setCurrentPage(1);
    loadHeroes(1, searchTerm);
  };

  return (
    <div className="min-h-screen bg-hero-bg p-8 flex flex-col items-center relative">
      <h1 className="text-4xl font-bold text-hero-blue mb-10">Heróis</h1>

      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center gap-4 mb-10">
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-hero-blue text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-800 transition shadow-md w-full md:w-auto"
        >
          Criar
        </button>
        
        <div className="relative flex-1 w-full">
          <input 
            type="text" 
            placeholder="Digite o nome do herói" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white rounded-full py-3 px-5 pl-12 shadow-sm border-none outline-none focus:ring-2 focus:ring-hero-blue/50 text-gray-700"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
        </div>

        <button 
          onClick={handleSearchClick}
          className="bg-white text-gray-600 px-6 py-2 rounded-full font-medium shadow-sm hover:shadow border border-gray-200 w-full md:w-auto"
        >
          Buscar
        </button>
      </div>

      {loading && <div className="py-10 text-gray-500 font-medium">Carregando heróis...</div>}

      {!loading && (
        <HeroGrid 
          heroes={heroes} 
          menuOpenId={menuOpenId}
          onToggleMenu={handleToggleMenu}
          onActionClick={handleActionClick}
          onCardClick={setViewingHero}
        />
      )}

      {!loading && totalPages > 1 && (
        <div className="flex items-center gap-2 mt-10">
          <button 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-white rounded shadow-sm text-gray-600 disabled:opacity-50"
          >{'<'}</button>
          <span className="px-4 py-1 bg-hero-blue text-white rounded shadow-sm font-medium">{currentPage}</span>
          <button 
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-white rounded shadow-sm text-gray-600 disabled:opacity-50"
          >{'>'}</button>
        </div>
      )}

      <HeroDetailsModal 
        isOpen={!!viewingHero}
        hero={viewingHero}
        onClose={() => setViewingHero(null)}
      />

      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title={confirmModal.action === 'delete' ? 'Excluir Herói' : 'Reativar Herói'}
        message={`Tem certeza que deseja ${confirmModal.action === 'delete' ? 'excluir' : 'reativar'} o herói "${confirmModal.hero?.nickname}"?`}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelModal}
        isLoading={confirmModal.loading}
      />

      <CreateHeroModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          loadHeroes(currentPage, debouncedSearch);
          toast.success('Herói criado com sucesso!');
        }}
      />

      <EditHeroModal 
        isOpen={!!editingHero}
        hero={editingHero}
        onClose={() => setEditingHero(null)}
        onSuccess={() => {
          loadHeroes(currentPage, debouncedSearch);
          toast.success('Herói atualizado com sucesso!');
        }}
      />
    </div>
  );
}