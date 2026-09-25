from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

model = joblib.load("jeevanflow_intent_model.pkl")


@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({
            "error": "Please provide text"
        }), 400

    text = data["text"].strip()

    if not text:
        return jsonify({
            "error": "Text cannot be empty"
        }), 400

    prediction = model.predict([text])[0]

    probabilities = model.predict_proba([text])[0]
    confidence = max(probabilities)

    # Confidence threshold
    # If the model is not sufficiently confident,
    # ask the user for more information.
    if confidence < 0.40:
        return jsonify({
            "text": text,
            "intent": "UNCERTAIN",
            "confidence": round(float(confidence), 4),
            "message": "I need a little more information to understand your financial situation."
        })

    return jsonify({
        "text": text,
        "intent": prediction,
        "confidence": round(float(confidence), 4)
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "JeevanFlow ML service is running"
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )