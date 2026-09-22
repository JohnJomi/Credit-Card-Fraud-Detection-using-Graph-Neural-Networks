from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.schemas import (
    GraphResponse,
    HealthResponse,
    PredictRequest,
    PredictResponse,
    StatsResponse,
    TransactionResponse,
)
from backend.services import graph_service
from backend.services.predictor import predictor

app = FastAPI(title="Credit Card Fraud Detection GNN API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health():
    return {"status": "ok"}


@app.get("/stats", response_model=StatsResponse)
def stats():
    return graph_service.get_stats()


@app.get("/graph", response_model=GraphResponse)
def graph():
    return graph_service.get_subgraph()


@app.get("/transaction/{transaction_id}", response_model=TransactionResponse)
def transaction(transaction_id: int):
    if not 0 <= transaction_id < predictor.num_nodes():
        raise HTTPException(status_code=404, detail="Transaction not found")

    prediction, confidence = predictor.get_prediction(transaction_id)
    return {
        "id": transaction_id,
        "amount": predictor.get_amount(transaction_id),
        "time": predictor.get_time(transaction_id),
        "features": predictor.get_features(transaction_id),
        "prediction": prediction,
        "confidence": confidence,
        "neighbors": predictor.get_neighbors(transaction_id),
    }


@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    if request.transaction_id is None:
        raise HTTPException(status_code=400, detail="transaction_id is required")
    if not 0 <= request.transaction_id < predictor.num_nodes():
        raise HTTPException(status_code=404, detail="Transaction not found")

    prediction, confidence = predictor.get_prediction(request.transaction_id)
    return {"prediction": prediction, "confidence": confidence}
