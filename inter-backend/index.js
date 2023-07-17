const express = require("express");
const s3 = require("./database/awsS3");
const mysql = require("mysql");
const db = require("./database/mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json({ limit: "500mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "500mb",
    extended: true,
    parameterLimit: 500000,
  })
);

app.use(cors());

app.get("/Sign_in", db.signInUser);
app.post("/Sign_up", db.signUpUser);
app.get("/Sign_up", db.checkUserNameAPI);

app.post("/users/contacts", db.addContactInfo);
app.get("/users/contacts", db.getAllContacts);
app.put("/users/contacts", db.updateContact);
app.delete("/users/contacts", db.deleteContact);

app.post("/image", s3.uploadFileToS3);
app.get("/image", s3.downloadFileFromS3);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
