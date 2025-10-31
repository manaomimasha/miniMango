import 'dotenv/config';
import app from "./server.js";
import { db } from "./database.js";

db.then(() => {
  app.listen(app.get("port"), () => {
    console.log("server running on port: ", app.get("port"));
    console.log("database is connected yey");
    console.log('the port is:', app.get('port'), 'ahre q lo repetia')
  });
});

