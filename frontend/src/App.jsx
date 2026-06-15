import { useState } from 'react'
import DataSourceSelector from './components/DataSourceSelector'
import ManualInput from './components/ManualInput'
import FileUpload from './components/FileUpload'
import RedditForm from './components/RedditForm'
import NewsForm from './components/NewsForm'
import SentimentPieChart from './components/SentimentPieChart'
import TrendLineChart from './components/TrendLineChart'
import ResultsTable from './components/ResultsTable'

export default function App() {
  const [activeTab, setActiveTab] = useState('manual')
  const [sentimentData, setSentimentData] = useState(null)
  const [error, setError] = useState(null)

  function handleResult(data) {
    setError(null)
    setSentimentData(data)
  }

  function handleError(msg) {
    setError(msg)
    setSentimentData(null)
  }

  const formProps = { onResult: handleResult, onError: handleError }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Sentiment Dashboard</h1>
            <p className="text-xs text-gray-400">Powered by RoBERTa · 100% free</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Input card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <DataSourceSelector active={activeTab} onChange={(tab) => { setActiveTab(tab); setSentimentData(null); setError(null) }} />
          {activeTab === 'manual' && <ManualInput {...formProps} />}
          {activeTab === 'upload' && <FileUpload {...formProps} />}
          {activeTab === 'reddit' && <RedditForm {...formProps} />}
          {activeTab === 'news'   && <NewsForm   {...formProps} />}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-4">
            {error}
          </div>
        )}

        {/* Charts */}
        {sentimentData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SentimentPieChart summary={sentimentData.summary} />
              <TrendLineChart byDate={sentimentData.summary.by_date} />
            </div>
            <ResultsTable results={sentimentData.results} />
          </>
        )}
      </main>
    </div>
  )
}
