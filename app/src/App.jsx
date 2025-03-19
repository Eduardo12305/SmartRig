import {BrowserRouter} from "react-router-dom"
import {AppRoutes} from './routes/main'

function App() {

  return (
    <BrowserRouter>
      <AppRoutes/>
    </BrowserRouter>
  )
}

export default App
