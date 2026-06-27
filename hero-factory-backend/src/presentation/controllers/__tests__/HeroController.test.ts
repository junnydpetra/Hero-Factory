import request from 'supertest';
import express from 'express';
import { heroRoutes } from '../../routes/hero.routes';
import { errorHandler } from '../../middlewares/errorHandler';
import { pool } from '../../../config/database';

const app = express();
app.use(express.json());
app.use('/api/v1/heroes', heroRoutes);
app.use(errorHandler);

describe('HeroController (Teste de Integração)', () => {
    const idsCriados: string[] = [];

    afterAll(async () => {
        if (idsCriados.length > 0) {
            await pool.query('DELETE FROM heroes WHERE id IN (?)', [idsCriados]);
        }
        await pool.end();
    });

    it('deve retornar 201 e o herói criado na rota POST /api/v1/heroes', async () => {
        const resposta = await request(app)
            .post('/api/v1/heroes')
            .send({
                name: 'Tony Stark',
                nickname: 'Homem de Ferro',
                date_of_birth: '1963-03-25',
                universe: 'Marvel',
                main_power: 'Engenharia Genial',
                avatar_url: 'https://exemplo.com/tony.jpg'
            });

        expect(resposta.status).toBe(201);
        expect(resposta.body).toHaveProperty('id');
        expect(resposta.body.nickname).toBe('Homem de Ferro');
        idsCriados.push(resposta.body.id);
    });

    it('deve retornar 400 se os campos obrigatórios estiverem faltando no POST /api/v1/heroes', async () => {
        const resposta = await request(app)
            .post('/api/v1/heroes')
            .send({
                name: 'Bruce Wayne',
                universe: 'DC',
                main_power: 'Bilionário'
            });

        expect(resposta.status).toBe(400);
        expect(resposta.body).toHaveProperty('error', true);
    });

    it('deve retornar 404 se o herói não for encontrado no GET /api/v1/heroes/:id', async () => {
        const resposta = await request(app)
            .get('/api/v1/heroes/00000000-0000-0000-0000-000000000000');

        expect(resposta.status).toBe(404);
    });

    it('deve listar heróis com paginação na rota GET /api/v1/heroes', async () => {
        const resposta = await request(app).get('/api/v1/heroes?page=1');

        expect(resposta.status).toBe(200);
        expect(resposta.body).toHaveProperty('heroes');
        expect(resposta.body).toHaveProperty('total');
        expect(Array.isArray(resposta.body.heroes)).toBe(true);
    });

    it('deve atualizar um herói ativo na rota PATCH /api/v1/heroes/:id', async () => {
        const criado = await request(app)
            .post('/api/v1/heroes')
            .send({
                name: 'Natasha Romanoff',
                nickname: 'Viúva Negra',
                date_of_birth: '1984-11-22',
                universe: 'Marvel',
                main_power: 'Combate corpo a corpo',
            });
        idsCriados.push(criado.body.id);

        const resposta = await request(app)
            .patch(`/api/v1/heroes/${criado.body.id}`)
            .send({ main_power: 'Espionagem' });

        expect(resposta.status).toBe(200);
        expect(resposta.body.main_power).toBe('Espionagem');
    });

    it('deve desativar um herói (soft delete) na rota DELETE /api/v1/heroes/:id e bloquear edição', async () => {
        const criado = await request(app)
            .post('/api/v1/heroes')
            .send({
                name: 'Clint Barton',
                nickname: 'Gavião Arqueiro',
                date_of_birth: '1971-01-07',
                universe: 'Marvel',
                main_power: 'Pontaria',
            });
        idsCriados.push(criado.body.id);

        const exclusao = await request(app).delete(`/api/v1/heroes/${criado.body.id}`);
        expect(exclusao.status).toBe(204);

        const tentativaEdicao = await request(app)
            .patch(`/api/v1/heroes/${criado.body.id}`)
            .send({ name: 'Novo Nome' });
        expect(tentativaEdicao.status).toBe(403);
    });

    it('deve reativar um herói desativado na rota PATCH /api/v1/heroes/:id/reactivate', async () => {
        const criado = await request(app)
            .post('/api/v1/heroes')
            .send({
                name: 'Wanda Maximoff',
                nickname: 'Feiticeira Escarlate',
                date_of_birth: '1989-02-10',
                universe: 'Marvel',
                main_power: 'Magia do caos',
            });
        idsCriados.push(criado.body.id);

        await request(app).delete(`/api/v1/heroes/${criado.body.id}`);

        const reativacao = await request(app).patch(`/api/v1/heroes/${criado.body.id}/reactivate`);
        expect(reativacao.status).toBe(204);

        const tentativaNovaReativacao = await request(app).patch(`/api/v1/heroes/${criado.body.id}/reactivate`);
        expect(tentativaNovaReativacao.status).toBe(400);
    });
});