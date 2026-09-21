import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import os

# Dataset path
dataset_path = dataset_path = os.path.join(
    os.path.dirname(__file__),
    "..",
    "database",
    "dataset",
    "crop_data.csv"
)

# Dataset load
data = pd.read_csv(dataset_path,sep="\t")

print("Dataset loaded successfully!")
print("Dataset shape:", data.shape)
print(data.head())

# Features and target
X = data[["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]]
y = data["label"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Create model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

# Train model
model.fit(X_train, y_train)

# Test model
y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("Model trained successfully!")
print("Accuracy:", accuracy)

# Save trained model
model_path = "crop_recommendation_model.pkl"
joblib.dump(model, model_path)

print("Model saved successfully!")