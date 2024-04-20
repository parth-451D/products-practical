import "dotenv/config";

export class Constants {
  public static readonly TIMEZONE = "Asia/Kolkata";
  public static readonly SUCCESS = "SUCCESS";
  public static readonly ERROR = "ERROR";
  public static readonly NOT_FOUND_ERROR = "NOT FOUND ERROR";
  public static readonly BAD_DATA = "BAD_DATA";
  public static readonly BACKEND_API_FAILURE = "BACKEND_API_FAILURE";
  public static readonly CODE = "CODE";
  public static readonly APPROVED = "APPROVED";
  public static readonly ACTIVE = 1;

  public static readonly INVALID_REQUEST = "INVALID_REQUEST";
  public static readonly SOCIAL_TYPE = {
    FACEBOOK: "FACEBOOK",
    GOOGLE: "GOOGLE",
  };
  public static readonly aws = {
    userImage: "user",
  };
  static SUCCESS_CODE: number = 200;
  static ERROR_CODE: number = 400;
  static BAD_REQUEST_CODE = 401;
  static INTERNAL_SERVER_CODE = 501;
  public static readonly FAIL_CODE = 400;
  public static readonly UNAUTHORIZED_CODE = 401;
  public static readonly HASH_PASSWORD_LENGTH = 10;
  public static readonly PASSWORD_RESET_FALSE = 0;
  public static readonly PASSWORD_RESET_TRUE = 1;

  public static readonly CARDKNOX_PAYLOAD = {
    xKey: process.env.CARDKNOX_API_KEY,
    xVersion: "5.0.0",
    xSoftwareName: "Loft",
    xSoftwareVersion: "1.0.0",
  };

  public static readonly XCOMMAND = {
    AUTHONLY: "cc:AuthOnly",
    REFUND: "cc:Refund",
    VOID: "cc:Void",
    CAPTURE: "cc:Capture",
    VOID_RELEASE: "cc:voidrelease"
  };

  public static readonly BOOKING_STATUS = {
    REQUESTED: "Requested",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    PAST: "Past",
  };

  public static readonly DATE_FORMAT = "yyyy-MM-DD"

  public static readonly MINIMUM_PURCHASE_FOR_PATRON_COUPON = 4
  public static readonly MINIMUM_PURCHASE_FOR_FIRST_COUPON = 1
}
