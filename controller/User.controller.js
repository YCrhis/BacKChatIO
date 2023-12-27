import { pool } from "../db.js";

export const RegisterUser = async (req, res) => {
  try {
    const { id, name, image, state, email } = req.body;
    const sql = `INSERT INTO users (id, name, image, state, email) VALUES (?, ?, ?, ?, ?)`;
    const localBody = [id, name, image, state, email];
    await pool.query(sql, localBody);
    res.status(200).send({ data: req.body, status: 200 });
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: error, status: 500 });
  }
};

export const ListUsers = async (req, res) => {
  try {
    const sql = `SELECT * FROM users`;
    const [result] = await pool.query(sql);
    res.status(200).send({ data: result, status: 200 });
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: error, status: 500 });
  }
};
