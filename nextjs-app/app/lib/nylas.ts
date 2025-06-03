import Nylas from "nylas";

 export const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_KEY!,
  apiUri: process.env.NYLAS_API_URI!,
}); 

export const nylasConfig = {
  clientId: process.env.NYLAS_CLIENT_ID,
  callbackUri: process.env.NEXT_PUBLIC_URL + "/api/oauth/callback",
  apiKey: process.env.NYLAS_API_SECRET_KEY,
  apiUri: process.env.NYLAS_API_URL,
};