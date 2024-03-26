//Imports
require("dotenv").config();
require("express-async-errors");
const express = require("express");
var bodyParser = require("body-parser");

//extra security packages
const heltmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const logger = require("morgan");


const nodemailerTemplate = require("./utils/templateMailer");

//Connect DB
const connectDB = require("./db/connect");

//middlewares
const authenticateUser = require("./middleware/authentication");

//routers
const authRouter = require("./routes/AuthRoute");
const productRouter = require("./routes/ProductRoute");
const orderRouter = require("./routes/OrderRoute");
const userRouter = require("./routes/UserRoute");
var path = require("path");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//app object definitions and configurations
const app = express();

// extra packages

app.use(
  heltmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(cors());
app.use(xss());
app.use(logger("dev"));
// app.use(
//   rateLimiter({
//     windowMs: 60 * 1000,
//     max: 60,
//   })
// );
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "1000mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("KRYSTALLIFE Server API");
});

// app.get('/emailTest',(req, res)=>{
//   nodemailerTemplate('amakash.warc@gmail.com', 'Test Template Email','Does not matter');
//   res.send("Email Send");
// })

//Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/user", userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8080;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};



start();
