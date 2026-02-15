import cors from "cors";
import express, { Application } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import errorHandling from "@/middlewares/errorhandler.middleware";
import { notFoundHandler } from "@/utils/notfound.utils";
import authRoutes from "@/routes/auth.routes";
import userRoutes from "@/routes/user.routes";  
import transactionRoutes from "@/routes/transaction.routes";  



dotenv.config();

export const createApp = (): Application => {
  const app: Application = express();

  app.use(express.json())

  // Use Morgan logger in development only
  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }


  app.use(cors());


  //Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/user/profile',userRoutes)
  app.use('/api/transactions',transactionRoutes)
   



  app.use(notFoundHandler);



  app.use(errorHandling)

  return app;
};
