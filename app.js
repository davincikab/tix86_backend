const express = require('express');
const expressip = require('express-ip');
const { authRouter, userRouter, otpRouter } = require('./src/users/routes');

const tixRouter = require("./src/tix86_subscription/routes");

const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({}));
app.use(express.urlencoded());

app.use(expressip().getIpInfoMiddleware);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


app.get("/", (req, res) => {
  res.send("Server running");
});


app.use(authRouter);
app.use(userRouter);
app.use(tixRouter);

// app.use(otpRouter);
// require('./routes')(app);

app.get("*", function(req, res) {
  res.send("Page Not Found");
});

const config = require('./config');

const PORT = process.env.PORT || config.port;

const server = app.listen(PORT, () => {
  console.log('server is running on port', server.address().port);
});

// module.exports = app;