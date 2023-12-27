import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { PORT } from "./config.js";
import { pool } from "./db.js";
import cron from "node-cron";
import userRoutes from "./routes/User.route.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(bodyParser.json({ limit: "10mb" }));
app.use(cors());

/* router */

app.use("/api/user", userRoutes);

/* delete database 12 PM*/

cron.schedule(
  "0 12 * * *",
  async () => {
    try {
      // Perform the database cleanup here
      const deleteQuery = "DELETE FROM message4"; // Replace with your actual table name
      const result = await pool.query(deleteQuery);
      console.log("Database cleanup successful:", result);
    } catch (error) {
      console.error("Error during database cleanup:", error);
    }
  },
  {
    scheduled: true,
    timezone: "America/New_York", // Replace with your actual timezone (e.g., 'America/New_York')
  }
);

io.on("connection", async (socket) => {
  console.log("se conecto un cliente");

  /* just for the rest of the users - not current */
  socket.broadcast.emit("chat_message", {
    usuario: "Chat.IO ASISTENTE",
    message: "Un usuario se ha unido al chat",
    image:
      "https://i.pinimg.com/originals/03/bf/86/03bf862d7b189c5d587930f0585be2eb.gif",
  });

  /* this happends when user call this as a "FUNCTION" */
  socket.on("chat_message", async (data) => {
    let result;
    const myQuery = `INSERT INTO messages4 (id, usuario, message, date, image) VALUES (?, ?, ?, ?, ?)`;
    const localBody = [
      data.id,
      data.usuario,
      data.message,
      data.date,
      data.image,
    ];

    try {
      result = await pool.query(myQuery, localBody);
    } catch (error) {
      console.log(error);
      return;
    }
    io.emit("chat_message", data, result[0].insertId.toString());
  });

  //this happends first
  if (!socket.recovered) {
    //dont get messages without connection
    try {
      const [results] = await pool.query(
        `SELECT * FROM messages4 WHERE id > ${
          socket.handshake.auth.serverOffset | 0
        }`
      );
      results.forEach((row) => {
        socket.emit("chat_message", row, row.id.toString());
      });
    } catch (error) {
      console.log(error);
    }
  }
});

/* use the server instead of the app */
server.listen(PORT, () => {
  console.log("connected", PORT);
});
