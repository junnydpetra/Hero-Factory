import express from 'express';
import dotenv from 'dotenv';
import { heroRoutes } from './presentation/routes/hero.routes';
import { errorHandler } from './presentation/middlewares/errorHandler';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'API is running' });
});

app.use('/api/v1/heroes', heroRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));