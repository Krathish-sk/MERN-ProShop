import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  //   Set JWT as an HTTP-only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    seccure: process.env.NODE_ENV !== "development",
    sameSite: "strict", //Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, //30Days
  });
};

export default generateToken;
