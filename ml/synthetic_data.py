"""Generates a synthetic credit-card transaction dataset shaped like the
Kaggle creditcard.csv (Time, Amount, V1..V10, Class), with a small,
learnable fraud signal and realistic class imbalance.
"""
import numpy as np
import pandas as pd

N_TRANSACTIONS = 5000
N_FEATURES = 10
FRAUD_RATE = 0.01
RAW_CSV_PATH = "data/raw/creditcard.csv"
SEED = 42


def generate_dataset(n=N_TRANSACTIONS, fraud_rate=FRAUD_RATE, seed=SEED):
    rng = np.random.default_rng(seed)

    n_fraud = max(1, int(n * fraud_rate))
    n_normal = n - n_fraud

    normal_features = rng.normal(loc=0.0, scale=1.0, size=(n_normal, N_FEATURES))
    fraud_features = rng.normal(loc=2.5, scale=1.5, size=(n_fraud, N_FEATURES))

    features = np.vstack([normal_features, fraud_features])
    labels = np.concatenate([np.zeros(n_normal), np.ones(n_fraud)])

    amount = np.concatenate([
        rng.lognormal(mean=3.0, sigma=1.0, size=n_normal),
        rng.lognormal(mean=4.5, sigma=1.2, size=n_fraud),
    ])
    time = rng.integers(0, 172800, size=n)

    df = pd.DataFrame(features, columns=[f"V{i+1}" for i in range(N_FEATURES)])
    df.insert(0, "Time", time)
    df["Amount"] = amount
    df["Class"] = labels.astype(int)

    df = df.sample(frac=1.0, random_state=seed).reset_index(drop=True)
    return df


def main():
    df = generate_dataset()
    df.to_csv(RAW_CSV_PATH, index=False)
    print(f"Generated {len(df)} synthetic transactions ({df['Class'].sum()} fraud)")
    print(f"Saved to {RAW_CSV_PATH}")


if __name__ == "__main__":
    main()
