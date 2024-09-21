export const calculateRDI = (profile) => {
    const { sex, age, height, weight, activityLevel } = profile;
  
    // Check if all required values are present and valid
    if (!sex || !age || !height || !weight || !activityLevel) {
        console.error('Invalid profile data:', profile);
        return 0; // Return 0 or some default value
    }

    // Convert string inputs to numbers
    const numAge = Number(age);
    const numHeight = Number(height);
    const numWeight = Number(weight);

    // Check if conversions are valid
    if (isNaN(numAge) || isNaN(numHeight) || isNaN(numWeight)) {
        console.error('Invalid numeric inputs:', { age, height, weight });
        return 0; // Return 0 or some default value
    }

    let bmr;

    if (sex === 'male') {
        bmr = 88.362 + (13.397 * numWeight) + (4.799 * numHeight) - (5.677 * numAge);
    } else {
        bmr = 447.593 + (9.247 * numWeight) + (3.098 * numHeight) - (4.330 * numAge);
    }

    const activityMultipliers = {
        low: 1.2,    // Sedentary (little or no exercise)
        medium: 1.55, // Moderately active (moderate exercise)
        high: 1.9    // Very active (hard exercise)
    };

    // Check if activityLevel is valid and prompt the user if necessary
    if (!activityMultipliers[activityLevel]) {
        console.warn("Invalid activity level. Defaulting to 'low' (sedentary).");
    }

    const multiplier = activityMultipliers[activityLevel] || 1.2; // Default to low if invalid

    return Math.round(bmr * multiplier);
};

export const calculateTotalCalories = (meals) => {
    return meals.reduce((total, meal) => total + meal.calories, 0);
};
