// App.jsx
import GlobalStyle from './components/css/page.styled.jsx';
import { AppRoutes } from './routes/main.jsx'

function App() {
  return (
    <>
      <GlobalStyle />
      <div className="App">
        <AppRoutes />
      </div>
    </>
  )
}

export default App;