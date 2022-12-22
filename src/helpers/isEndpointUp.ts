const http = require("http");

async function checkEndpoint(endpoint: string) {
  return new Promise((resolve, reject) => {
    http
      .get(endpoint, (res: any) => {
        resolve(`${endpoint} is up`);
      })
      .on("error", (error: any) => {
        reject(`${endpoint} is down: ${error.message}`);
      });
  });
}

export async function isEndpointUp(endpoint: string) {
  let count = 0;

  return new Promise((resolve, reject) => {
    let interval = setInterval(async () => {
      console.log(`Validating endpoint: ${endpoint}, retries: ${count + 1}`);

      checkEndpoint(endpoint)
        .then((res: any) => {
          clearInterval(interval);
          resolve(true);
        })
        .catch((e) => {
          //
        });
      if (count > 10) {
        return reject(`Endpoint: ${endpoint} is not up`);
      }
      ++count;
    }, 5000);
  });
}
