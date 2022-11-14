// sftp.js
//
// Use this sample code to connect to your SFTP run some file operations using Node.js.
//
// 1) Paste this code into a new file (sftp.js)
//
// 2) Install dependencies
//   npm install ssh2-sftp-client@^8.0.0
//
// 3) Run the script
//   node sftp.js
//
// Compatible with Node.js >= v12
// Using ssh2-sftp-client v8.0.0

let Client = require("ssh2-sftp-client");

class SFTPClient {
  constructor() {
    this.client = new Client();
  }

  async connect(options) {
    console.log(`Connecting to ${options.host}:${options.port}`);
    try {
      await this.client.connect(options);
    } catch (err) {
      console.log("Failed to connect:", err);
    }
  }

  async disconnect() {
    await this.client.end();
  }

  async listFiles(remoteDir, fileGlob) {
    console.log(`Listing ${remoteDir} ...`);
    let fileObjects;
    try {
      fileObjects = await this.client.list(remoteDir, fileGlob);
    } catch (err) {
      console.log("Listing failed:", err);
    }

    const fileNames = [];

    for (const file of fileObjects) {
      if (file.type === "d") {
        console.log(
          `${new Date(file.modifyTime).toISOString()} PRE ${file.name}`
        );
      } else {
        console.log(
          `${new Date(file.modifyTime).toISOString()} ${file.size} ${file.name}`
        );
      }

      fileNames.push(file.name);
    }

    return fileNames;
  }

  async downloadFile(remoteFile, localFile) {
    console.log(`Downloading ${remoteFile} to ${localFile} ...`);
    try {
      await this.client.get(remoteFile, localFile);
    } catch (err) {
      console.error("Downloading failed:", err);
    }
  }
}

(async () => {
  //* Open the connection
  const client = new SFTPClient();
  await client.connect({
    host: "files.lcly.co",
    username: "***",
    password: "***",
  });

  //* List working directory files
  await client.listFiles("./reports/full-product-catalog");

  //* Download remote file to local file
  await client.downloadFile("./reports/full-product-catalog/zoleo-products.csv", "./zoleo-products.csv");

  //* Close the connection
  await client.disconnect();
})();
