import os from "os";
import fetch from "node-fetch";
import express from "express";

var app = express();

app.get("/", function (req, res) {
  res.send("Hey i am microService 2 and my host is : " + os.hostname());
});

app.get("/service2", function (req, res) {
  res.send("Hey i am microService 2 and my host is this: " + os.hostname());
});

app.listen(8080, () => {
  console.log("Something's cooking");
});
