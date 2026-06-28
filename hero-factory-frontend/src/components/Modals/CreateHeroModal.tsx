import { useState } from 'react';
import { ModalBase } from './ModalBase';
import { heroService } from '../../services/heroService';
import toast from 'react-hot-toast';

interface CreateHeroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateHeroModal({ isOpen, onClose, onSuccess }: CreateHeroModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    nickname: '',
    date_of_birth: '',
    universe: '',
    main_power: '',
    avatar_url: ''
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await heroService.create(form);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Erro ao salvar o herói. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Criar herói" isLoading={loading}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
          <input 
            type="text" 
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-hero-blue outline-none"
            placeholder="Digite o nome completo"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome de guerra</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de nascimento</label>
            <input 
              type="date" 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-hero-blue outline-none"
              value={form.date_of_birth}
              onChange={(e) => setForm({...form, date_of_birth: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Universo</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Habilidade</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-hero-blue outline-none"
              placeholder="Digite a habilidade"
              value={form.main_power}
              onChange={(e) => setForm({...form, main_power: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-hero-blue outline-none"
              placeholder="Digite a URL"
              value={form.avatar_url}
              onChange={(e) => setForm({...form, avatar_url: e.target.value})}
            />
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