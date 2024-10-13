import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "../db/mongo.db.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port: ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

app.all("/", (_, res) => {
  console.log("Just got a request!");
  res.send(`
    <center>
      <b style="font-size: 42px;">
        Future Leader International School Backend API's are running!<br>
        Developer: Apparium Dev Team
      </b>
    </center>
 `);
});
