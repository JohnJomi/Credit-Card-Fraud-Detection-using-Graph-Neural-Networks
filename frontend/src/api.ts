import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8000' })

export interface Stats {
  nodes: number
  edges: number
  fraud_transactions: number
  fraud_rate: number
  model: string
  precision: number
  recall: number
  f1: number
  roc_auc: number
  accuracy: number
}

export interface GraphNode {
  id: number
  prediction: 'normal' | 'fraud'
  confidence: number
  amount: number
}

export interface GraphEdge {
  source: number
  target: number
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface Transaction {
  id: number
  amount: number
  time: number
  features: Record<string, number>
  prediction: 'normal' | 'fraud'
  confidence: number
  neighbors: number[]
}

export const getStats = () => api.get<Stats>('/stats').then((r) => r.data)

export const getGraph = () => api.get<GraphData>('/graph').then((r) => r.data)

export const getTransaction = (id: number) =>
  api.get<Transaction>(`/transaction/${id}`).then((r) => r.data)
