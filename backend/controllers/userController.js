import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role, skills } = req.body;
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill full form!"));
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!"));
  }
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
    skills: skills || "",
  });
  sendToken(user, 201, res, "User Registered!");
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email ,password and role."));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  if (user.role !== role) {
    return next(
      new ErrorHandler(`User with provided email and ${role} not found!`, 404)
    );
  }
  sendToken(user, 201, res, "User Logged In!");
});

// POST /api/v1/user/google-auth
// body: { credential: "<Google ID token>", role: "Job Seeker" | "Employer" }
// `role` is only required the first time a brand-new Google account signs in.
export const googleAuth = catchAsyncErrors(async (req, res, next) => {
  const { credential, role } = req.body;
  if (!credential) {
    return next(new ErrorHandler("Missing Google credential.", 400));
  }
  if (!process.env.GOOGLE_CLIENT_ID) {
    return next(
      new ErrorHandler(
        "Google Sign-In is not configured on the server (missing GOOGLE_CLIENT_ID).",
        500
      )
    );
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (err) {
    return next(new ErrorHandler("Invalid or expired Google credential.", 401));
  }

  const { sub: googleId, email, name, picture } = payload;

  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (user) {
    // Existing account (may have originally registered with a password).
    // Link the Google id if it isn't linked yet, then log them in.
    if (!user.googleId) {
      user.googleId = googleId;
      user.authProvider = "google";
      if (!user.avatar) user.avatar = picture || "";
      await user.save({ validateBeforeSave: false });
    }
    return sendToken(user, 200, res, "Logged In With Google!");
  }

  // Brand-new user — we need a role to create the account.
  if (!role || !["Job Seeker", "Employer"].includes(role)) {
    return res.status(200).json({
      success: true,
      needsRole: true,
      message: "Please select a role to finish creating your account.",
      googleProfile: { email, name },
    });
  }

  user = await User.create({
    name,
    email,
    role,
    googleId,
    authProvider: "google",
    avatar: picture || "",
  });

  sendToken(user, 201, res, "Account Created With Google!");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});


export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});