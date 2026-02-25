import { MantaClient } from "mantahq-sdk";

export const manta = new MantaClient({
  sdkKey: process.env.MANTAHQ_SDK_KEY!,
});
