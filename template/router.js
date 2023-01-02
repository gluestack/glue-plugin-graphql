module.exports = () => [
  {
    "path": "/backend/graphql",
    "proxy": {
      "instance": "hasura:8080",
      "path": "/v1/graphql"
    }
  }
];
