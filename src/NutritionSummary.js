import React from 'react';

const NutritionSummary = ({ consumedFoodList = [], rdi }) => {
  const totalConsumption = consumedFoodList.reduce((total, food) => {
    total.calories += food.calories || 0;
    total.carbohydrates += food.nutritions.carbohydrates || 0;
    total.protein += food.nutritions.protein || 0;
    total.fats += food.nutritions.fats || 0;
    total.fiber += food.nutritions.fiber || 0;
    return total;
  }, {
    calories: 0,
    carbohydrates: 0,
    protein: 0,
    fats: 0,
    fiber: 0
  });

  const calculatePercentage = (consumed, recommended) => {
    return recommended ? Math.min(Math.round((consumed / recommended) * 100), 100) : 0;
  };

  const nutrients = [
    { name: 'Calories', unit: 'kcal' },
    { name: 'Carbohydrates', unit: 'g' },
    { name: 'Protein', unit: 'g' },
    { name: 'Fats', unit: 'g' },
    { name: 'Fiber', unit: 'g' }
  ];

  return (
    <div className="nutrition-summary mt-4">
      <h5 className="mb-3">Daily Nutrition Summary</h5>
      {nutrients.map(({ name, unit }) => {
        const key = name.toLowerCase();
        const percentage = calculatePercentage(totalConsumption[key], rdi[key]);
        return (
          <div key={key} className="mb-3">
            <div className="d-flex justify-content-between">
              <span>{name}</span>
              <span>{totalConsumption[key]} / {rdi[key] || 'N/A'} {unit}</span>
            </div>
            <div className="progress">
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{width: `${percentage}%`}}
                aria-valuenow={totalConsumption[key]}
                aria-valuemin="0"
                aria-valuemax={rdi[key] || 100}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NutritionSummary;