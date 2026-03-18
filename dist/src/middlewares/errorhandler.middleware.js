import { handleAllErrors } from "../utils/response.utils";
const errorHandling = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    handleAllErrors(err, res);
};
export default errorHandling;
