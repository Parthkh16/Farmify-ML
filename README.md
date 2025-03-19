

# 🚜 Farmify-ML  

Farmify-ML is a machine learning-powered agricultural assistance system that helps farmers make data-driven decisions. It offers crop recommendations, disease detection, fertilizer suggestions, and weather forecasting to improve farm productivity and sustainability.

## 📌 Features  

### 1️⃣ Crop Recommendation (Random Forest Model - 99.32% Accuracy)
Predicts the best crops to grow based on soil nutrients, temperature, humidity, and rainfall.
Uses a Random Forest model with 99.32% accuracy for highly precise recommendations.

### 2️⃣ Disease Detection (ResNet Model)
Identifies crop diseases from leaf images using ResNet (Residual Neural Network).
Provides insights into disease symptoms and suggests preventive measures.
Pre-trained on large agricultural datasets with a valid accuarcy of 99.4%

### 3️⃣ **Fertilizer Recommendation (Decision Tree Model)**  
- Suggests the most suitable fertilizers based on soil nutrient levels (NPK values).
- Uses a Decision Tree model for accurate predictions.
- Helps optimize fertilizer use, reducing costs and environmental impact.

### 4️⃣ **Weather Forecasting**  
- Integrates real-time weather data to help farmers plan irrigation and other activities.  
- Prevents crop damage due to unexpected weather changes.  

## 🚀 Installation  

### Prerequisites  
- Python (>= 3.7)  
- Flask  
- TensorFlow / PyTorch (for deep learning models)  
- OpenCV (for image processing)  
- Pandas, NumPy, Scikit-learn  

### Steps  

1️⃣ **Clone the repository:**  
```bash
git clone https://github.com/Parthkh16/Farmify-ML.git
cd Farmify-ML
```

2️⃣ **Set up a virtual environment:**  
```bash
python -m venv env
source env/bin/activate  # On Windows, use 'env\Scripts\activate'
```

3️⃣ **Install dependencies:**  
```bash
pip install -r requirements.txt
```

4️⃣ **Run the application:**  
```bash
python app.py
```

5️⃣ **Access the Web App:**  
Open your browser and navigate to `http://localhost:5000/`.

## 🛠️ Project Structure  

```
Farmify-ML/
│── datasets/               # Contains training datasets for ML models
│── models/                 # Pre-trained ML models (Crop, Disease, Fertilizer)
│── static/                 # CSS, JavaScript, and images
│── templates/              # HTML files for the web interface
│── app.py                  # Main Flask application
│── requirements.txt        # Dependencies
│── README.md               # Project documentation
```

## 📊 Machine Learning Models Used  

- **Crop Recommendation:** Random Forest (99.32% Accuracy) trained on soil and climate data.  
- **Disease Detection:**  ResNet (Residual Neural Network) trained on plant disease datasets.  
- **Fertilizer Suggestion:** Decision Tree model for accurate fertilizer recommendations.  

## 💡 Future Enhancements  

- Implement real-time pest detection using drone images.  
- Add voice-based AI assistant for farmers.  
- Integrate blockchain for secure agricultural transactions.  

## 🤝 Contributing  

Contributions are welcome! If you find any issues or want to add new features, fork the repository and submit a pull request.  

## 📜 License  

This project is licensed under the MIT License.  

---  

Let me know if you want any modifications! 🚀
