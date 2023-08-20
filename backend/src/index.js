import { app } from "./config/application.js";
import { prismaClient } from "./config/Database.js";

async function connectDatabase() {
  try {
    await prismaClient.$connect();
    console.log("Database Connect");
  } catch (error) {
    console.log(`Error ${error}`);
  }
}

connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Server Up And Running In PORT ${process.env.PORT}`);
});
