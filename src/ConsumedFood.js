export const nutritionTypes = [
  {
    name: 'carbohydrates',
    displayName: 'Carbohydrates',
    unit: 'g',
    caloriesPerUnit: 4,
  },
  { name: 'protein', displayName: 'Protein', unit: 'g', caloriesPerUnit: 4 },
  { name: 'fats', displayName: 'Fats', unit: 'g', caloriesPerUnit: 9 },
  { name: 'fiber', displayName: 'Fiber', unit: 'g', caloriesPerUnit: 0 },
  //{name: 'vitamins', displayName: 'Vitamins', unit: 'g', caloriesPerUnit: 0},
  //{name: 'minerals', displayName: 'Minerals', unit: 'g', caloriesPerUnit: 0},
]

/**
 * A data class for a single piece of food consumed, includes its nutritional value
 */
class ConsumedFood {
  constructor(data) {
    this.name = data.food_name
    this.description = data.description
    this.calories = data.calories
    this.serving_size = data.serving_size
    this.confidence_score = data.confidence_score
    this.nutritions = {
      carbohydrates: parseInt(data.macronutrients.carbohydrates),
      protein: parseInt(data.macronutrients.protein),
      fats: parseInt(data.macronutrients.fats),
      fiber: parseInt(data.macronutrients.fiber),
    }
    this.exercise_equivalent = data.exercise_equivalent
    this.uploadDateTime = data.uploadDateTime || new Date().toISOString() // Add this line
  }
}

export default ConsumedFood
