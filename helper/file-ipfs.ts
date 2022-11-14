const BASE_URL: string = "http://52.52.130.184:9999";
import Client from "./ipfs";

export async function uploadFile(
  file: File,
  fileNameWithExt?: string,
  folderName: string = "/"
) {
    const uri = await Client.add(file, {
      progress: (prog: any) => console.log(`recieved: ${prog}`),
    });
    console.log("📌 👉 👨‍💻 uri", uri);
    const url = `https://coretek-nft.infura-ipfs.io/ipfs/${uri.path}`;
    return url;
}

export function createJSONFile(obj: object, fileName: string = "test") {
  let fn;
  if (!fileName) {
    console.log("please input the fileName");
    return;
  }
  if (!fileName.endsWith(".json")) {
    fn = `${fileName}.json`;
  } else {
    fn = fileName;
  }
  const blob: any = new Blob([JSON.stringify(obj)], {
    type: "application/json",
  }); // "text/plain"
  blob.name = "test";
  blob.lastModifiedDate = new Date();
  return new File([blob], fn);
}

export async function getJSONMetadata(
  fileName: string,
  folderName: string = "/"
) {
  let fn = fileName;
  if (!fileName) {
    console.log("please input the fileName");
    return;
  }
  if (!fileName.endsWith(".json")) {
    fn = `${fileName.trim()}.json`;
  } else {
    fn = fileName.trim();
  }
  if (!folderName.startsWith("/")) folderName = "/" + folderName;
  if (!folderName.endsWith("/")) folderName = folderName + "/";
  let res = await fetch(BASE_URL + folderName + fn);
  return await res.json();
}
