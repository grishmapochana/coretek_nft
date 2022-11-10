const BASE_URL: string = "http://52.52.130.184:9999";

export async function uploadFile(
  file: any,
  fileNameWithExt: string,
  folderName: string = "/"
) {
  if (!file || !fileNameWithExt.includes(".")) {
    console.log("no file to upload or filename with extension is required");
    return;
  }
  file = new File([file], fileNameWithExt);
  const formdata = new FormData();
  formdata.append("file", file);
  formdata.append("name", file.name);
  if (!folderName.startsWith("/")) folderName = "/" + folderName;
  if (!folderName.endsWith("/")) folderName = folderName + "/";
  let res = await fetch(BASE_URL + `/upload?path=${folderName}`, {
    mode: "no-cors",
    method: "POST",
    body: formdata,
  });
  // console.log(res.status, res.statusText);
  console.log("file is uploaded !");
  return BASE_URL + folderName + fileNameWithExt;
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
