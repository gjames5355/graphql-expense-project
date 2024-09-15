import { mergeTypeDefs } from '@graphql-tools/merge'
import transactionTypeDef from './transaction.typeDef.js'
import userTypeDef from './user.typeDef.js'

const typeDefs = [userTypeDef, transactionTypeDef]

export default mergeTypeDefs(typeDefs)

// Why Merge Type Definitions? 🤔

// Modularity: Merging type definitions allows you to keep related schema components in separate files, promoting modularity and organization.

// Easier Collaboration: If multiple developers are working on different parts of the schema, merging separate type definitions can make it easier to collaborate without conflicts.

// Reuse: You can reuse type definitions across different parts of the schema, potentially reducing duplication.

// Clear Separation of Concerns: Each file can focus on a specific domain or type of data, making it easier to understand and maintain.
