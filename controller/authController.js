import User from '../models/User.js'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async(req, res) => {
  const { forename, surname, username, password } = req.body

  if(!forename || !surname || !username || !password) {
    return res.status(400).json({'msg': "all fields are required"})
  }

  const duplicate = await User.findOne({username}).exec()

  if(duplicate) return res.sendStatus(409)

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
    return res.sendStatus(401)
  } 

  const verify = await bcrypt.compare(password, findUser.password)
  if(verify) {
     const accessToken = jwt.sign(
       {
         UserInfo: {
           username: findUser.username,
         },
       },
       process.env.JWT_TOKEN,
       { expiresIn: '10m' }
     );

     const refreshToken = jwt.sign(
       { username: findUser.username },
       process.env.JWT_REFRESH_TOKEN,
       { expiresIn: process.env.JWT_TIME }
     );

     findUser.refreshToken = refreshToken
     const result = await findUser.save()

     res.cookie("jwt", refreshToken, {
       httpOnly: true,
       secure: true,
       sameSite: "None",
       maxAge: 24 * 60 * 60 * 1000,
     });

     res.json({ accessToken });
  } else {
    res.sendStatus(401)
  }
}

export {register, login}