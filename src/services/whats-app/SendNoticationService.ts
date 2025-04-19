import { IApiResponse } from "../../interface/apiResponse";
import { HttpStatusCode } from "../../types/httpCode";

const CALLMEBOT_API_URL = "https://api.callmebot.com/whatsapp.php";
const API_KEY = "1958309";
const phone = "6282260279005";
const defaultMessage = `Ini pesan dari admin`;

async function SendNoticationService(message?: string): Promise<IApiResponse> {
  try {
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
