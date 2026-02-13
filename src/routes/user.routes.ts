import { validateBody } from "@/middlewares/validation.middleware";
import { Router } from "express";
import { getProfile, updateProfile } from "@/controllers/user.controller";
import { updateUserProfileSchema } from "@/schema/user.schema";
import { authenticate } from "@/middlewares/auth.middleware";


const routes = Router({caseSensitive: true, strict: true});

routes.get('/',authenticate, getProfile);
routes.put('/',  authenticate, validateBody(updateUserProfileSchema),  updateProfile);

export default routes;