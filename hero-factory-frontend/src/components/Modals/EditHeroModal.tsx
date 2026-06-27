import { useState, useEffect } from 'react';
import { ModalBase } from './ModalBase';
import type { Hero } from '../../types/Hero';
import { heroService } from '../../services/heroService';

interface EditHeroModalProps {
  isOpen: boolean;
  hero: Hero | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditHeroModal({ isOpen, hero, onClose, onSuccess }: EditHeroModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    nickname: '',
    date_of_birth: '',
    universe: '',
    main_power: '',
    avatar_url: ''
  });
  
  useEffect(() => {
    if (hero) {
      setForm({
        name: hero.name,
        nickname: hero.nickname,
        date_of_birth: hero.date_of_birth.split(' ')[0],
        universe: hero.universe,
        main_power: hero.main_power,
        avatar_url: hero.avatar_url || ''
      });
    }
  }, [hero]);

  const handleSubmit = async () => {
    if (!hero) return;
    setLoading(true);
    try {
      await heroService.update(hero.id, form);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao editar herói');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={`Editar ${hero?.nickname || 'Herói'}`} isLoading={loading}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo (Editável)</label>
          <input 
            type="text" 
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-hero-blue outline-none"
            placeholder="Digite o nome completo"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome de guerra (Editável)</label>
          <input 
            type="text" 
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-hero-blue outline-none"
            placeholder="Digite o nome de guerra"
            value={form.nickname}
            onChange={(e) => setForm({...form, nickname: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de nascimento (Editável)</label>
            <input 
              type="date" 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-hero-blue outline-none"
              value={form.date_of_birth}
              onChange={(e) => setForm({...form, date_of_birth: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Universo (Editável)</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-hero-blue outline-none"
              placeholder="Digite o universo"
              value={form.universe}
              onChange={(e) => setForm({...form, universe: e.target.value})}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Habilidade (Editável)</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-hero-blue outline-none"
              placeholder="Digite a habilidade"
              value={form.main_power}
              onChange={(e) => setForm({...form, main_power: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar (Editável)</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-hero-blue outline-none"
              placeholder="Digite a URL"
              value={form.avatar_url}
              onChange={(e) => setForm({...form, avatar_url: e.target.value})}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div className="opacity-60 cursor-not-allowed">
            <label className="block text-sm font-medium text-gray-700 mb-1">ID (Bloqueado)</label>
            <input type="text" disabled value={hero?.id || ''} className="w-full border border-gray-200 bg-gray-50 rounded-lg p-2 text-gray-500" />
          </div>
          <div className="opacity-60 cursor-not-allowed">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status (Bloqueado)</label>
            <input type="text" disabled value={hero?.is_active ? 'Ativo' : 'Inativo'} className="w-full border border-gray-200 bg-gray-50 rounded-lg p-2 text-gray-500" />
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
          <button 
            onClick={onClose} 
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit} 
            className="px-6 py-2 rounded-lg bg-hero-blue text-white font-medium hover:bg-blue-800 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </ModalBase>
  );
}