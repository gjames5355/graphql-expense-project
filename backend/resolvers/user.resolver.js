import User from '../models/user.model'
import bcrypt from 'bcryptjs'

const userResolver = {
  Query: {
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser()
        return user
      } catch (err) {
        console.error('Error in authUser: ', err)
        throw new Error(err.message || 'Internal server error')
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId)
        return user
      } catch (err) {
        console.error('Error in user query: ', err)
        throw new Error(err.message || 'Error getting user')
      }
    }
    // TODO => ADD USER/TRANSACTION RELATED QUERIES HERE
  },
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input

        if (!username || !name || !password || !gender) {
          throw new Error('Please fill all fields')
        }

        const userExist = await User.findOne({ username })

        if (userExist) {
          throw new Error('User already exists')
        }

        const salt = bcrypt.genSalt(10) // generate salt for password hashing with 10 rounds of salt generation (recommended)

        const hashedPassword = bcrypt.hash(password, salt) // hash password with salt generated above

        // https://avatar-placeholder.iran.liara.run/
        const maleProfilePic = `https://avatar-placeholder.iran.liara.run/public/boy?username=${username}`
        const femaleProfilePic = `https://avatar-placeholder.iran.liara.run/public/girl?username=${username}`

        const newUser = new User({
          username,
          name,
          password: hashedPassword,
          gender,
          profilePicture: gender === 'male' ? maleProfilePic : femaleProfilePic
        })

        await newUser.save() // save user to database
        await context.login() // login user after signup
        return newUser
      } catch (err) {
        console.error('Error in signUp: ', err)
        throw new Error(err.message || 'Internal server error')
      }
    },

    login: async (_, { input }, context) => {
      try {
        const { username, password } = input

        const { user } = await context.authenticate('graphql-local', {
          username,
          password
        })

        await context.login(user) // login user after login
        return user
      } catch (err) {
        console.error('Error in login: ', err)
        throw new Error(err.message || 'Internal server error')
      }
    },
    logout: async (_, __, context) => {
      try {
        await context.logout()
        req.session.destroy(err => {
          if (err) throw err
        })
        res.clearCookie('connect.sid')
        return { message: 'Logged out successfully' }
      } catch (err) {
        console.error('Error in logout: ', err)
        throw new Error(err.message || 'Internal server error')
      }
    }
  }
}

export default userResolver
