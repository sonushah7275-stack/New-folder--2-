import jwt from "jsonwebtoken";

/**
 * Generate JWT token and set HTTP-only cookie on response
 * @param {Object} res - Express response object
 * @param {string} userId - MongoDB User ID
 * @returns {string} - Generated JWT token
 */
export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie("token", token, cookieOptions);
  return token;
};

/**
 * Generate JWT token only
 * @param {string} userId - MongoDB User ID
 * @returns {string} - Generated JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};
