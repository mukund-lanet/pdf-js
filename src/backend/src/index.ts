import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/db';
import documentRoutes from './routes/documentRoutes';
import contractRoutes from './routes/contractRoutes';
import settingsRoutes from './routes/settingsRoutes';

import contractManagementRoutes from './routes/contractManagementRoutes';

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: 'https://localhost:3000',
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/documents', documentRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/contract-management', contractManagementRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
