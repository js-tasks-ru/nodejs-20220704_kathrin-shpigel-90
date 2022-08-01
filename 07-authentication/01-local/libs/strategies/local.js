const LocalStrategy = require('passport-local').Strategy;
const {v4: uuidv4} = require('uuid');
const User = require('../../models/User');

/**
 * For preparing user for a query response
 * @param {userSchema} user
 * @param {string} token
 * @return {{displayName: string, id: string, email: string, token: string}}
 */
function prepareUser(user, token) {
  return {
    id: user._id.toString(),
    email: user.email,
    displayName: user.displayName,
    token,
  };
}

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      const userDB = await User.findOne({email});

      if (!userDB) {
        return done(null, false, 'Нет такого пользователя');
      }

      const checkPassword = await userDB.checkPassword(password);

      if (!checkPassword) {
        return done(null, false, 'Неверный пароль');
      }

      const token = uuidv4();
      const user = prepareUser(userDB, token);

      done(null, user);
    },
);
