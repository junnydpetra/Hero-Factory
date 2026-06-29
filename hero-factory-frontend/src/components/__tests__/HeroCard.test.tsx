import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HeroCard } from '../HeroCard';
import type { Hero } from '../../types/Hero';

const mockHero: Hero = {
  id: '1',
  name: 'Clark Kent',
  nickname: 'Superman',
  date_of_birth: '1938-06-18 00:00:00',
  universe: 'DC',
  main_power: 'Super Força',
  avatar_url: null,
  is_active: true,
  created_at: '2024-01-01',
  updated_at: '2024-01-01'
};

describe('HeroCard', () => {
  it('deve abrir o menu de ações ao clicar nos 3 pontinhos', () => {
    const mockToggle = vi.fn();
    render(
      <HeroCard 
        hero={mockHero} 
        isMenuOpen={false} 
        onToggleMenu={mockToggle} 
        onActionClick={() => {}} 
        onCardClick={() => {}}
      />
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockToggle).toHaveBeenCalledWith('1');
  });
});