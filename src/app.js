import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "../configs/swagger.options.js";

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-refresh-token"],
};

const app = express();

app.use(cors(corsOptions));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json({ limit: "24kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "24kb" }));
app.use(express.static("public"));

// -- API URL
const api_v1 = "/api/v1";

// -- Routes Imports --
import admissionRoutes from "../routes/admission.routes.js";
import feesRoutes from "../routes/fees.routes.js";
import communicationRoutes from "../routes/communication.routes.js";
import userRoutes from "../routes/user.routes.js";
import classRoutes from "../routes/class.routes.js";
import sectionRoutes from "../routes/section.routes.js";
import sessionRoutes from "../routes/session.routes.js";
import documentRoutes from "../routes/document.routes.js";
import studentRoutes from "../routes/student.routes.js";
import studentFeesRoutes from "../routes/student.fees.routes.js";

// -- Routes
app.use(`${api_v1}/admission`, admissionRoutes);
app.use(`${api_v1}/fees`, feesRoutes);
app.use(`${api_v1}/communication`, communicationRoutes);
app.use(`${api_v1}/user`, userRoutes);
app.use(`${api_v1}/class`, classRoutes);
app.use(`${api_v1}/section`, sectionRoutes);
app.use(`${api_v1}/session`, sessionRoutes);
app.use(`${api_v1}/document`, documentRoutes);
app.use(`${api_v1}/student`, studentRoutes);
app.use(`${api_v1}/student-fees`, studentFeesRoutes);

export { app };
