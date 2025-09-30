import express from "express";
import path from "path";
import exphbs from "express-handlebars";
import morgan from "morgan";
import methOverride from "method-override";
import flash from "connect-flash";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
//variables:
import { notesRouter } from "./routes/notesRoutes.js";
import { userRouter } from "./routes/userRoutes.js";
import { indexRouter } from "./routes/indexRoutes.js";
import "./config/passport.js";

import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// app.use("/api/user", userRoute);
export const app = express();

//settings
app.set("port", process.env.PORT || 4000);
app.set("views", path.join(__dirname, "views"));

// config view engine
app.engine(
  ".hbs",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);

app.set("view engine", ".hbs");

//midllewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methOverride("_method"));
app.use(session({ 
   secret: process.env.SESSION_SECRET,
   resave: true,
   saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null
  next();
});

//static files
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use(indexRouter);
app.use(notesRouter);
app.use(userRouter);
