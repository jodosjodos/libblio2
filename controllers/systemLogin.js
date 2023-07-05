import * as dotenv from "dotenv";
import.meta.url;
dotenv.config();
import _ from "lodash";
import { School } from "../models/school.model.js";
import { User } from "../models/e-users.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const SystemLogin = async (req, res) => {
  try {
    const { inputEmail, password, rememberMe } = req.body;

      let user = await School.findOne({ librarianEmail: inputEmail });
      if (!user) {
        user = await User.findOne({ email: inputEmail });
      }

    if (!user) {
      console.log("User was not found with that email");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      console.log("Invalid password");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.isBlocked) {
      console.log("User is blocked");
      return res.status(401).json({ error: "User is blocked" });
    }

    const token = jwt.sign(
      _.pick(user, ["_id","school", "role", "isBlocked"]),
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "90d" : "1d" }
    );

    console.log(token);

    return res.status(200).json(_.pick(user, ["_id", "token"]));


  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

School.collection.createIndex({ librarianEmail: 1 });
User.collection.createIndex({ email: 1 });
