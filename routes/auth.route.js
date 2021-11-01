import express from "express";
import { readFile } from "fs/promises";
import validate from "../middlewares/validate.mdw.js";
import * as userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";
import { JWT_SECRET } from "../config/secrets.js";

const registerSchema = JSON.parse(await readFile(new URL("../schemas/register.json", import.meta.url)));
const loginSchema = JSON.parse(await readFile(new URL("../schemas/login.json", import.meta.url)));
const refreshSchema = JSON.parse(await readFile(new URL("../schemas/refresh.json", import.meta.url)));

const router = express.Router();

router.post("/register", validate(registerSchema), async (req, res) => {
  let user = req.body;

  if (await userModel.findByUsername(user.username)) {
    return res.status(400).json({
      message: "Username already exists",
    });
  }

  user.password = bcrypt.hashSync(user.password, 10);
  const result = await userModel.add(req.body);

  delete user.password;

  user = {
    user_id: result[0],
    ...user,
  };

  res.json(user);
});

router.post("/login", validate(loginSchema), async (req, res) => {
  const user = await userModel.findByUsername(req.body.username);

  if (!user) {
    return res.status(400).json({
      message: "Username does not exist",
    });
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(400).json({
      message: "Password is incorrect",
    });
  }

  const token = jwt.sign(
    {
      user_id: user.user_id,
      username: user.username,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  const refreshToken = randomstring.generate(64);

  await userModel.updateRefreshToken(user.user_id, refreshToken);

  res.json({
    token,
    refreshToken,
  });
});

router.post("/refresh", validate(refreshSchema), async (req, res) => {
  const user = await userModel.findByRefreshToken(req.body.refreshToken);

  if (!user) {
    return res.status(400).json({
      message: "Refresh token is invalid",
    });
  }

  const token = jwt.sign(
    {
      user_id: user.user_id,
      username: user.username,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.json({
    token,
  });
});

router.post("/logout", validate(refreshSchema), async (req, res) => {
  const user = await userModel.findByRefreshToken(req.body.refreshToken);

  if (!user) {
    return res.status(400).json({
      message: "Refresh token is invalid",
    });
  }

  await userModel.updateRefreshToken(user.user_id, null);

  res.json({
    message: "Logged out successfully",
  });
});

export default router;
