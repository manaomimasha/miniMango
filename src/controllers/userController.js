import { User } from "../models/User.js";
import passport from "passport";

const renderProfile = (req, res) => {
  res.render("user/profileUser");
};

const renderLogIn = (req, res) => {
  res.render("user/login");
};

const logIn = passport.authenticate("local", {
  successRedirect: "/notes/all-notes",
  failureRedirect: "/user/register",
  failureFlash: true,
});

const renderRegister = (req, res) => {
  res.render("user/register");
};

const register = async (req, res) => {
  const errors = [];
  const { name, email, password, password_confirm } = req.body;
  if (password != password_confirm) {
    errors.push({ text: "Passwords do not match" });
  }
  if (password.length < 4) {
    errors.push({ text: "Password must be at least 4 characters " });
  }
  if (errors.length > 0) {
    return res.render("user/register", { errors, name, email });
  } else {
    const userEmail = await User.findOne({ email: email });
    if (userEmail) {
      req.flash("error_msg", "This email is already in use");
      console.log("del controller:ya existe email");
      return res.redirect("/user/register");
    } else {
      const newUser = new User({ name, email, password });
      await newUser.save();
      return res.redirect("/user/login");
    }
  }

  console.log(req.body);
  // res.send("registered");
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "You are logged out");
    res.redirect("/");
  });
};

export { renderProfile, renderLogIn, logIn, renderRegister, register, logout };
