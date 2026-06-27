import type { Hero } from '../../types/Hero';
import { ModalBase } from './ModalBase';

interface HeroDetailsModalProps {
  isOpen: boolean;
  hero: Hero | null;
  onClose: () => void;
}

export function HeroDetailsModal({ isOpen, hero, onClose }: HeroDetailsModalProps) {
  if (!hero) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={hero.nickname}>
      <div className="flex flex-col items-center">
        <img 
          src={hero.avatar_url || undefined} 
          alt={hero.nickname}
          className={`w-32 h-32 rounded-full object-cover mb-6 shadow-md ${!hero.is_active ? 'opacity-60 grayscale' : ''}`}
        />

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 text-left mt-2">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Nome completo</p>
            <p className="text-gray-800">{hero.name}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Data de nascimento</p>
            <p className="text-gray-800">{new Date(hero.date_of_birth).toLocaleDateString('pt-BR')}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Universo</p>
            <p className="text-gray-800">{hero.universe}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Habilidade</p>
            <p className="text-gray-800">{hero.main_power}</p>
          </div>
        </div>

        <div className="mt-8 flex justify-center w-full border-t pt-6 border-gray-100">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </ModalBase>
  );
}