import { GraphQLLocalStrategy } from 'graphql-passport'
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import passport from 'passport'

export const configurePassport = async () => {
  passport.serializeUser((user, done) => {
    console.log('Serializing user')
    done(null, user.id)
  }) // serialize user to store in session

  passport.deserializeUser(async (id, done) => {
    console.log('Deserializing user')
    try {
      const user = await User.findById(id) // find user by id in database
      done(null, user)
    } catch (err) {
      done(err)
    }
  }) // deserialize user from session

  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username })
        if (!user) {
          throw new Error('Invalid username or password')
        }
        const isPasswordValid = await bcrypt.compare(password, user.password) // compare password with hashed password

        if (!isPasswordValid) {
          throw new Error('Invalid username or password')
        }

        return done(null, user)
      } catch (err) {
        return done(err)
      }
    })
  )
}
