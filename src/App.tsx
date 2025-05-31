import { Routes, Route } from 'react-router-dom'
import HomePage from '../app/page'
import MarketDisruptionPage from '../app/market-disruption/page'
import ClientLayout from '../app/ClientLayout'

function App() {
  return (
    <ClientLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/market-disruption" element={<MarketDisruptionPage />} />
        <Route path="/competitive-analysis" element={<div className="container mx-auto px-6 py-16"><h1 className="text-3xl font-bold">Competitive Analysis Page</h1></div>} />
        <Route path="/consumer-insights" element={<div className="container mx-auto px-6 py-16"><h1 className="text-3xl font-bold">Consumer Insights Page</h1></div>} />
        <Route path="/recommendations" element={<div className="container mx-auto px-6 py-16"><h1 className="text-3xl font-bold">Recommendations Page</h1></div>} />
        <Route path="/canadian-identity" element={<div className="container mx-auto px-6 py-16"><h1 className="text-3xl font-bold">Canadian Identity Page</h1></div>} />
        <Route path="/references" element={<div className="container mx-auto px-6 py-16"><h1 className="text-3xl font-bold">References Page</h1></div>} />
      </Routes>
    </ClientLayout>
  )
}

export default App
