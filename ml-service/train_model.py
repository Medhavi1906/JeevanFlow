import pandas as pd
import joblib

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline


# Load training data
data = pd.read_csv("dataset.csv")

X = data["text"]
y = data["intent"]


# Create ML pipeline
model = Pipeline([
    ("tfidf", TfidfVectorizer(
        lowercase=True,
        ngram_range=(1, 2)
    )),
    ("classifier", LogisticRegression(
        max_iter=1000
    ))
])


# Train the model
model.fit(X, y)


# Save trained model
joblib.dump(model, "jeevanflow_intent_model.pkl")

print("===================================")
print("JeevanFlow ML model trained!")
print("===================================")
print("Intents:", sorted(y.unique()))
print("Training examples:", len(data))
print("Model saved as:")
print("jeevanflow_intent_model.pkl")