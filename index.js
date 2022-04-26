const fs = require("fs-extra");
const { exec } = require("child_process");

const storeName = "notmystoreyet";
const newPort = 8082;

let step = 1;

console.log("> Copying project...");

function copyFolder() {
  const source = "./move_test";
  const destination = `./${storeName}`;

  fs.copy(source, destination, (err) => {
    if (err) {
      console.error(err);
    } else {
      step = 2;
      start();
    }
  });
}

function changePortNumber() {
  fs.readFile(`./${storeName}/index.js`, "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }
    // console.log(data);
    const result = data.replace(/3000/g, newPort);
    fs.writeFile(`./${storeName}/index.js`, result, "utf8", (err) => {
      if (err) {
        return console.log(err);
      } else {
        console.log("> Port changed to " + newPort);
        step = 3;
        start();
      }
    });
  });
}

function startServer() {
  exec(`cd ${storeName} && npm run start`, (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      console.log("Error: " + err);
      return;
    }
  });
}

function start() {
  if (step === 1) copyFolder();
  if (step === 2) changePortNumber();
  if (step === 3) {
    console.log(`> Server starting for: ${storeName}...`);
    startServer();
  }
}

start();
