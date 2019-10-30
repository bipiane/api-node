import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./usuario";

const routes = Router();

routes.use("/auth", auth);
routes.use("/usuarios", user);

export default routes;
