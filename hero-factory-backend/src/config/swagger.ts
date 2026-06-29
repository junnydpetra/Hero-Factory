import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hero Factory API',
            version: '1.0.0',
            description: 'API para gerenciamento de heróis (CRUD, Soft Delete, Ativação)',
        },
        servers: [{ url: 'http://localhost:3333' }],
    },
    apis: ['./src/presentation/routes/*.ts', './src/presentation/controllers/*.ts'],
};

export const specs = swaggerJsdoc(options);