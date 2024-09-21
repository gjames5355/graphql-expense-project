import './index.css'

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import GridBackground from './components/ui/GridBackground.jsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const client = new ApolloClient({
  // TODO => Update production uri
  uri: 'http://localhost:4000/graphql', // the endpoint for the GraphQL server
  cache: new InMemoryCache(), // cache for caching data on the client side
  credentials: 'include' // send cookies with every request
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GridBackground>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </GridBackground>
    </BrowserRouter>
  </StrictMode>
)
