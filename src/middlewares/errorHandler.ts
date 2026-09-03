import { Request, Response, NextFunction } from "express";

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);

    if (err.code === "P2002") {
        return res.status(409).json({
            success: false,
            message: "A record with these unique values already exists",
        });
    }

    if (err.code === "P2025") {
        return res.status(404).json({ success: false, message: "Record not found" });
    }

    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal server error",
    });
};

export default errorHandler;