import { Router } from "express";
import { signUp, logIn } from "@/controllers/auth.controller";
import { validateBody } from "@/middlewares/validation.middleware";
import { signUpSchema, logInSchema } from "@/schema/auth.schema";
import { googleAuth } from "@/controllers/auth.controller";

const routes = Router({caseSensitive: true, strict: true});

routes.post('/signup', validateBody(signUpSchema), signUp);
routes.post('/login', validateBody(logInSchema), logIn);
routes.post('/google', googleAuth);

export default routes;