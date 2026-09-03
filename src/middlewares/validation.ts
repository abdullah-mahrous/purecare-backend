import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express"
import { appError } from "../utilities/appError";

type ValidationTarget = "body" | "query" | "params";

const validation = (validationSchema: ZodType, target: ValidationTarget = "body") => (req: Request, _res: Response, next: NextFunction) => {
    const result = validationSchema.safeParse(req[target]);

    if(!result.success) {
        let errors = result.error.issues.map((issue) => issue.message).join(", ")

        return next(new appError(errors, 400));
    }

    if (target === "body") req.body = result.data;
    if (target === "query") req.query = result.data as Request["query"];
    if (target === "params") req.params = result.data as Request["params"];
    next();
}

export default validation;
