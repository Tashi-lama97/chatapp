require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

//All Routes import
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");
const contactRoutes = require("./routes/contact");
const userRoutes = require("./routes/user");

// DB conection
mongoose
  .connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

//Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

//Routes
app.use("/api", authRoutes);
app.use("/api", messageRoutes);
app.use("/api", contactRoutes);
app.use("/api", userRoutes);

//Port
port = process.env.PORT || 5000;

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//Strarting Server
app.listen(port, () => {
  console.log(`APP is running on port ${port}`);
});
