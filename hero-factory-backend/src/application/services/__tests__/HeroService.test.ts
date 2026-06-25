import { HeroService } from '../HeroService';
import { HeroRepository } from '../../../infra/repositories/HeroRepository';
import { AppError } from '../../errors/AppError';
import { CreateHeroDTO } from '../../dtos/CreateHeroDTO';
import { HeroResponseDTO } from '../../dtos/HeroResponseDTO';

jest.mock('../../../infra/repositories/HeroRepository');

describe('HeroService (Serviço de Heróis)', () => {
    let heroService: HeroService;
    let mockRepository: jest.Mocked<HeroRepository>;

    const mockHeroData: CreateHeroDTO = {
        name: 'Roberto Bruce Banner',
        nickname: 'Hulk',
        date_of_birth: new Date('1962-04-10'),
        universe: 'Marvel',
        main_power: 'Força',
        avatar_url: 'https://exemplo.com/hulk.jpg',
    };

    const mockHeroResponse: HeroResponseDTO = {
        id: 'uuid-mocado-1234',
        name: 'Roberto Bruce Banner',
        nickname: 'Hulk',
        date_of_birth: '1962-04-10 00:00:00',
        universe: 'Marvel',
        main_power: 'Força',
        avatar_url: 'https://exemplo.com/hulk.jpg',
        is_active: true,
        created_at: '2024-01-01 10:00:00',
        updated_at: '2024-01-01 10:00:00',
    };

    beforeEach(() => {
        mockRepository = new HeroRepository() as jest.Mocked<HeroRepository>;
        heroService = new HeroService(mockRepository);
    });

    describe('criação de herói', () => {
        it('deve criar um herói com sucesso e retornar a resposta', async () => {
            mockRepository.create.mockResolvedValue(mockHeroResponse);

            const resultado = await heroService.createHero(mockHeroData);

            expect(mockRepository.create).toHaveBeenCalledTimes(1);
            expect(resultado).toEqual(mockHeroResponse);
        });

        it('deve lançar um AppError se campos obrigatórios estiverem faltando', async () => {
            const dadosInvalidos = { ...mockHeroData, name: '' };

            await expect(heroService.createHero(dadosInvalidos)).rejects.toThrow(AppError);
            await expect(heroService.createHero(dadosInvalidos)).rejects.toThrow('Campos obrigatórios');
        });
    });

    describe('atualização de herói', () => {
        it('deve lançar um AppError ao tentar editar um herói desativado', async () => {
            const heroiInativo = { ...mockHeroResponse, is_active: false };
            mockRepository.findById.mockResolvedValue(heroiInativo);

            await expect(heroService.updateHero(mockHeroResponse.id, { name: 'Novo Nome' }))
                .rejects.toThrow(AppError);
            await expect(heroService.updateHero(mockHeroResponse.id, { name: 'Novo Nome' }))
                .rejects.toThrow('Não é possível editar um herói desativado');
        });
    });
});