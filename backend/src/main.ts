import express from "express";
import { router as v1Router } from "./api/v1/router";
import cookieParser from "cookie-parser";

const app = express();

const PORT = process.env.BACKEND_PORT || 8000;
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", v1Router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
