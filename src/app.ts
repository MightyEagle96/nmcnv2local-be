import express from "express";

const app = express();

app
  .use(express.json())

  .listen(4001, () => console.log("listening on port 4001"));
