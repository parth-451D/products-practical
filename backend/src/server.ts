import * as bodyParser from "body-parser"; // pull information from HTML POST (express4)
import * as compression from "compression";

import * as express from "express";
const helmet = require("helmet"); // Security
import * as l10n from "jm-ez-l10n";
import * as methodOverride from "method-override"; // simulate DELETE and PUT (express4)
import * as morgan from "morgan"; // log requests to the console (express4)
import { Log } from "./helpers/logger";
import { Routes } from "./routes";
import { Connection } from "./database";
import path = require("path");
import * as cors from "cors";
import "dotenv/config";
import * as fs from "fs";

import fileUpload = require("express-fileupload");

export class App {
  protected app: express.Application;
  private logger = Log.getLogger();
  constructor() {
    const nodeEnv = process.env.NODE_ENV;
    const PORT = process.env.PORT;
    this.app = express();
    this.app.use(cors());
    this.app.use(helmet());
    this.app.all("/*", (req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      // tslint:disable-next-line: max-line-length
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept,Access-Control-Allow-Headers, Authorization"
      );
      res.header("Access-Control-Allow-Methods", "*");
      res.header("Access-Control-Request-Headers", "*");
      if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
      } else {
        next();
      }
    });
    // database connection
    Connection.get();

    if (fs.existsSync("./.env")) {
      require("dotenv").config();
    }

    this.app.use(
      fileUpload({
        parseNested: true,
      })
    );

    this.app.use(morgan("dev")); // log every request to the console
    this.app.use(compression());
    l10n.setTranslationsFile("en", "src/language/translation.en.json");
    l10n.setLocale("en");
    this.app.use(l10n.enableL10NExpress);
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
    this.app.use(bodyParser.json(), (error, req, res, next) => {
      if (error) {
        return res.status(400).json({ error: req.t("ERR_GENRIC_SYNTAX") });
      }
      next();
    });
    this.app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json
    this.app.use(methodOverride());
    const routes = new Routes(nodeEnv);
    this.app.use("/api", routes.path());
    this.app.listen(PORT, () => {
      this.logger.info(`The server is running in port localhost: ${PORT}`);
    });
  }
}
