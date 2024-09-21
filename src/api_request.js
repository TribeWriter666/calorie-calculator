import React, { useState } from "react";

function MealCalorieEstimator() {
  const [image, setImage] = useState(null);
  const [calorieData, setCalorieData] = useState(null);
  const [error, setError] = useState("");

  // Handle image file selection
  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  // Function to send the image to GPT-4 API with vision capabilities
  const analyzeImage = async () => {
    if (!image) {
      setError("Please upload an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("prompt", "Please describe this meal and estimate how many calories it contains.");

    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // Using the API key from .env
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const data = await response.json();
      
      // Assuming the API returns a JSON structure with 'description' and 'calories' fields
      const mealDescription = data.description || "Meal description unavailable";
      const calorieEstimate = data.calories || "Calorie estimate unavailable";
      
      setCalorieData({ mealDescription, calorieEstimate });
    } catch (err) {
      setError("Error processing the image: " + err.message);
    }
  };

  return (
    <div>
      <h1>Meal Calorie Estimator</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={analyzeImage}>Analyze Image</button>

      {calorieData && (
        <div>
          <p><strong>Description:</strong> {calorieData.mealDescription}</p>
          <p><strong>Estimated Calories:</strong> {calorieData.calorieEstimate}</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default MealCalorieEstimator;
