from typing import List, Optional

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str


class StatsResponse(BaseModel):
    nodes: int
    edges: int
    fraud_transactions: int
    fraud_rate: float
    model: str
    precision: float
    recall: float
    f1: float
    roc_auc: float
    accuracy: float


class GraphNode(BaseModel):
    id: int
    prediction: str
    confidence: float
    amount: float


class GraphEdge(BaseModel):
    source: int
    target: int


class GraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]


class TransactionResponse(BaseModel):
    id: int
    amount: float
    time: float
    features: dict
    prediction: str
    confidence: float
    neighbors: List[int]


class PredictRequest(BaseModel):
    transaction_id: Optional[int] = None


class PredictResponse(BaseModel):
    prediction: str
    confidence: float
