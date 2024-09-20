import { Route, Routes } from 'react-router-dom'

import Header from './components/ui/Header'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFound from './pages/NotFoundPage'
import SignupPage from './pages/SignUpPage'
import TransactionPage from './pages/TransactionPage'

function App () {
  const authUser = true

  return (
    <>
      {authUser && <Header />}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/transaction/:id' element={<TransactionPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
