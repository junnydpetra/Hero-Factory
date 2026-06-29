import { Request, Response, NextFunction } from 'express';
import { HeroService } from '../../application/services/HeroService';
import { AppError } from '../../application/errors/AppError';

export class HeroController {
    constructor(private readonly heroService: HeroService) { }

    /**
     * @swagger
     * /api/v1/heroes:
     *   post:
     *     summary: Cria um novo herói
     *     tags: [Heróis]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - nickname
     *               - date_of_birth
     *               - universe
     *               - main_power
     *             properties:
     *               name: { type: string }
     *               nickname: { type: string }
     *               date_of_birth: { type: string, format: date }
     *               universe: { type: string }
     *               main_power: { type: string }
     *               avatar_url: { type: string }
     *     responses:
     *       201: { description: "Herói criado com sucesso" }
     *       400: { description: "Erro de validação" }
     */
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const heroData = req.body;
            const newHero = await this.heroService.createHero(heroData);
            res.status(201).json(newHero);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /api/v1/heroes:
     *   get:
     *     summary: Lista heróis com paginação e busca
     *     tags: [Heróis]
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *         description: Número da página (10 itens por página)
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *         description: Filtra heróis pelo nome ou nome de guerra
     *     responses:
     *       200:
     *         description: Lista de heróis paginada
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 heroes:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Hero'
     *                 total:
     *                   type: integer
     */
    async list(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = Number(req.query.page) || 1;
            const search = req.query.search as string | undefined;

            const result = await this.heroService.listHeroes(page, search);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /api/v1/heroes/{id}:
     *   get:
     *     summary: Retorna os detalhes de um herói específico
     *     tags: [Heróis]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: ID do herói
     *     responses:
     *       200:
     *         description: Detalhes do herói
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Hero'
     *       404:
     *         description: Herói não encontrado
    */
    async show(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params as { id: string };

            const hero = await this.heroService.getHeroById(id);
            res.status(200).json(hero);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /api/v1/heroes/{id}:
     *   patch:
     *     summary: Atualiza um herói (não permite editar heróis inativos)
     *     tags: [Heróis]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: ID do herói
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name: { type: string }
     *               nickname: { type: string }
     *               date_of_birth: { type: string, format: date }
     *               universe: { type: string }
     *               main_power: { type: string }
     *               avatar_url: { type: string }
     *     responses:
     *       200:
     *         description: Herói atualizado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Hero'
     *       400:
     *         description: Erro de validação
     *       403:
     *         description: Ação proibida - Não é possível editar um herói desativado
     *       404:
     *         description: Herói não encontrado
    */
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params as { id: string };
            const data = req.body;

            const updatedHero = await this.heroService.updateHero(id, data);
            res.status(200).json(updatedHero);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /api/v1/heroes/{id}:
     *   delete:
     *     summary: Desativa um herói (Soft Delete)
     *     tags: [Heróis]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: ID do herói
     *     responses:
     *       204:
     *         description: Herói desativado com sucesso (Sem conteúdo)
     *       404:
     *         description: Herói não encontrado
    */
    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params as { id: string };

            await this.heroService.deleteHero(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /api/v1/heroes/{id}/reactivate:
     *   patch:
     *     summary: Reativa um herói que estava desativado
     *     tags: [Heróis]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: ID do herói
     *     responses:
     *       204:
     *         description: Herói reativado com sucesso (Sem conteúdo)
     *       400:
     *         description: Requisição inválida (herói já está ativo)
     *       404:
     *         description: Herói não encontrado
    */
    async reactivate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params as { id: string };

            await this.heroService.reactivateHero(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Hero:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - nickname
 *         - date_of_birth
 *         - universe
 *         - main_power
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "e314636e-1ca6-4925-a0e7-da5eb5ae2403"
 *         name:
 *           type: string
 *           example: "Robert Bruce Banner"
 *         nickname:
 *           type: string
 *           example: "Hulk"
 *         date_of_birth:
 *           type: string
 *           format: date-time
 *           example: "1962-04-10 00:00:00"
 *         universe:
 *           type: string
 *           example: "Marvel"
 *         main_power:
 *           type: string
 *           example: "Force"
 *         avatar_url:
 *           type: string
 *           nullable: true
 *           example: "https://cdn.pixabay.com/photo/2024/05/07/00/59/hulk-8744607_1280.jpg"
 *         is_active:
 *           type: boolean
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-09-18 21:41:43"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2024-09-18 21:41:43"
 */