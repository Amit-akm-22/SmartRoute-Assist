import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Client from "../models/client.js";
import { v4 as uuidv4 } from "uuid";

// HARDCODED SECRETS (Visible to all as requested)
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

import { OAuth2Client } from "google-auth-library";
const oauthClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export const register = async (req, res) => {
  try {
    const { name, phone, email, password, userType } = req.body;

    // check if phone already exists
    const existingPhone = await Client.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone already registered" });
    }
    let unique_code = "RFID-" + uuidv4(); // e.g., RFID-3fa85f64-5717-4562-b3fc-2c963f66afa6

    // check if email already exists (if provided)
    if (email) {
      const existingEmail = await Client.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new client
    const client = await Client.create({
      name,
      phone,
      email: email || null, // allow null if not provided
      userType,
      unique_code,
      password: hashedPassword,
    });

    // generate jwt token right after registration
    const token = jwt.sign(
      {
        client_id: client._id,
        phone: client.phone,
        email: client.email,
        userType: client.userType,
        unique_code: client.unique_code,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        client_id: client._id,
        name: client.name,
        phone: client.phone,
        email: client.email,
        userType: client.userType,
        unique_code: client.unique_code,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    // Handle duplicate entry gracefully
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: `Duplicate entry: ${error.fields ? JSON.stringify(error.fields) : "already exists"
          }`,
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { phone, email, password } = req.body;

    let client;
    if (phone) {
      client = await Client.findOne({ phone });
    } else if (email) {
      client = await Client.findOne({ email });
    }

    if (!client) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate jwt token
    const token = jwt.sign(
      {
        client_id: client._id,
        phone: client.phone,
        email: client.email,
        userType: client.userType,
        unique_code: client.unique_code,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        client_id: client._id,
        name: client.name,
        phone: client.phone,
        email: client.email,
        unique_code: client.unique_code,
        userType: client.userType,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, email, userType } = req.body;
    const client_id = req.user.client_id;

    const client = await Client.findById(client_id);
    if (!client) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (name) client.name = name;
    if (phone) client.phone = phone;
    if (email) client.email = email;
    if (userType) client.userType = userType;

    // Handle profile image if uploaded
    if (req.file) {
      client.profile_image = `/uploads/lost-found/${req.file.filename}`;
    }

    await client.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        client_id: client._id,
        name: client.name,
        phone: client.phone,
        email: client.email,
        unique_code: client.unique_code,
        userType: client.userType,
        profile_image: client.profile_image,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GOOGLE LOGIN
export const googleLogin = async (req, res) => {
  try {
    const { idToken, email: providedEmail, name: providedName, isAccessToken } = req.body;

    let email, name, picture;

    if (isAccessToken) {
      // If client sends access token directly, we use the provided info but ideally we should verify it
      // For now, since we fetched it on frontend from https://www.googleapis.com/oauth2/v3/userinfo
      email = providedEmail;
      name = providedName;
      picture = null; // Picture might not be directly available or needs separate handling
    } else {
      if (!idToken) {
        return res.status(400).json({ message: "ID Token is required for ID token flow" });
      }
      // Verify Google ID Token
      const ticket = await oauthClient.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
    }

    let client = await Client.findOne({ email });

    // If client doesn't exist, we don't create it here (to allow for userType selection on frontend)
    // or we can create it if that's the preferred flow. 
    // Usually, we return a flag if the user needs to complete profile.

    if (!client) {
      return res.status(200).json({
        message: "First time login. Please complete registration.",
        needsOnboarding: true,
        user: { email, name, picture }
      });
    }

    // generate jwt token
    const token = jwt.sign(
      {
        client_id: client._id,
        phone: client.phone,
        email: client.email,
        userType: client.userType,
        unique_code: client.unique_code,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        client_id: client._id,
        name: client.name,
        phone: client.phone,
        email: client.email,
        unique_code: client.unique_code,
        userType: client.userType,
        profile_image: client.profile_image,
      },
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ message: "Google Authentication failed" });
  }
};
