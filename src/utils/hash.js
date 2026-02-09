import crypto from "crypto";

export const hashBody = (body) => {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(body))
    .digest("hex");
};
