const express = require("express");
const mysql = require("mysql");
const app = express();

const db = mysql.createConnection({
  host: "database-1.camtzwukoks9.us-east-1.rds.amazonaws.com",
  port: "3306",
  user: "admin",
  password: "123456789",
  database: "myDataBase",
});

db.connect((err) => {
  if (err) {
    console.log(err.message);
    return;
  }

  console.log("Database Connected.");
});

const getUsers = async (req, res, next) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.log(err.message);
      return;
    }

    console.log(results);

    res.json(results);
  });
};

const checkUserNameAPI = async (req, res, next) => {
  const userExists = await checkUserName(req.query.userName);

  if (userExists) {
    console.log("User name already exists.");
  } else {
    console.log("Nice user name!");
  }

  res.json(userExists);
};

const checkUserName = (userName) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM user WHERE username = ?",
      [userName],
      (err, results) => {
        if (err) {
          console.log(err.message);
          reject(err);
        } else {
          resolve(results.length > 0);
        }
      }
    );
  });
};

const signUpUser = async (req, res, next) => {
  let userName = req.body.userName;
  let password = req.body.password;

  try {
    const userExists = await checkUserName(userName);

    if (userExists) {
      console.log("Username already exists");
      res.json(false);
      return;
    }

    db.query(
      "INSERT INTO user (username, password) VALUES (?, ?)",
      [userName, password],
      (err, insertResult) => {
        if (err) {
          console.log(err.message);
          res.json(false);
          return;
        }

        console.log("User created successfully");
        res.json(true);
      }
    );
  } catch (err) {
    console.log(err.message);
    res.json(false);
  }
};

const signInUser = async (req, res, next) => {
  let userName = req.query.userName;
  let password = req.query.password;

  db.query(
    "SELECT * FROM user WHERE username = ?",
    [userName],
    (err, results) => {
      if (err) {
        console.log(err.message);
        return;
      }

      if (results.length > 0) {
        const userPassword = results[0].password;
        if (password == userPassword) {
          console.log("Success!");
          res.json(results[0].user_id);
        } else {
          console.log("Password is wrong");
          res.json();
        }
      } else {
        console.log("User not found");
        res.json();
      }
    }
  );
};

const addContactInfo = async (req, res, next) => {
  const userId = req.body.userId;
  console.log(userId);
  const { imageUrl, fName, lName, email, phone } = req.body;

  db.query(
    "INSERT INTO contact (image, first_name, last_name, email, phone_number) VALUES (?, ?, ?, ?, ?)",
    [imageUrl, fName, lName, email, phone],
    (err, result) => {
      if (err) {
        console.log(err.message);
        return;
      }

      const contactId = result.insertId;

      db.query(
        "INSERT INTO user_contact (user_id, contact_id) VALUES (?, ?)",
        [userId, contactId],
        (err, result) => {
          if (err) {
            console.log(err.message);
            return;
          }

          console.log("Contact added successfully");
          res.json({ success: true });
        }
      );
    }
  );
};

const getAllContacts = async (req, res, next) => {
  const userId = req.query.userId;

  try {
    const result = await db.query(
      "SELECT * FROM contact INNER JOIN user_contact ON contact.contact_id = user_contact.contact_id WHERE user_contact.user_id = ?",
      [userId],
      (err, result) => {
        if (err) {
          console.log(err.message);
          return;
        }

        const contacts = {
          contact_id: result.contact_id,
          image: result.image,
          first_name: result.first_name,
          last_name: result.last_name,
          email: result.email,
          phone_number: result.phone_number,
          created_at: result.created_at,
        };

        res.json({ success: true, result });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, error: "Failed to fetch contacts" });
  }
};

const updateContact = async (req, res, next) => {
  const contactId = req.body.contact_id; 
  const { imageUrl, fName, lName, email, phone } = req.body;

  try {
    const result = await db.query(
      "UPDATE contact SET image = ?, first_name = ?, last_name = ?, email = ?, phone_number = ? WHERE contact_id = ?",
      [imageUrl, fName, lName, email, phone, contactId],
      (err, result) => {
        if (err) {
          console.log(err.message);
          return;
        }

        console.log(result);
        res.json({ success: true, result });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, error: "Failed to update contact" });
  }
};

const deleteContact = async (req, res, next) => {
  const contactId = req.body.contact_id;

  try {
    await db.query(
      "DELETE FROM user_contact WHERE contact_id = ?",
      [contactId],
      (err, result) => {
        if (err) {
          console.log(err.message);
          return;
        }
        console.log("Removed from user_contact: ", result);
      }
    );

    await db.query(
      "DELETE FROM contact WHERE contact_id = ?",
      [contactId],
      (err, result) => {
        if (err) {
          console.log(err.message);
          return;
        }

        console.log("Removed from contact: ", result);
        res.json({ success: true, message: 'Contact successfully deleted.' });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, error: "Failed to delete contact" });
  }
};

exports.deleteContact = deleteContact;
exports.updateContact = updateContact;
exports.getAllContacts = getAllContacts;
exports.addContactInfo = addContactInfo;

exports.getUsers = getUsers;
exports.signInUser = signInUser;
exports.signUpUser = signUpUser;
exports.checkUserNameAPI = checkUserNameAPI;
