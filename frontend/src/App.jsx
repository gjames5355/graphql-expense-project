import { Route, Routes } from 'react-router-dom'

import { GET_AUTHENTICATED_USER } from './graphql/queries/user.query'
import Header from './components/ui/Header'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import { Navigate } from 'react-router-dom'
import NotFound from './pages/NotFoundPage'
import SignupPage from './pages/SignUpPage'
import { Toaster } from 'react-hot-toast'
import TransactionPage from './pages/TransactionPage'
import { useQuery } from '@apollo/client'

function App () {
  const { loading, error, data } = useQuery(GET_AUTHENTICATED_USER)

  console.log('Authenticated user:', data)

  return (
    <>
      {data?.authUser && <Header />}
      <Routes>
        <Route
          path='/'
          element={data?.authUser ? <HomePage /> : <Navigate to='/login' />}
        />
        <Route
          path='/login'
          element={!data?.authUser ? <LoginPage /> : <Navigate to='/' />}
        />
        <Route
          path='/signup'
          element={!data?.authUser ? <SignupPage /> : <Navigate to='/' />}
        />
        <Route
          path='/transaction/:id'
          element={
            data?.authUser ? <TransactionPage /> : <Navigate to='/login' />
          }
        />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
