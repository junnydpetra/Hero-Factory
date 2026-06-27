import type { Hero } from '../types/Hero';

interface HeroCardProps {
  hero: Hero;
  isMenuOpen: boolean;
  onToggleMenu: (id: string) => void;
  onActionClick: (action: 'edit' | 'delete' | 'activate', hero: Hero) => void;
  onCardClick: (hero: Hero) => void;
}

export function HeroCard({ hero, isMenuOpen, onToggleMenu, onActionClick, onCardClick }: HeroCardProps) {
  const isInactive = !hero.is_active;

  return (
    <div className={`relative bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center transition-all hover:shadow-xl cursor-pointer ${isInactive ? 'opacity-60 grayscale' : ''}`}>
      
      <div className="w-full h-full flex flex-col items-center" onClick={() => onCardClick(hero)}>
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm mb-4">
          <img 
            src={hero.avatar_url || undefined} 
            alt={hero.nickname}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-lg font-bold text-gray-800 text-center">{hero.nickname}</h3>
      </div>
      
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu(hero.id);
          }}
          className="p-2 bg-gray-200/70 hover:bg-gray-300/70 rounded-xl transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-gray-700">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>

        {isMenuOpen && (
          <div 
            className="absolute right-0 top-12 w-14 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-2 flex flex-col items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {isInactive ? (
              <button 
                onClick={() => onActionClick('activate', hero)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                title="Ativar Herói"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <rect x="2" y="9" width="20" height="10" rx="5" ry="5" />
                  <circle cx="16" cy="14" r="4" fill="#1D4ED8" />
                </svg>
              </button>
            ) : (
              <>
                <button 
                  onClick={() => onActionClick('edit', hero)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                  title="Editar Herói"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  </svg>
                </button>
                <button 
                  onClick={() => onActionClick('delete', hero)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                  title="Excluir Herói"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}