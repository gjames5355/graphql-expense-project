import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { buildContext } from 'graphql-passport'
import { configurePassport } from './passport/passport.config.js'
import { connectDB } from './db/connectDB.js'
import connectMongo from 'connect-mongodb-session'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { expressMiddleware } from '@apollo/server/express4'
import http from 'http'
import mergedResolvers from './resolvers/index.js'
import mergedTypeDefs from './typeDefs/index.js'
import passport from 'passport'
import session from 'express-session'

dotenv.config()

configurePassport()

const app = express()

const httpServer = http.createServer(app)

// Create a new MongoDBStore instance
const MongoDBStore = connectMongo(session)

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions'
})

// Catch errors
store.on('error', err => console.error(err))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // don't save a new session if it hasn't been modified
    saveUninitialized: false, // don't create a session until something is stored
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true // the cookie is only accessible by the server
    },
    store
  })
)

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize())
app.use(passport.session())

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})

// Ensure we wait for our server to start
await server.start()

app.use(
  '/graphql',
  cors({
    origin: 'http://localhost:3000', // allow to server to accept request from different origin
    credentials: true // allow session cookie from browser to pass through
  }),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }) // buildContext is a function that returns an object with the request and response objects
  })
)

// Modified server startup
await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve))
await connectDB()

console.log(`🚀 Server ready at http://localhost:4000/graphql`)
