import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { notFound } from "./middleware/notfound.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// health check
app.get("/api/health", (req, res) => {
  res.json({ message: "backend running" });
});

// api routes
app.use("/api", routes);

// 404 + error
app.use(notFound);
app.use(errorHandler);

export default app;