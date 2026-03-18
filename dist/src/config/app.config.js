import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import errorHandling from "@/middlewares/errorhandler.middleware";
import { notFoundHandler } from "@/utils/notfound.utils";
import authRoutes from "@/routes/auth.routes";
import userRoutes from "@/routes/user.routes";
import transactionRoutes from "@/routes/transaction.routes";
import aiRoutes from "@/routes/ai.routes";
import reportRoutes from "@/routes/report.routes";
dotenv.config();
export const createApp = () => {
    const app = express();
    app.disable('x-powered-by'); // Hide Express header for security
    app.use(express.json());
    // Use Morgan logger in development only
    if (process.env.NODE_ENV !== 'production') {
        app.use(morgan('dev'));
    }
    app.use(cors());
    //Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/user/profile', userRoutes);
    app.use('/api/transactions', transactionRoutes);
    app.use('/api/ai', aiRoutes);
    app.use('/api/reports', reportRoutes);
    app.use(notFoundHandler);
    app.use(errorHandling);
    return app;
};
