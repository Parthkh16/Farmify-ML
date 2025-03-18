from flask import Flask, render_template, request
import joblib
import numpy as np

# Load the Random Forest model
with open("Randomforest.joblib", "rb") as file:
    rf_model = joblib.load(file)

# Initialize Flask app
app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        try:
            # Get user input from the form
            nitrogen = float(request.form["nitrogen"])
            phosphorus = float(request.form["phosphorus"])
            potassium = float(request.form["potassium"])
            temperature = float(request.form["temperature"])
            humidity = float(request.form["humidity"])
            ph = float(request.form["ph"])
            rainfall = float(request.form["rainfall"])
            
            # Convert input to NumPy array
            input_data = np.array([[nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall]])
            
            # Predict using the Random Forest model
            prediction = rf_model.predict(input_data)[0]
            
            # Decode the numerical prediction back to a crop name
            # Assuming you also saved the LabelEncoder as 'label_encoder.pkl'
            with open("LabelEncoder.joblib", "rb") as file:
                le = joblib.load(file)
            predicted_crop = le.inverse_transform([prediction])[0]
            
            # Render the result in the HTML template
            return render_template("index.html", prediction=predicted_crop)
        
        except Exception as e:
            # Handle errors gracefully
            return render_template("index.html", error=str(e))
    
    # For GET requests, render the form
    return render_template("index.html", prediction=None)

if __name__ == "__main__":
    # Run the app on a specific port (e.g., 5001)
    app.run(debug=True, port=5001)