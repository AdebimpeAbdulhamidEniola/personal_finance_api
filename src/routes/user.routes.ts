import { validateBody } from "@/middlewares/validation.middleware";
import { Router } from "express";
import { getProfile, updateProfile } from "@/controllers/user.controller";
import { updateUserProfileSchema } from "@/schema/user.schema";


const routes = Router({caseSensitive: true, strict: true});

routes.get('/', getProfile);
routes.put('/', validateBody(updateUserProfileSchema), updateProfile);

export default routes;