const express = require("express");
const Mercury = require("@postlight/mercury-parser");
// var { Readability } = require("@mozilla/readability");
const { getContent } = require("./getContent");
const getYoutube = require("./youtube");

const defaultPort = 5000;
const app = express();

const startServer = (port = defaultPort) => {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  // app.use(express.static("public"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // app.use("/assets", express.static("./src/assets"));

  app.get("/", async (request, response) => {
    response.status(200).send("OK");
  });

  app.post("/parse", async (request, response) => {
    const { url = "", html = "" } = request.body;
    if (!url && !html) {
      return response.status(400).send("No url included");
    }
    Mercury.parse(url, { html }).then((result) =>
      response.status(200).send(result)
    );
  });

  app.post("/get-images", async (request, response) => {
    const { text = "" } = request.body;
    response.status(200).send(await getContent(text));
  });

  app.get("/youtube", async (request, response) => {
    const { url = "" } = request.query;
    response.status(200).send(await getYoutube(url));
  });

  const server = app.listen(process.env.PORT || port, (error) => {
    if (error) return console.log(`Error: ${error}`);
    console.log(
      `Server is now ready. Open on browser: http://localhost:${
        server.address().port
      }/`
    );
  });
};

module.exports = startServer;
