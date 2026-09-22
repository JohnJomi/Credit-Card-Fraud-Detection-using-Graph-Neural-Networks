# Credit Card Fraud Detection using Graph Neural Networks

## 1. Project Overview

This project is a full-stack **Credit Card Fraud Detection system using
a Graph Neural Network (GNN)**.

Instead of treating every transaction as an independent row, the system
represents transactions and their relationships as a graph. The GNN uses
information from connected/related transactions to classify transactions
as:

-   **Normal**
-   **Fraudulent**

The project is designed to run locally on a laptop and use a manageable
Kaggle credit-card transaction dataset.

------------------------------------------------------------------------

## 2. Goals

The system should demonstrate:

1.  How tabular transaction data can be converted into a graph.
2.  How a GNN performs message passing between related transactions.
3.  How the trained model classifies suspicious transactions.
4.  How graph structure helps identify potentially fraudulent behavior.
5.  How a trained GNN can be exposed through an API.
6.  How a frontend can visualize the graph and model predictions.

The emphasis is on **demonstrating the GNN**, not building a production
banking fraud system.

------------------------------------------------------------------------

# 3. High-Level Architecture

``` text
                         ┌──────────────────────┐
                         │      Kaggle Dataset  │
                         │                      │
                         │ Credit Transactions  │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Data Preprocessing   │
                         │                      │
                         │ - Clean data         │
                         │ - Normalize features │
                         │ - Handle labels      │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Graph Construction │
                         │                      │
                         │ Transactions → Nodes │
                         │ Relationships → Edges│
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ PyTorch Geometric    │
                         │                      │
                         │       GCN Layer      │
                         │          ↓           │
                         │        ReLU          │
                         │          ↓           │
                         │       GCN Layer      │
                         │          ↓           │
                         │       Linear         │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Fraud Prediction  │
                         │                      │
                         │ Normal / Fraud       │
                         │ Confidence Score     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       FastAPI        │
                         │                      │
                         │ /predict             │
                         │ /transaction/{id}    │
                         │ /graph               │
                         │ /stats               │
                         └──────────┬───────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌──────────────────────┐
                         │       React UI       │
                         │                      │
                         │ Graph Visualization  │
                         │ Fraud Dashboard      │
                         │ Transaction Details  │
                         │ Model Predictions    │
                         └──────────────────────┘
```

------------------------------------------------------------------------

# 4. Technology Stack

## Machine Learning

-   Python 3.10+
-   PyTorch
-   PyTorch Geometric
-   NumPy
-   Pandas
-   Scikit-learn

## Backend

-   FastAPI
-   Uvicorn
-   Pydantic

## Frontend

-   React
-   TypeScript
-   Vite
-   Tailwind CSS
-   React Flow or Cytoscape.js
-   Axios

## Dataset

-   Kaggle credit-card transaction dataset
-   CSV-based input

## Storage

No database is required for the initial implementation.

The trained model can be saved as:

``` text
models/fraud_gnn.pt
```

------------------------------------------------------------------------

# 5. Repository Structure

``` text
credit-card-fraud-gnn/
│
├── data/
│   ├── raw/
│   │   └── creditcard.csv
│   │
│   └── processed/
│       ├── graph.pt
│       └── metadata.json
│
├── ml/
│   ├── preprocess.py
│   ├── graph_builder.py
│   ├── model.py
│   ├── train.py
│   ├── evaluate.py
│   └── inference.py
│
├── models/
│   └── fraud_gnn.pt
│
├── backend/
│   ├── main.py
│   ├── schemas.py
│   └── services/
│       ├── predictor.py
│       └── graph_service.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GraphView.tsx
│   │   │   ├── TransactionPanel.tsx
│   │   │   ├── PredictionCard.tsx
│   │   │   └── StatsPanel.tsx
│   │   │
│   │   ├── App.tsx
│   │   └── api.ts
│   │
│   └── package.json
│
├── requirements.txt
├── README.md
└── architecture.md
```

------------------------------------------------------------------------

# 6. Dataset Pipeline

The Kaggle CSV is first loaded into Pandas.

``` text
Kaggle CSV
    │
    ▼
Pandas DataFrame
    │
    ├── Remove invalid rows
    ├── Normalize numerical features
    ├── Separate labels
    └── Select useful features
    │
    ▼
Processed transaction data
```

The target label is:

``` text
0 → Normal
1 → Fraud
```

The original dataset should not be unnecessarily modified. Keep a copy
of the raw dataset in:

``` text
data/raw/
```

------------------------------------------------------------------------

# 7. Graph Representation

The most important design decision is how the tabular transaction
dataset becomes a graph.

## Nodes

Each transaction is represented as a node.

``` text
Transaction 1
Transaction 2
Transaction 3
Transaction 4
...
```

Each node contains transaction features.

For example:

``` text
Node 17

Amount       = 842.31
Time         = 128394
Feature V1   = -1.21
Feature V2   = 0.43
...
```

The node feature vector becomes:

``` text
X[17] = [
    amount,
    time,
    V1,
    V2,
    ...
]
```

------------------------------------------------------------------------

# 8. Edge Construction

A GNN requires relationships between nodes.

Because a basic credit-card dataset may not directly contain explicit
account-to-account relationships, the project should construct
**similarity/behavioral edges**.

Possible edge rules:

### Option A --- Feature Similarity

Connect two transactions when they are sufficiently similar in feature
space.

``` text
Transaction A ───── Transaction B
       │                  │
       └──── similar ─────┘
```

Use k-nearest neighbors (KNN) to create a sparse graph.

Recommended initial configuration:

``` text
k = 5
```

Each transaction connects to its 5 nearest neighbors.

### Option B --- Temporal Similarity

Transactions that occur close together can be connected.

### Option C --- Hybrid Graph

Combine:

``` text
Feature similarity
        +
Temporal proximity
        ↓
Graph edges
```

For the 2-hour implementation, start with **KNN feature similarity**. It
is simple, deterministic, and easy to explain.

------------------------------------------------------------------------

# 9. PyTorch Geometric Graph

The graph is represented using:

``` python
Data(
    x=node_features,
    edge_index=edge_index,
    y=labels
)
```

Where:

``` text
x
│
└── Node feature matrix

edge_index
│
└── Source/destination node connections

y
│
└── Fraud labels
```

Example:

``` text
x =
[
  [feature1, feature2, feature3, ...],
  [feature1, feature2, feature3, ...],
  ...
]

edge_index =
[
  [0, 0, 1, 2, ...],
  [1, 2, 2, 3, ...]
]

y =
[
  0,
  0,
  1,
  0,
  ...
]
```

------------------------------------------------------------------------

# 10. GNN Architecture

Use a small Graph Convolutional Network.

``` text
Input Features
      │
      ▼
┌──────────────┐
│   GCNConv    │
│ input → 32   │
└──────┬───────┘
       │
       ▼
     ReLU
       │
       ▼
┌──────────────┐
│   GCNConv    │
│ 32 → 16      │
└──────┬───────┘
       │
       ▼
     ReLU
       │
       ▼
┌──────────────┐
│    Linear    │
│  16 → 2      │
└──────┬───────┘
       │
       ▼
 Normal / Fraud
```

Example:

``` python
class FraudGNN(torch.nn.Module):

    def __init__(self, input_dim):
        super().__init__()

        self.conv1 = GCNConv(input_dim, 32)
        self.conv2 = GCNConv(32, 16)
        self.fc = Linear(16, 2)

    def forward(self, x, edge_index):

        x = self.conv1(x, edge_index)
        x = F.relu(x)

        x = self.conv2(x, edge_index)
        x = F.relu(x)

        return self.fc(x)
```

------------------------------------------------------------------------

# 11. Why GCN?

The Graph Convolutional Network performs message passing.

For a transaction node:

``` text
                 Neighbor 1
                     │
                     ▼
Neighbor 2 ─── Transaction ─── Neighbor 3
                     │
                     ▼
                 Neighbor 4
```

The GCN combines information from neighboring nodes.

Conceptually:

``` text
Transaction features
        +
Neighbor features
        ↓
Graph aggregation
        ↓
Updated transaction representation
        ↓
Fraud classification
```

This is the key GNN concept demonstrated by the project.

------------------------------------------------------------------------

# 12. Training Pipeline

``` text
Raw Dataset
     │
     ▼
Preprocessing
     │
     ▼
Graph Construction
     │
     ▼
Train / Validation / Test Masks
     │
     ▼
GCN Training
     │
     ├── Forward pass
     ├── Calculate loss
     ├── Backpropagation
     └── Update weights
     │
     ▼
Evaluation
     │
     ├── Accuracy
     ├── Precision
     ├── Recall
     ├── F1
     └── ROC-AUC
     │
     ▼
fraud_gnn.pt
```

------------------------------------------------------------------------

# 13. Handling Class Imbalance

Credit-card fraud datasets are usually highly imbalanced.

A model can achieve high accuracy simply by predicting almost everything
as normal, so accuracy alone should **not** be the primary metric.

Use:

-   Precision
-   Recall
-   F1-score
-   ROC-AUC
-   Confusion matrix

The training loss should account for class imbalance.

One simple approach is weighted cross-entropy:

``` python
loss_fn = torch.nn.CrossEntropyLoss(
    weight=class_weights
)
```

The exact class weights should be calculated from the training data.

------------------------------------------------------------------------

# 14. Data Splitting

Do not randomly leak test information into training.

Create:

``` text
70% → Training
15% → Validation
15% → Testing
```

Use masks:

``` python
train_mask
val_mask
test_mask
```

The model trains only on:

``` text
train_mask
```

Validation is used for model selection.

The final metrics are calculated on:

``` text
test_mask
```

------------------------------------------------------------------------

# 15. Backend Architecture

FastAPI acts as the bridge between the trained model and frontend.

``` text
React
  │
  │ HTTP
  ▼
FastAPI
  │
  ├── Predictor
  │      │
  │      ▼
  │   GNN Model
  │
  └── Graph Service
         │
         ▼
      Graph Data
```

## API Endpoints

### `GET /health`

Checks whether the backend is running.

Response:

``` json
{
  "status": "ok"
}
```

------------------------------------------------------------------------

### `GET /stats`

Returns graph and model statistics.

Example:

``` json
{
  "nodes": 10000,
  "edges": 50000,
  "fraud_transactions": 49,
  "model": "GCN"
}
```

------------------------------------------------------------------------

### `GET /graph`

Returns graph information required by the frontend.

Example:

``` json
{
  "nodes": [
    {
      "id": 1,
      "prediction": "normal"
    },
    {
      "id": 2,
      "prediction": "fraud"
    }
  ],
  "edges": [
    {
      "source": 1,
      "target": 2
    }
  ]
}
```

For large graphs, the API should return a **small sampled subgraph**
rather than sending the entire graph to the browser.

------------------------------------------------------------------------

### `GET /transaction/{id}`

Returns transaction information and prediction.

Example:

``` json
{
  "id": 17,
  "prediction": "fraud",
  "confidence": 0.932,
  "neighbors": [
    12,
    21,
    35
  ]
}
```

------------------------------------------------------------------------

### `POST /predict`

Runs inference for a transaction or selected graph region.

Example response:

``` json
{
  "prediction": "fraud",
  "confidence": 0.932
}
```

------------------------------------------------------------------------

# 16. Frontend Architecture

``` text
React Application
│
├── Dashboard
│   ├── Total Transactions
│   ├── Fraud Count
│   ├── Fraud Rate
│   └── Model Metrics
│
├── GraphView
│   ├── Nodes
│   ├── Edges
│   └── Selection
│
├── TransactionPanel
│   ├── Transaction Features
│   ├── Prediction
│   └── Confidence
│
└── PredictionCard
    ├── Normal
    └── Fraud
```

------------------------------------------------------------------------

# 17. Graph UI

The main visual component should display:

``` text
Normal transaction → one node style
Fraud transaction  → another node style
Selected node      → highlighted
```

Example:

``` text
              ●
             / \
            /   \
       ●───●─────●
       │  selected
       │
       ●
```

When the user selects a transaction:

``` text
Transaction #128

Amount: $842.31

Prediction:
FRAUD

Confidence:
93.2%

Connected transactions:
7
```

------------------------------------------------------------------------

# 18. Important UI Feature: Neighborhood Inspection

This should be the main interactive demonstration.

User clicks:

``` text
Transaction #128
```

The frontend requests:

``` text
GET /transaction/128
```

The backend returns:

``` text
Transaction
     │
     ├── Neighbor 1
     ├── Neighbor 2
     ├── Neighbor 3
     ├── Neighbor 4
     └── Neighbor 5
```

The frontend highlights these nodes.

This visually demonstrates:

> The GNN does not look at the transaction in isolation; its
> representation is influenced by connected neighboring transactions.

------------------------------------------------------------------------

# 19. Dashboard Metrics

Display:

``` text
┌────────────────────────────────────────────┐
│             FRAUD GNN DASHBOARD            │
├────────────┬────────────┬──────────────────┤
│ Transactions│ Fraud      │ Fraud Rate       │
│ 10,000      │ 49         │ 0.49%            │
├────────────┼────────────┼──────────────────┤
│ Precision   │ Recall     │ F1 Score         │
│ 0.91        │ 0.87       │ 0.89             │
└────────────┴────────────┴──────────────────┘
```

The actual values must come from model evaluation and should not be
hardcoded.

------------------------------------------------------------------------

# 20. Model Training vs Inference

Training should happen separately.

``` text
train.py
    │
    ▼
fraud_gnn.pt
```

The FastAPI server loads:

``` text
fraud_gnn.pt
```

once during startup.

The API then performs inference.

This prevents the model from being retrained every time a request is
made.

------------------------------------------------------------------------

# 21. Local Development

## Backend

``` bash
cd backend

uvicorn main:app --reload
```

Backend:

``` text
http://localhost:8000
```

## Frontend

``` bash
cd frontend

npm install
npm run dev
```

Frontend:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

# 22. Training Command

Example:

``` bash
python -m ml.train
```

The training script should:

1.  Load the processed dataset.
2.  Build/load the graph.
3.  Create train/validation/test masks.
4.  Initialize the GNN.
5.  Train for a small number of epochs.
6.  Evaluate the model.
7.  Save the trained model.

Output:

``` text
Training GNN...

Epoch 001 | Loss: 0.621
Epoch 010 | Loss: 0.412
Epoch 020 | Loss: 0.301
...

Evaluation
Precision: ...
Recall:    ...
F1:        ...
ROC-AUC:   ...

Model saved to:
models/fraud_gnn.pt
```

------------------------------------------------------------------------

# 23. Performance Constraints

The project is intended to run locally.

Initial target:

``` text
Nodes:
≤ 50,000

Edges:
≤ 250,000

Hidden dimension:
32 → 16

Epochs:
50–200
```

If the Kaggle dataset is too large, create a representative subset for
the demonstration.

The goal is not maximum benchmark performance. The goal is a clear
working GNN demonstration.

------------------------------------------------------------------------

# 24. Security / Privacy Note

The project should use only the selected Kaggle dataset.

Do not upload real personal banking information.

The system is an educational ML demonstration and should not be
presented as a production-grade banking fraud detection system.

------------------------------------------------------------------------

# 25. Demo Flow

The final demonstration should follow this sequence:

``` text
1. Open dashboard
       ↓
2. Show transaction graph
       ↓
3. Show normal and suspicious nodes
       ↓
4. Select a suspicious transaction
       ↓
5. Show transaction features
       ↓
6. Show its neighboring transactions
       ↓
7. Show GNN prediction
       ↓
8. Show confidence
       ↓
9. Explain message passing
       ↓
10. Show model evaluation metrics
```

------------------------------------------------------------------------

# 26. Core GNN Explanation for Presentation

The simplest explanation is:

> "Each transaction is represented as a node in a graph. We connect
> transactions that have similar behavioral or feature characteristics.
> The GNN then aggregates information from neighboring transactions.
> This produces a richer representation of each transaction, which is
> used to classify it as normal or fraudulent."

The key distinction from a normal neural network is:

``` text
Traditional ML:

Transaction → Prediction


GNN:

Transaction
     +
Neighbors
     ↓
Message Passing
     ↓
Node Representation
     ↓
Prediction
```

------------------------------------------------------------------------

# 27. Future Extensions

After the basic version works, the system could be extended with:

-   Graph Attention Networks (GAT)
-   Account-to-merchant heterogeneous graphs
-   Temporal transaction graphs
-   Explainable GNN predictions
-   Real-time transaction streaming
-   SHAP-style feature explanations
-   Neo4j graph storage
-   Model comparison: Random Forest vs GCN vs GAT
-   Docker deployment
-   Cloud inference

These are **not required for the initial 2-hour implementation**.

------------------------------------------------------------------------

# 28. MVP Definition

The minimum working project is complete when all of the following work:

-   [ ] Kaggle dataset loads successfully.
-   [ ] Dataset is converted into a graph.
-   [ ] GCN model trains locally.
-   [ ] Fraud/normal classification works.
-   [ ] Evaluation metrics are generated.
-   [ ] Trained model is saved.
-   [ ] FastAPI loads the model.
-   [ ] Frontend connects to FastAPI.
-   [ ] Graph is visualized.
-   [ ] User can select a transaction.
-   [ ] Prediction is displayed.
-   [ ] Neighboring transactions can be displayed.
-   [ ] Dashboard shows actual model statistics.

------------------------------------------------------------------------

# 29. Final Architecture

``` text
┌────────────────────────────────────────────────────────────┐
│                        KAGGLE DATASET                      │
│                 Credit Card Transactions                   │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│                    DATA PREPROCESSING                       │
│  Cleaning • Scaling • Feature Selection • Label Handling   │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│                    GRAPH CONSTRUCTION                       │
│                                                            │
│  Transaction = Node                                       │
│  KNN Similarity = Edge                                    │
│  Transaction Features = Node Features                    │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│                     GNN TRAINING                            │
│                                                            │
│       GCNConv → ReLU → GCNConv → ReLU → Linear            │
│                                                            │
│                  ↓                                         │
│           Fraud / Normal                                   │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ fraud_gnn.pt    │
                    └────────┬────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│                         FASTAPI                            │
│                                                            │
│  /health    /stats    /graph                              │
│  /transaction/{id}    /predict                            │
└────────────────────────────┬───────────────────────────────┘
                             │
                             │ REST / JSON
                             ▼
┌────────────────────────────────────────────────────────────┐
│                         REACT UI                           │
│                                                            │
│  Dashboard                                                 │
│  ├── Graph Visualization                                   │
│  ├── Fraud Statistics                                      │
│  ├── Transaction Details                                   │
│  ├── GNN Prediction                                        │
│  └── Neighborhood Inspection                               │
└────────────────────────────────────────────────────────────┘
```

This architecture intentionally keeps the implementation small enough
for a local laptop while still containing the complete path from **real
Kaggle data → graph → trained GNN → API → interactive frontend**.
