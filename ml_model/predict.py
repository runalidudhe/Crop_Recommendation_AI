import joblib
import os

# Trained model ka path
model_path = os.path.join(
    os.path.dirname(__file__),
    "crop_recommendation_model.pkl"
)

# Model load
model = joblib.load(model_path)


def predict_crop(N, P, K, temperature, humidity, ph, rainfall):
    input_data = [[
        N,
        P,
        K,
        temperature,
        humidity,
        ph,
        rainfall
    ]]

    prediction = model.predict(input_data)

    return prediction[0]


# Test prediction
if __name__ == "__main__":
    crop = predict_crop(
        90,
        42,
        43,
        20.87,
        82.00,
        6.50,
        202.93
    )

    print("Recommended Crop:", crop)