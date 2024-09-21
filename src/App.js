const analyzeImage = async (base64Image) => {
  const prompt = "Please describe this meal and estimate how many calories it contains.";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // API key from .env
      },
      body: JSON.stringify({
        model: "gpt-4-turbo", // GPT-4 Turbo with vision
        messages: [
          {
            role: "system",
            content: "Analyze the uploaded meal image and estimate the calories."
          },
          {
            role: "user",
            content: base64Image, // Send the Base64 image as part of the request
          },
          {
            role: "user",
            content: prompt // Include the prompt in the request
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze image");
    }

    const data = await response.json();
    const mealDescription = data.choices[0]?.message?.content || "Meal description unavailable";
    const calorieEstimate = data.choices[0]?.message?.calories || "Calorie estimate unavailable";

    return { mealDescription, calorieEstimate };
  } catch (err) {
    throw new Error("Error processing the image: " + err.message);
  }
};

export default analyzeImage;
