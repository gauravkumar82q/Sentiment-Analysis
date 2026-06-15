import axios from 'axios'

const api = axios.create({ baseURL: '' })

export async function analyzeText(text) {
  const { data } = await api.post('/analyze/text', { text })
  return data
}

export async function analyzeUpload(file, column) {
  const form = new FormData()
  form.append('file', file)
  form.append('column', column)
  const { data } = await api.post('/analyze/upload', form)
  return data
}

export async function analyzeReddit({ subreddit, query, limit }) {
  const { data } = await api.post('/analyze/reddit', { subreddit, query, limit })
  return data
}

export async function analyzeNews(rss_url) {
  const { data } = await api.post('/analyze/news', { rss_url })
  return data
}
