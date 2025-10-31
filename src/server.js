import express from "express";
import path from "path";
import exphbs from "express-handlebars";
import morgan from "morgan";
import methOverride from "method-override";
import flash from "connect-flash";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { JWT_CONFIG } from "./config/jwt.js";

import { indexRouter } from "./routes/indexRoutes.js";
import { notesRouter } from "./routes/notesRoutes.js";
import { userRouter } from "./routes/userRoutes.js";
import { categoryRouter } from "./routes/categoryRoute.js";


import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

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
    helpers: {
      eq: (a, b) => a === b,
    },
  })
);

app.set("view engine", ".hbs");

//midllewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methOverride("_method"));

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 60,
    }),
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");

  const token = req.cookies?.[JWT_CONFIG.name];
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_CONFIG.secret);

      res.locals.user = {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name || "User",
      };

      req.user = res.locals.user; // útil para controladores
    } catch (err) {
      res.locals.user = null; // token vencido o inválido
    }
  } else {
    res.locals.user = null; // sin token
  }

  next();
});

app.use(express.static(path.join(__dirname, "public")));

//routes
app.use(indexRouter);
app.use(notesRouter);
app.use(userRouter);
app.use(categoryRouter)

export default app;
