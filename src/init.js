import "./db";
import Video from "./models/Video";
import app from "./server";

const handleListending = () => console.log("Server listening...");
app.listen(4000, "0.0.0.0", handleListending);
