const userService = require('../user/user.service')
const logger = require('../../services/logger.service')
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

async function login(username) {
  logger.debug(`google-auth.service - login with username: ${username}`)

  const user = await userService.getByUsername(username)
  if (!user) return Promise.reject('Invalid username or password')

  delete user.password
  user._id = user._id.toString()
  return user
}

async function signup(username, fullname, imgUrl) {
  logger.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
  if (!username || !fullname) return Promise.reject('fullname, username and password are required!')

  const userExist = await userService.getByUsername(username)
  if (userExist) return Promise.reject('Username already taken')

  return userService.add({ username, fullname, imgUrl })
}

function getLoginToken(user) {
  return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
  try {
    const json = cryptr.decrypt(loginToken)
    const loggedinUser = JSON.parse(json)
    return loggedinUser
  } catch (err) {
    console.log('Invalid login token')
  }
  return null
}

module.exports = {
  signup,
  login,
  getLoginToken,
  validateToken,
}
