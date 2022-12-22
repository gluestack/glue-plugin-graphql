var request = require("request");

export async function postMetataData(
  endpoint: string,
  body: any,
  secret: string,
) {
  return new Promise((resolve, reject) => {
    request.post(
      endpoint,
      {
        json: body,
        headers: {
          "content-type": "application/json",
          "x-hasura-admin-secret": secret,
        },
      },
      function (error: any, response: any, body: any) {
        if (!error && response.statusCode == 200) {
          return resolve(true);
        }
        return reject("Could not apply metadata");
      },
    );
  });
}
