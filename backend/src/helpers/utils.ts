const path = require("path");
const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
import { keys } from "lodash";
import * as fs from "fs";
import { Constants } from "../config/constants";
import "dotenv/config";
import axios from "axios";
import "dotenv/config";

export class Utils {
  public static getHtmlContent = (filePath: string, replaceData: any) => {
    const data = fs.readFileSync(filePath);
    let html = data.toString();
    keys(replaceData).forEach((key) => {
      html = html.replace(key, replaceData[key]);
    });
    return html;
  };

  public static getSkipLimit = (
    page: number,
    recordsPerPage: number = null
  ) => {
    let skip = 0;
    const limit = recordsPerPage || 10;
    if (page) {
      skip = (page - 1) * limit;
    }
    return { limit, skip };
  };

  public static async emailSend(body) {
    const handlebarOptions = {
      viewEngine: {
        partialsDir: path.resolve("./views/"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./views/"),
    };
    let html = "";
    let replaceData = body?.context;
    if (body?.template) {
      const templatesDir = path.resolve(`${__dirname}/../`, "templates");
      const content = `${templatesDir}/${body?.template}.html`;
      html = this.getHtmlContent(content, replaceData);
    }

    const mailOptions = {
      from: process.env.MAIL_FROM,
      html,
      replyTo: process.env.MAIL_FROM,
      subject: body?.subject,
      to: body?.to,
      bcc: body?.to,
      text: "",
    };

    const transportObj = {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER_NAME,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(transportObj);

    transporter.use("compile", hbs(handlebarOptions));
    transporter.sendMail(mailOptions, (mailSendErr: any, info: any) => {
      console.log("sent mail successfully ", mailSendErr, info);
    });
  }

  public static generatePassword() {
    let length = 12;
    let characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0, n = characters.length; i < length; ++i) {
      password += characters.charAt(Math.floor(Math.random() * n));
    }
    return password;
  }

  public static async authOnlyRequest(cardDetails) {
    console.log("Constants.XCOMMAND.AUTHONLY", cardDetails);
    const cardknoxPayload = {
      ...Constants.CARDKNOX_PAYLOAD,
      ...cardDetails,
      xCommand: Constants.XCOMMAND.AUTHONLY,
    };
    return await axios.post(process.env.CARDKNOX_API_URL, cardknoxPayload);
  }

  public static async voidRequest(xRefNum) {
    const cardknoxPayload = {
      ...Constants.CARDKNOX_PAYLOAD,
      xRefNum: xRefNum,
      xCommand: Constants.XCOMMAND.VOID,
    };
    return await axios.post(process.env.CARDKNOX_API_URL, cardknoxPayload);
  }

  public static async voidReleaseRequest(xRefNum) {
    const cardknoxPayload = {
      ...Constants.CARDKNOX_PAYLOAD,
      xRefNum: xRefNum,
      xCommand: Constants.XCOMMAND.VOID_RELEASE,
    };
    return await axios.post(process.env.CARDKNOX_API_URL, cardknoxPayload);
  }

  public static async captureRequest(xRefNum) {
    const cardknoxPayload = {
      ...Constants.CARDKNOX_PAYLOAD,
      xRefNum: xRefNum,
      xCommand: Constants.XCOMMAND.CAPTURE,
    };
    return await axios.post(process.env.CARDKNOX_API_URL, cardknoxPayload);
  }

  public static async refundRequest(xRefNum, amount) {
    const cardknoxPayload = {
      ...Constants.CARDKNOX_PAYLOAD,
      xRefNum: xRefNum,
      xAmount: amount,
      xCommand: Constants.XCOMMAND.REFUND,
    };
    return await axios.post(process.env.CARDKNOX_API_URL, cardknoxPayload);
  }
}
