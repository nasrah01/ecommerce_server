import User from '../models/User.js'

const register = async(req, res) => {
  try {
    const { forename, surname, username, password } = req.body
    const user = await User.create({forename, surname, username, password})
    const token = user.createJWT();

    res.status(201).json({forename, surname, username, password, token})
  } catch (error) {
    res.status(500).json({msg:'error'})
  }
}

const login = async(req, res) => {
  const {username, password} = req.body
  if(!username || !password) {
    res.status(500).json({msg: 'username and password is required'})
  }


  const user = await User.findOne({username}).select('+password')

  if(!user) {
    res.status(500).json({msg: 'Invalid username'})
  }

  const isCorrect = await user.matchPasswords(password)

  if(!isCorrect) {
    res.status(500).json({ msg: "Invalid password" });
  }

  const token = user.createJWT()
  user.password = undefined

  res.status(201).json({ username, token });
}

export {register, login}