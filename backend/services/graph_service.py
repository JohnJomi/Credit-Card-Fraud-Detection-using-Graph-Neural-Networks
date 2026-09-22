"""Serves graph statistics and a sampled subgraph sized for the frontend."""
import json
import random

from backend.services.predictor import predictor

METADATA_PATH = "data/processed/metadata.json"
METRICS_PATH = "models/metrics.json"
SUBGRAPH_SIZE = 300


def get_stats():
    with open(METADATA_PATH) as f:
        metadata = json.load(f)
    with open(METRICS_PATH) as f:
        metrics = json.load(f)

    return {
        "nodes": metadata["num_nodes"],
        "edges": metadata["num_edges"],
        "fraud_transactions": metadata["num_fraud"],
        "fraud_rate": metadata["num_fraud"] / metadata["num_nodes"],
        "model": "GCN",
        **metrics,
    }


def get_subgraph(n: int = SUBGRAPH_SIZE):
    num_nodes = predictor.num_nodes()
    fraud_ids = [i for i in range(num_nodes) if predictor.true_label(i) == 1]
    normal_ids = [i for i in range(num_nodes) if predictor.true_label(i) == 0]

    rng = random.Random(42)
    max_fraud = n // 2
    sampled_fraud = (
        rng.sample(fraud_ids, max_fraud) if len(fraud_ids) > max_fraud else fraud_ids
    )

    remaining = max(0, n - len(sampled_fraud))
    sampled_normal = rng.sample(normal_ids, min(remaining, len(normal_ids)))

    node_ids = sorted(set(sampled_fraud) | set(sampled_normal))
    node_id_set = set(node_ids)

    nodes = []
    for node_id in node_ids:
        prediction, confidence = predictor.get_prediction(node_id)
        nodes.append({
            "id": node_id,
            "prediction": prediction,
            "confidence": confidence,
            "amount": predictor.get_amount(node_id),
        })

    edges = []
    seen = set()
    for node_id in node_ids:
        for neighbor in predictor.get_neighbors(node_id):
            if neighbor in node_id_set:
                key = tuple(sorted((node_id, neighbor)))
                if key not in seen:
                    seen.add(key)
                    edges.append({"source": key[0], "target": key[1]})

    return {"nodes": nodes, "edges": edges}
