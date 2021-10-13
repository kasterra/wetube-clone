import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import app from "./server";

const handleListending = () => console.log("Server listening...");
app.listen(4000, "0.0.0.0", handleListending);
