import { IApiResponse } from "../../interface/apiResponse";
import { HttpStatusCode } from "../../types/httpCode";
import dotenv from "dotenv";

dotenv.config();

const CALLMEBOT_API_URL = process.env.CALLMEBOT_API_URL;
const API_KEY = process.env.API_KEY;
const phone = process.env.ADMIN_PHONE;
const defaultMessage = `Ini pesan dari admin`;

async function SendNoticationService(message?: string): Promise<IApiResponse> {
  try {
    if (API_KEY === undefined) {
      return {
        status: 500,
        message: "API_KEY is not defined",
        data: null,
      };
    }
    if (phone === undefined) {
      return {
        status: 500,
        message: "phone is not defined",
        data: null,
      };
    }

    const notifcationMessage = message ? message : defaultMessage;
    const encodedMessage = encodeURIComponent(notifcationMessage);
    const url = `${CALLMEBOT_API_URL}?phone=${phone}&text=${encodedMessage}&apikey=${API_KEY}`;

    const response = await fetch(url);
    const responseText = await response.text();

    if (!response.ok) {
      return {
        status: response.status as HttpStatusCode,
        message: `Failed to send message to ${phone}: ${response.status} - ${responseText}`,
        data: null,
      };
    }

    return {
      status: response.status as HttpStatusCode,
      message: `Message successfully sent to ${phone}: ${responseText}`,
      data: null,
    };
  } catch (error) {
    return {
      status: 500,
      message: `An error occurred while sending a message to ${phone}: ${error}`,
      data: null,
    };
  }
}

export default SendNoticationService;
