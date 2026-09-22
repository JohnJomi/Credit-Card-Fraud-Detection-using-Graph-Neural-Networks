"""Trains the FraudGNN on the constructed graph, evaluates on the held-out
test mask, and saves the trained model + evaluation metrics.
"""
import json

import torch
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)

from ml.model import FraudGNN, build_normalized_adjacency

GRAPH_PATH = "data/processed/graph.pt"
MODEL_PATH = "models/fraud_gnn.pt"
METRICS_PATH = "models/metrics.json"
EPOCHS = 100
LR = 0.01


def main():
    graph = torch.load(GRAPH_PATH, weights_only=False)
    x, edge_index, y = graph["x"], graph["edge_index"], graph["y"]
    train_mask, val_mask, test_mask = (
        graph["train_mask"],
        graph["val_mask"],
        graph["test_mask"],
    )

    num_nodes, input_dim = x.shape
    adj = build_normalized_adjacency(edge_index, num_nodes)

    model = FraudGNN(input_dim)
    optimizer = torch.optim.Adam(model.parameters(), lr=LR, weight_decay=5e-4)

    class_counts = torch.bincount(y[train_mask])
    class_weights = (class_counts.sum() / (class_counts.float() * len(class_counts)))
    loss_fn = torch.nn.CrossEntropyLoss(weight=class_weights)

    print("Training GNN...\n")
    model.train()
    for epoch in range(1, EPOCHS + 1):
        optimizer.zero_grad()
        out = model(x, adj)
        loss = loss_fn(out[train_mask], y[train_mask])
        loss.backward()
        optimizer.step()

        if epoch % 10 == 0 or epoch == 1:
            print(f"Epoch {epoch:03d} | Loss: {loss.item():.3f}")

    model.eval()
    with torch.no_grad():
        out = model(x, adj)
        probs = torch.softmax(out, dim=1)
        preds = out.argmax(dim=1)

    test_y = y[test_mask].numpy()
    test_preds = preds[test_mask].numpy()
    test_probs = probs[test_mask, 1].numpy()

    metrics = {
        "accuracy": accuracy_score(test_y, test_preds),
        "precision": precision_score(test_y, test_preds, zero_division=0),
        "recall": recall_score(test_y, test_preds, zero_division=0),
        "f1": f1_score(test_y, test_preds, zero_division=0),
        "roc_auc": roc_auc_score(test_y, test_probs) if len(set(test_y)) > 1 else 0.0,
    }

    print("\nEvaluation")
    print(f"Precision: {metrics['precision']:.3f}")
    print(f"Recall:    {metrics['recall']:.3f}")
    print(f"F1:        {metrics['f1']:.3f}")
    print(f"ROC-AUC:   {metrics['roc_auc']:.3f}")

    torch.save({"state_dict": model.state_dict(), "input_dim": input_dim}, MODEL_PATH)
    with open(METRICS_PATH, "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"\nModel saved to:\n{MODEL_PATH}")


if __name__ == "__main__":
    main()
