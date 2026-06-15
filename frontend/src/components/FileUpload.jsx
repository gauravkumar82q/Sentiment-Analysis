import { useState } from 'react'
import { analyzeUpload } from '../services/api'

export default function FileUpload({ onResult, onError }) {
  const [file, setFile] = useState(null)
  const [column, setColumn] = useState('text')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    try {
      const data = await analyzeUpload(file, column)
      onResult(data)
    } catch (err) {
      onError(err?.response?.data?.detail || 'Failed to process file.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          CSV or Excel file
        </label>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0] || null)}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Text column name
        </label>
        <input
          type="text"
          value={column}
          onChange={(e) => setColumn(e.target.value)}
          placeholder="e.g. text, review, comment"
          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !file}
        className="px-5 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Processing…' : 'Upload & Analyze'}
      </button>
    </form>
  )
}
