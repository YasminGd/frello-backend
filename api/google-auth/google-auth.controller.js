const googleAuthService = require('./google-auth.service')
const logger = require('../../services/logger.service')

async function login(req, res) {
  const { username } = req.body
  try {
    const user = await googleAuthService.login(username)
    const loginToken = googleAuthService.getLoginToken(user)
    //TODO: Handle failed login if the user is not registered
    logger.info('User login: ', user)
    res.cookie('loginToken', loginToken)
    res.json(user)
  } catch (err) {
    logger.error('Failed to Login ' + err)
    res.status(401).send({ err: 'Failed to Login' })
  }
}

async function signup(req, res) {
  try {
    const { username, fullname, imgUrl } = req.body
    logger.debug(fullname + ', ' + username)

    const account = await googleAuthService.signup(username, fullname, imgUrl)
    logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
    const user = await googleAuthService.login(username)
    console.log('signup ~ user', user)
    const loginToken = googleAuthService.getLoginToken(user)

    logger.info('User login: ', user)
    res.cookie('loginToken', loginToken)
    delete user.password
    res.json(user)
  } catch (err) {
    logger.error('Failed to signup ' + err)
    res.status(500).send({ err: 'Failed to signup' })
  }
}

module.exports = {
  login,
  signup,
}
