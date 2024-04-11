require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./db/conn");
const PORT = 6005;
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const userdb = require("./model/userSchema");

const axios = require("axios");

app.post("/send-data-to-zapier", async (req, res) => {
  try {
    const dataToSend = {
      userId: req.user._id,
      usageMetrics: req.body.usageMetrics,
    };

    await axios.post(
      "https://hooks.zapier.com/hooks/catch/18507725/3pjvt0y/",
      dataToSend
    );
    res.status(200).send("Data sent to Zapier successfully");
  } catch (error) {
    console.error("Error sending data to Zapier:", error);
    res.status(500).send("Error sending data to Zapier");
  }
});

const clientid =
  "732201950549-ta7pgjefrv0l23ntqb787lhcuq9q824i.apps.googleusercontent.com";
const clientsecret = "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";

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());

// setup session
app.use(
  session({
    secret: "123",
    resave: false,
    saveUninitialized: true,
  })
);

// setuppassport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy(
    {
      clientID: clientid,
      clientSecret: clientsecret,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userdb.findOne({ googleId: profile.id });

        if (!user) {
          user = new userdb({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          });

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// initial google ouath login
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/dashboard",
    failureRedirect: "http://localhost:3000/login",
  })
);

app.get("/login/sucess", async (req, res) => {
  if (req.user) {
    res.status(200).json({ message: "user Login", user: req.user });
  } else {
    res.status(400).json({ message: "Not Authorized" });
  }
});

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:3000");
  });
});

app.listen(PORT, () => {
  console.log(`server start at port no ${PORT}`);
});
