# Credit-Card-Fraud-Detection-using-Graph-Neural-Networks

Full-stack demo: transactions modeled as a graph, classified by a Graph
Convolutional Network (GCN), served via FastAPI, visualized in a React
dashboard (FraudGraph). See `architecture-2.md` for the full design.

Uses the real [Kaggle Credit Card Fraud Detection
dataset](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud) (284,807
transactions, 492 fraud) and a hand-rolled GCN in plain PyTorch (no
`torch_geometric` dependency).

## Quick start

### 1. Get the dataset

Download `creditcard.csv` from
[Kaggle](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud) and place
it at:

```text
data/raw/creditcard.csv
```

The file is ~144MB and is gitignored — it is not checked into this repo.

### 2. ML pipeline (build graph, train model)

```bash
pip install -r requirements.txt

python -m ml.graph_builder
python -m ml.train
```

The full dataset is subsampled to 15,000 nodes (keeping every fraud
transaction) to stay within the local-laptop node budget in
`architecture-2.md`. This writes `models/fraud_gnn.pt` and
`models/metrics.json`.

### 3. Backend

```bash
python -m uvicorn backend.main:app --reload --port 8000
```

Backend: http://localhost:8000 (see `/health`, `/stats`, `/graph`,
`/transaction/{id}`, `/predict`)

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## Demo flow

1. Open the dashboard — see live model stats (precision/recall/F1/ROC-AUC).
2. The graph shows blue (normal) and red (fraud) transaction nodes.
3. Click a node to inspect it: amount, prediction, confidence.
4. Its graph neighbors are highlighted with a yellow ring, demonstrating
   that the GNN's prediction is influenced by connected transactions, not
   just the transaction in isolation.
