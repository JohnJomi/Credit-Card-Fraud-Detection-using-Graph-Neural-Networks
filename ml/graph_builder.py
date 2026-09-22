"""Converts the tabular transaction dataset into a graph: transactions
become nodes, and edges connect each transaction to its k nearest
neighbors in normalized feature space (KNN similarity graph, per
architecture-2.md section 8, option A).
"""
import json

import numpy as np
import pandas as pd
import torch
from sklearn.model_selection import train_test_split
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler

RAW_CSV_PATH = "data/raw/creditcard.csv"
GRAPH_PATH = "data/processed/graph.pt"
METADATA_PATH = "data/processed/metadata.json"
K = 5


def build_knn_edges(x: np.ndarray, k: int = K):
    nn = NearestNeighbors(n_neighbors=k + 1).fit(x)
    _, indices = nn.kneighbors(x)

    sources, targets = [], []
    for i, neighbors in enumerate(indices):
        for j in neighbors[1:]:  # skip self (first neighbor)
            sources.append(i)
            targets.append(j)
            sources.append(j)
            targets.append(i)

    edge_index = np.array([sources, targets], dtype=np.int64)
    edge_index = np.unique(edge_index, axis=1)
    return edge_index


def make_masks(labels: np.ndarray, seed: int = 42):
    n = len(labels)
    idx = np.arange(n)

    train_idx, temp_idx = train_test_split(
        idx, test_size=0.3, random_state=seed, stratify=labels
    )
    val_idx, test_idx = train_test_split(
        temp_idx, test_size=0.5, random_state=seed, stratify=labels[temp_idx]
    )

    train_mask = np.zeros(n, dtype=bool)
    val_mask = np.zeros(n, dtype=bool)
    test_mask = np.zeros(n, dtype=bool)
    train_mask[train_idx] = True
    val_mask[val_idx] = True
    test_mask[test_idx] = True
    return train_mask, val_mask, test_mask


def main():
    df = pd.read_csv(RAW_CSV_PATH)
    feature_cols = [c for c in df.columns if c != "Class"]
    labels = df["Class"].values.astype(np.int64)

    scaler = StandardScaler()
    x_scaled = scaler.fit_transform(df[feature_cols].values).astype(np.float32)

    edge_index = build_knn_edges(x_scaled, K)
    train_mask, val_mask, test_mask = make_masks(labels)

    graph = {
        "x": torch.tensor(x_scaled, dtype=torch.float32),
        "edge_index": torch.tensor(edge_index, dtype=torch.long),
        "y": torch.tensor(labels, dtype=torch.long),
        "amount": torch.tensor(df["Amount"].values, dtype=torch.float32),
        "time": torch.tensor(df["Time"].values, dtype=torch.float32),
        "train_mask": torch.tensor(train_mask),
        "val_mask": torch.tensor(val_mask),
        "test_mask": torch.tensor(test_mask),
    }
    torch.save(graph, GRAPH_PATH)

    metadata = {
        "num_nodes": int(len(df)),
        "num_edges": int(edge_index.shape[1]),
        "num_fraud": int(labels.sum()),
        "feature_names": feature_cols,
        "k": K,
    }
    with open(METADATA_PATH, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"Graph built: {metadata['num_nodes']} nodes, {metadata['num_edges']} edges, "
          f"{metadata['num_fraud']} fraud nodes")
    print(f"Saved to {GRAPH_PATH} and {METADATA_PATH}")


if __name__ == "__main__":
    main()
