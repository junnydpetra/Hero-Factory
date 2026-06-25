import request from 'supertest';
import express from 'express';
import { heroRoutes } from '../../routes/hero.routes';
import { errorHandler } from '../../middlewares/errorHandler';

const app = express();
app.use(express.json());
app.use('/api/v1/heroes', heroRoutes);
app.use(errorHandler);

describe('HeroController (Teste de Integração)', () => {
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
            .get('/api/v1/heroes/uuid-inexistente');

        expect(resposta.status).toBe(404);
    });
});