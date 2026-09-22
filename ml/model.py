"""A small Graph Convolutional Network implemented with plain PyTorch
sparse-tensor ops (no torch_geometric dependency), matching the
architecture: GCNConv(in->32) -> ReLU -> GCNConv(32->16) -> ReLU -> Linear(16->2).
"""
import torch
import torch.nn.functional as F
from torch import nn


def build_normalized_adjacency(edge_index: torch.Tensor, num_nodes: int) -> torch.Tensor:
    """Symmetric-normalized adjacency with self-loops: D^-1/2 (A + I) D^-1/2."""
    self_loops = torch.arange(num_nodes, dtype=torch.long)
    self_loop_index = torch.stack([self_loops, self_loops])

    full_edge_index = torch.cat([edge_index, self_loop_index], dim=1)
    values = torch.ones(full_edge_index.shape[1], dtype=torch.float32)

    deg = torch.zeros(num_nodes, dtype=torch.float32)
    deg.scatter_add_(0, full_edge_index[0], values)
    deg_inv_sqrt = deg.pow(-0.5)
    deg_inv_sqrt[torch.isinf(deg_inv_sqrt)] = 0.0

    norm_values = deg_inv_sqrt[full_edge_index[0]] * deg_inv_sqrt[full_edge_index[1]]

    adj = torch.sparse_coo_tensor(
        full_edge_index, norm_values, size=(num_nodes, num_nodes)
    ).coalesce()
    return adj


class GCNLayer(nn.Module):
    def __init__(self, in_dim: int, out_dim: int):
        super().__init__()
        self.linear = nn.Linear(in_dim, out_dim)

    def forward(self, x: torch.Tensor, adj: torch.Tensor) -> torch.Tensor:
        return torch.sparse.mm(adj, self.linear(x))


class FraudGNN(nn.Module):
    def __init__(self, input_dim: int):
        super().__init__()
        self.conv1 = GCNLayer(input_dim, 32)
        self.conv2 = GCNLayer(32, 16)
        self.fc = nn.Linear(16, 2)

    def forward(self, x: torch.Tensor, adj: torch.Tensor) -> torch.Tensor:
        x = F.relu(self.conv1(x, adj))
        x = F.relu(self.conv2(x, adj))
        return self.fc(x)
