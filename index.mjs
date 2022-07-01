import os from "os";
import fetch from "node-fetch";
import express from "express";

var app = express();

app.get("/", function (req, res) {
  res.send("Hmm so that's the name of my host : " + os.hostname());
});

app.get("/nginx", async () => {
  const url = "http://nginx";
  const response = await fetch(url);
  const body = await response.text();
  res.send(body);
});

app.listen(8080, () => {
  console.log("Something's cooking");
});
