import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/HomePage'
import Contact from "./pages/ContactPage"
import Cart from "./pages/CartPage"
import SalePage from './pages/SalePage'
import ProductsPage from './pages/ProductsPage'
import UserPage from './pages/UserPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import NotiStack from './components/NotiStack'



export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path='/sale' element={<SalePage />}/>
        <Route path='/user' element={<UserPage />}/>
        
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/register' element={<RegisterPage />}/>
        <Route path='/reset-password' element={<ResetPasswordPage />}/>
      </Routes>
      <NotiStack />
    </div>
  )
}
