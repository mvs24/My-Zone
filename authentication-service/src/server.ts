import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import authenticationRoutes from "./routes/authentication";
import { globalErrorHandler, HTTPError } from "@marius98/myzone-common-package";

const app = express();

app.set("trust proxy", true);
app.use(express.json());

app.use("/api/users", authenticationRoutes);

app.all("*", (_req: Request, _res: Response, next: NextFunction) =>
  next(new HTTPError("Route is not defined!", 404))
);

app.use(globalErrorHandler);

const startServer = async () => {
  console.clear();

  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET must be defined!");

  let MONGO_URI: string =
    process.env.NODE_ENV === "development"
      ? "mongodb://host.docker.internal:27017/myzone-users"
      : "mongodb://mongo-cluster-ip:27017/myzone-users";

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Authentication service database connected successfully.");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`Authentication service is listening on PORT ${PORT}.`)
    );
  } catch (error) {
    console.log(error);
    // process.exit(1);
  }
};

["uncaughtException", "unhandledRejection"].forEach((event) => {
  process.on(event, () => {
    process.exit(1);
  });
});

startServer();
