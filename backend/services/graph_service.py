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
    """Builds a connected, neighborhood-rich sample rather than an arbitrary
    random one. A uniform random sample of `n` nodes out of the full graph
    would include almost no real edges (each node's KNN neighbors are very
    unlikely to also land in the same random sample), producing a dashboard
    graph that looks like isolated dots. Instead we seed with fraud nodes
    and expand outward along real graph edges (BFS), so the transactions
    shown are actually each other's neighbors.
    """
    num_nodes = predictor.num_nodes()
    fraud_ids = [i for i in range(num_nodes) if predictor.true_label(i) == 1]
    normal_ids = [i for i in range(num_nodes) if predictor.true_label(i) == 0]

    rng = random.Random(42)
    max_seeds = min(len(fraud_ids), n // 3)
    seeds = rng.sample(fraud_ids, max_seeds)
    max_fraud_in_view = n // 2

    fraud_id_set = set(fraud_ids)
    visited = set(seeds)
    fraud_count = len(seeds)
    queue = list(seeds)
    while queue and len(visited) < n:
        node_id = queue.pop(0)
        for neighbor in predictor.get_neighbors(node_id):
            if neighbor in visited:
                continue
            is_fraud = neighbor in fraud_id_set
            if is_fraud and fraud_count >= max_fraud_in_view:
                continue
            visited.add(neighbor)
            queue.append(neighbor)
            if is_fraud:
                fraud_count += 1
            if len(visited) >= n:
                break

    if len(visited) < n:
        remaining_pool = [i for i in normal_ids if i not in visited]
        fill = rng.sample(remaining_pool, min(n - len(visited), len(remaining_pool)))
        visited.update(fill)

    node_ids = sorted(visited)
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
