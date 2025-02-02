import * as dotenv from "dotenv";
import express, { Application } from "express";
import session from "express-session";
import passport from "passport";
import moRouter from "./routers/moRouters";
import path from "path";
dotenv.config();

const app: Application = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "../src", "views"));

// Middleware to parse incoming JSON requests into JavaScript objects
app.use(express.json());
// Middleware to parse URL-encoded data (like form submissions)
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", moRouter);
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));