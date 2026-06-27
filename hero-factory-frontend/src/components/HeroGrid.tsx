import type { Hero } from '../types/Hero';
import { HeroCard } from './HeroCard';

interface HeroGridProps {
  heroes: Hero[];
  menuOpenId: string | null;
  onToggleMenu: (id: string) => void;
  onActionClick: (action: 'edit' | 'delete' | 'activate', hero: Hero) => void;
  onCardClick: (hero: Hero) => void;
}

export function HeroGrid({ heroes, menuOpenId, onToggleMenu, onActionClick, onCardClick }: HeroGridProps) {
  if (heroes.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        Nenhum herói encontrado!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
      {heroes.map((hero) => (
        <HeroCard 
          key={hero.id} 
          hero={hero} 
          isMenuOpen={menuOpenId === hero.id}
          onToggleMenu={onToggleMenu}
          onActionClick={onActionClick}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
}