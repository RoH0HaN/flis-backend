import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-refresh-token"],
};

const app = express();

app.use(cors(corsOptions));
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

// -- Routes
app.use(`${api_v1}/admission`, admissionRoutes);
app.use(`${api_v1}/fees`, feesRoutes);
app.use(`${api_v1}/communication`, communicationRoutes);

export { app };
