import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";

import initializePassport from "./config/passport-config.js";
import authRoutes from "./routes/authRoutes.js";

initializePassport(passport);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
