import express from "express";
import mongoose from "mongoose";
import authenticationRoutes from "./routes/authentication";

const app = express();

app.set("trust proxy", true);
app.use(express.json());

app.use("/api/users", authenticationRoutes);

const startServer = async () => {
  let MONGO_URI: string =
    process.env.NODE_ENV === "development"
      ? "mongodb://host.docker.internal:27017/myzone-users"
      : "mongodb://mongo-cluster-ip:27017/myzone-users";

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Authentication service database connected successfully.");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`Authentication service is listening on PORT:${PORT}.`)
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
