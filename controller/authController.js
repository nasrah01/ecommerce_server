import User from '../models/User.js'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async(req, res) => {
  const { forename, surname, username, password } = req.body

  if(!forename || !surname || !username || !password) {
    return res.status(400).json({'msg': "all fields are required"})
  }

  const duplicate = await User.findOne({username}).exec()

  if(duplicate) return res.status(409).json({'msg': 'Username taken'})

  try {
    const hashedpwd = await bcrypt.hash(password, 10)
    const user = await User.create({forename, surname, username, password: hashedpwd})
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({msg:error.message})
  }
}

const login = async(req, res) => {
  const {username, password} = req.body 
  if(!username || !password) {
    return res.status(400).json({'msg': 'username and password are required'})
  }

  const findUser = await User.findOne({ username: username })
    .select("+password")
    .exec();

  if(!findUser) {
    return res.status(401).json({'msg': 'Username not found!'})
  } 

  const verify = await bcrypt.compare(password, findUser.password)
  if(!verify) {
    return res.status(401).json({ msg: "Password is incorrect, please try again!" });
  }

  if(verify) {
     const accessToken = jwt.sign(
       {
         UserInfo: {
           username: findUser.username,
         },
       },
       process.env.JWT_TOKEN,
       { expiresIn: '15m' }
     );

     const refreshToken = jwt.sign(
       { username: findUser.username },
       process.env.JWT_REFRESH_TOKEN,
       { expiresIn: process.env.JWT_TIME }
     );

     findUser.refreshToken = refreshToken
     const result = await findUser.save()
     console.log(result)

     res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });

     res.json({ accessToken});
  } else {
    res.sendStatus(401)
  }
}

const logout = async (req, res) => {

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  const user = await User.findOne({ refreshToken }).exec();
  if (!user) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  user.refreshToken = "";
  const result = await user.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

export {register, login, logout}