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
    this.id = data.id
    this.name = data.food_name || ''
    this.description = data.description || ''
    this.calories = data.calories || 0
    this.serving_size = data.serving_size || ''
    this.confidence_score = data.confidence_score || 0
    this.nutritions = {
      carbohydrates: this.parseNutrition(data.macronutrients?.carbohydrates),
      protein: this.parseNutrition(data.macronutrients?.protein),
      fats: this.parseNutrition(data.macronutrients?.fats),
      fiber: this.parseNutrition(data.macronutrients?.fiber),
    }
    this.exercise_equivalent = data.exercise_equivalent || {
      walking_minutes: 0,
      notes: '',
    }
    this.uploadDateTime = data.uploadDateTime || new Date().toISOString()
    this.imageURL = data.imageURL || null
  }

  parseNutrition(value) {
    if (typeof value === 'string') {
      const numericValue = parseInt(value, 10)
      return isNaN(numericValue) ? 0 : numericValue
    }
    return value || 0
  }
}

export default ConsumedFood
