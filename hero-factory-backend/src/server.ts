import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { heroRoutes } from './presentation/routes/hero.routes';
import { errorHandler } from './presentation/middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'API is running' });
});

app.use('/api/v1/heroes', heroRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));