import { AppError } from "@/utils/error.utils";
export const notFoundHandler = (req, res) => {
    throw new AppError(`Route ${req.originalUrl} not found`, 404);
};
