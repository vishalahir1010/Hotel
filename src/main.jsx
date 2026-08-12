import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/main.css'
import './styles/Navbar.css'
import './styles/Hero.css'
import './styles/About.css'
import './styles/Rooms.css'
import './styles/Amenities.css'
import './styles/Testimonials.css'
import './styles/FAQ.css'
import './styles/Footer.css'
import './styles/Booking.css'
import './styles/PremiumLoader.css'
import './styles/responsive.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
