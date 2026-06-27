import { HeroService } from '../HeroService';
import { IHeroRepository } from '../../../domain/repositories/IHeroRepository';
import { AppError } from '../../errors/AppError';
import { CreateHeroDTO } from '../../dtos/CreateHeroDTO';
import { HeroResponseDTO } from '../../dtos/HeroResponseDTO';

describe('HeroService (Serviço de Heróis)', () => {
    let heroService: HeroService;
    let mockRepository: jest.Mocked<IHeroRepository>;

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
        mockRepository = {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            toggleActive: jest.fn(),
        };
        heroService = new HeroService(mockRepository);
    });

    describe('criação de herói', () => {
        it('deve criar um herói com sucesso e retornar a resposta', async () => {
            mockRepository.create.mockResolvedValue(mockHeroResponse);

            const resultado = await heroService.createHero(mockHeroData);

            expect(mockRepository.create).toHaveBeenCalledTimes(1);
            expect(resultado).toEqual(mockHeroResponse);
        });
    });

    describe('listagem de heróis', () => {
        it('deve repassar página e busca para o repositório', async () => {
            mockRepository.findAll.mockResolvedValue({ heroes: [mockHeroResponse], total: 1 });

            const resultado = await heroService.listHeroes(2, 'Hulk');

            expect(mockRepository.findAll).toHaveBeenCalledWith(2, 'Hulk');
            expect(resultado.total).toBe(1);
        });
    });

    describe('busca por id', () => {
        it('deve retornar o herói quando encontrado', async () => {
            mockRepository.findById.mockResolvedValue(mockHeroResponse);

            const resultado = await heroService.getHeroById(mockHeroResponse.id);

            expect(resultado).toEqual(mockHeroResponse);
        });

        it('deve lançar AppError 404 quando o herói não existir', async () => {
            mockRepository.findById.mockResolvedValue(null);

            await expect(heroService.getHeroById('id-inexistente')).rejects.toThrow(AppError);
            await expect(heroService.getHeroById('id-inexistente')).rejects.toThrow('Herói não encontrado!');
        });
    });

    describe('atualização de herói', () => {
        it('deve atualizar um herói ativo com sucesso', async () => {
            mockRepository.findById.mockResolvedValue(mockHeroResponse);
            mockRepository.update.mockResolvedValue({ ...mockHeroResponse, name: 'Novo Nome' });

            const resultado = await heroService.updateHero(mockHeroResponse.id, { name: 'Novo Nome' });

            expect(resultado.name).toBe('Novo Nome');
        });

        it('deve lançar AppError ao tentar editar um herói desativado', async () => {
            const heroiInativo = { ...mockHeroResponse, is_active: false };
            mockRepository.findById.mockResolvedValue(heroiInativo);

            await expect(heroService.updateHero(mockHeroResponse.id, { name: 'Novo Nome' }))
                .rejects.toThrow('Não é possível editar um herói desativado!');
        });

        it('deve lançar AppError 404 ao tentar editar um herói inexistente', async () => {
            mockRepository.findById.mockResolvedValue(null);

            await expect(heroService.updateHero('id-inexistente', { name: 'Novo Nome' }))
                .rejects.toThrow('Herói não encontrado!');
        });
    });

    describe('exclusão (soft delete) de herói', () => {
        it('deve desativar o herói chamando toggleActive com false', async () => {
            mockRepository.findById.mockResolvedValue(mockHeroResponse);

            await heroService.deleteHero(mockHeroResponse.id);

            expect(mockRepository.toggleActive).toHaveBeenCalledWith(mockHeroResponse.id, false);
        });

        it('deve lançar AppError 404 ao tentar excluir um herói inexistente', async () => {
            mockRepository.findById.mockResolvedValue(null);

            await expect(heroService.deleteHero('id-inexistente')).rejects.toThrow('Herói não encontrado!');
        });
    });

    describe('reativação de herói', () => {
        it('deve reativar um herói inativo chamando toggleActive com true', async () => {
            const heroiInativo = { ...mockHeroResponse, is_active: false };
            mockRepository.findById.mockResolvedValue(heroiInativo);

            await heroService.reactivateHero(mockHeroResponse.id);

            expect(mockRepository.toggleActive).toHaveBeenCalledWith(mockHeroResponse.id, true);
        });

        it('deve lançar AppError 400 ao tentar reativar um herói já ativo', async () => {
            mockRepository.findById.mockResolvedValue(mockHeroResponse);

            await expect(heroService.reactivateHero(mockHeroResponse.id))
                .rejects.toThrow('Herói já está ativo!');
        });

        it('deve lançar AppError 404 ao tentar reativar um herói inexistente', async () => {
            mockRepository.findById.mockResolvedValue(null);

            await expect(heroService.reactivateHero('id-inexistente')).rejects.toThrow('Herói não encontrado!');
        });
    });
});