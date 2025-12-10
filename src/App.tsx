import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './app/theme'
import { AppRoutes } from './app/routes/AppRoutes'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
