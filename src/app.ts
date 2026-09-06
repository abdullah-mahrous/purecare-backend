// packeges
import express from 'express'
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
// configs
import enVars from "./config/environment";
import API_SPECS from "./swagger/swaggerDocs";
// middlewares
import errorHandler from './middlewares/errorHandler'
// routes
import authRoutes from "./features/auth/auth.routes";
import siteGlobalDataRoutes from "./features/siteGlobalData/siteGlobalData.routes";
import servicesRoutes from "./features/services/services.routes";
import faqsRoutes from "./features/faqs/faqs.routes";
import testimonialsRoutes from "./features/testimonials/testimonials.routes";
import equipmentsRoutes from "./features/equipments/equipments.routes";
import reservationsRoutes from "./features/reservations/reservations.routes";
import careersRoutes from "./features/careers/careers.routes";
import uploadsRoutes from "./features/uploads/uploads.routes";

const app = express();

// Using helmet as a security middleware
app.use(helmet());

// CORS handling
app.use(
  cors({
    origin: enVars.corsOrigin,
  }),
);

// Body parsing with size limits to prevent Dos attacks
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
  
// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(API_SPECS));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/website-general-data", siteGlobalDataRoutes);
app.use("/api/faqs", faqsRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/equipment", equipmentsRoutes);
app.use("/api/reservations", reservationsRoutes);
app.use("/api/careers", careersRoutes);
app.use("/api/uploads", uploadsRoutes);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

export default app;
