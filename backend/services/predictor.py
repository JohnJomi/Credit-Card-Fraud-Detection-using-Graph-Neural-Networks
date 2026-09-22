"""Loads the trained GNN once at startup and serves cached predictions
for the whole graph, plus per-node lookups.
"""
import torch

from ml.model import FraudGNN, build_normalized_adjacency

GRAPH_PATH = "data/processed/graph.pt"
MODEL_PATH = "models/fraud_gnn.pt"

LABELS = {0: "normal", 1: "fraud"}


class Predictor:
    def __init__(self):
        self.graph = torch.load(GRAPH_PATH, weights_only=False)
        checkpoint = torch.load(MODEL_PATH, weights_only=False)

        self.model = FraudGNN(checkpoint["input_dim"])
        self.model.load_state_dict(checkpoint["state_dict"])
        self.model.eval()

        num_nodes = self.graph["x"].shape[0]
        self.adj = build_normalized_adjacency(self.graph["edge_index"], num_nodes)

        with torch.no_grad():
            out = self.model(self.graph["x"], self.adj)
            self.probs = torch.softmax(out, dim=1)
            self.preds = out.argmax(dim=1)

        self._build_neighbor_index()

    def _build_neighbor_index(self):
        edge_index = self.graph["edge_index"]
        neighbors = {}
        src, dst = edge_index[0].tolist(), edge_index[1].tolist()
        for s, d in zip(src, dst):
            neighbors.setdefault(s, set()).add(d)
        self.neighbors = {k: sorted(v) for k, v in neighbors.items()}

    def num_nodes(self) -> int:
        return self.graph["x"].shape[0]

    def get_prediction(self, node_id: int):
        pred = int(self.preds[node_id].item())
        confidence = float(self.probs[node_id, pred].item())
        return LABELS[pred], confidence

    def get_neighbors(self, node_id: int):
        return self.neighbors.get(node_id, [])

    def get_features(self, node_id: int):
        feature_names = [f"V{i+1}" for i in range(self.graph["x"].shape[1])]
        values = self.graph["x"][node_id].tolist()
        return dict(zip(feature_names, values))

    def get_amount(self, node_id: int) -> float:
        return float(self.graph["amount"][node_id].item())

    def get_time(self, node_id: int) -> float:
        return float(self.graph["time"][node_id].item())

    def true_label(self, node_id: int) -> int:
        return int(self.graph["y"][node_id].item())


predictor = Predictor()
