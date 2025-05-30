
import { Routes, Route } from 'react-router-dom'
import HomePage from '../app/page'
import ClientLayout from '../app/ClientLayout'

function App() {
  return (
    <ClientLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/competitive-analysis" element={<div>Competitive Analysis Page</div>} />
        <Route path="/consumer-insights" element={<div>Consumer Insights Page</div>} />
        <Route path="/market-disruption" element={<div>Market Disruption Page</div>} />
        <Route path="/recommendations" element={<div>Recommendations Page</div>} />
        <Route path="/canadian-identity" element={<div>Canadian Identity Page</div>} />
        <Route path="/references" element={<div>References Page</div>} />
      </Routes>
    </ClientLayout>
  )
}

export default App
