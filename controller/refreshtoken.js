import User from "../models/User.js";
import jwt from "jsonwebtoken";

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(403); 
  const refreshToken = cookies.jwt;

  const findUser = await User.findOne({ refreshToken }).exec();
  if (!findUser) return res.sendStatus(403); 
  jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, decoded) => {
    if (err || findUser.username !== decoded.username)
      return res.sendStatus(403);
    const username = findUser.forename
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.username,
        },
      },
      process.env.JWT_TOKEN,
      { expiresIn: "15m" }
    );
    res.json({ username, accessToken });
  });
};

export { handleRefreshToken };
