import cors from "cors";
import express, { Application } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import errorHandling from "@/middlewares/errorhandler.middleware";
import { notFoundHandler } from "@/utils/notfound.utils";
import authRoutes from "@/routes/auth.routes";
import userRoutes from "@/routes/user.routes";  
import transactionRoutes from "@/routes/transaction.routes";  
import aiRoutes from "@/routes/ai.routes";
import reportRoutes from "@/routes/report.routes"
import rateLimit from "express-rate-limit";
import helmet from "helmet";



dotenv.config();

export const createApp = (): Application => {
  
  const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 5,                     // only 5 attempts per IP per window (low, so you can test it fast)
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "failed", message: "Too many attempts, try again later." },
});


  const app: Application = express();

  app.use(helmet());

  app.use(express.json({limit: '10kb'}));

  // Use Morgan logger in development only
  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }


  app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") ?? [],  // only your frontends
  credentials: true,
  }));


  //Routes
  app.use('/api/auth', authLimiter, authRoutes);
  app.use('/api/user/profile',userRoutes)
  app.use('/api/transactions',transactionRoutes)
  app.use('/api/ai', aiRoutes)   
  app.use('/api/reports',reportRoutes)



  app.use(notFoundHandler);



  app.use(errorHandling)

  return app;
};
