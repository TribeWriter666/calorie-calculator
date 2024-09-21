
const nutritionTypes = [
  {name: 'carbs', displayName: 'Carbohydrates', unit: 'g', caloriesPerUnit: 4},
  {name: 'proteins', displayName: 'Proteins', unit: 'g', caloriesPerUnit: 4},
  {name: 'fats', displayName: 'Fats', unit: 'g', caloriesPerUnit: 9},
  {name: 'vitamins', displayName: 'Vitamins', unit: 'g', caloriesPerUnit: 0},
  {name: 'minerals', displayName: 'Minerals', unit: 'g', caloriesPerUnit: 0},
];

/**
 * A data class for a single piece of food consumed, includes its nutritional value
 */
class ConsumedFood {
  constructor(name, nutritions = {}) {
    this.name = name;
    this.nutritions = nutritions;
  }

  get calories() {
    // Add up calories of all nutritions.
    return nutritionTypes.reduce((acc, type) => acc + type.caloriesPerUnit * (this.nutritions[type.name] || 0), 0);
  }
}

// Add getters and setters for each nutrition onto the class.
nutritionTypes.forEach((nutritionType) => {
  Object.defineProperty(ConsumedFood.prototype, nutritionType.name, {
    get: function() { return this.nutritions[nutritionType.name] || 0; },
    set: function(newVal) { this.nutritions[nutritionType.name] = newVal; }
  })
})

export default ConsumedFood;
export { nutritionTypes };