import { create as ipfsHttpClient } from "ipfs-http-client";

var projectId = process.env.PROJECT_ID;
var projectSecret = process.env.PROJECT_SECRET;

const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = ipfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export default client; 