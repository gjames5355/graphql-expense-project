import { mergeResolvers } from '@graphql-tools/merge'
import transactionResolver from './transaction.resolver.js'
import userResolver from './user.resolver.js'

const resolvers = [transactionResolver, userResolver]

export default mergeResolvers(resolvers)
