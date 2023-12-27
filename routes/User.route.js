import { Router } from "express";
import { ListUsers, RegisterUser } from "../controller/User.controller.js";

const router = new Router();

router.post("/", RegisterUser);

router.get("/", ListUsers);

export default router;
