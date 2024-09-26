import express from "express";
import jwt from "jsonwebtoken";

export const isAuthenticate = async (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  try {
    const token = req.cookies[process.env.JWT_COOKIE_NAME ?? ""];
    if (!token) {
      return res.status(401).send("user not authenticate Unauthorized");
    }

    jwt.verify(token, process.env.JWT_SECRET ?? "", (err: any, user: any) => {
      if (err) {
        return res.status(403).send("user not authenticate");
      }
      req.user = user;
      next();
    });
  } catch (err: any) {
    return res.status(401).send(err.message);
  }
};
