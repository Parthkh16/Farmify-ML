from flask import Flask, request, jsonify, render_template
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler

app = Flask(__name__, template_folder='templates')

# Load the trained Keras model
model = load_model("fertilizer_recommendation_model.keras")

# Sample dataset to fit encoders and scaler (should be replaced with actual training data)
data_path = r"C:\Users\parth\Downloads\FARMIFY - PROJECT\fertilisers\Fertilizer Prediction.csv"
df = pd.read_csv(data_path)
df.columns = df.columns.str.strip()

# Initialize and fit label encoders
label_encoders = {}
for column in df.select_dtypes(include=['object']).columns:
    label_encoders[column] = LabelEncoder()
    df[column] = label_encoders[column].fit_transform(df[column])

# Initialize and fit scaler
scaler = StandardScaler()
X = df.drop(columns=['Fertilizer Name'])
scaler.fit(X)

@app.route('/')
def home():
    return render_template('index.html')
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        df_input = pd.DataFrame([data])

        # Encode categorical features safely
        for column in label_encoders:
            if column in df_input.columns:
                df_input[column] = label_encoders[column].transform(df_input[column])
        
        # Scale input data
        input_data = scaler.transform(df_input)
        
        # Predict fertilizer
        predictions = model.predict(input_data)
        predicted_class = np.argmax(predictions, axis=1)
        
        # Check if 'Fertilizer Name' exists
        if 'Fertilizer Name' not in label_encoders:
            return jsonify({'error': "'Fertilizer Name' encoder missing"})

        # Decode prediction
        fertilizer_name = label_encoders['Fertilizer Name'].inverse_transform(predicted_class)
        
        return jsonify({'recommended_fertilizer': fertilizer_name[0]})
    except Exception as e:
        return jsonify({'error': str(e)})
if __name__ == '__main__':
    app.run(debug=True, port=5004)
