import React, { useState, useEffect } from 'react';
import { useDB } from './DBProvider';

const UserProfile = ({ consumedFoodList }) => {
  const [sex, setSex] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [profileSubmitted, setProfileSubmitted] = useState(false);
  const [rdi, setRdi] = useState(null);
  const db = useDB();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (db) {
        const profile = await db.getItem('userProfile');
        if (profile) {
          setSex(profile.sex || '');
          setAge(profile.age || '');
          setHeight(profile.height || '');
          setWeight(profile.weight || '');
          setActivityLevel(profile.activityLevel || '');
          setProfileSubmitted(true);
          calculateRDI(profile);
        }
      }
    };
    fetchUserProfile();
  }, [db]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userProfile = {
      id: 'userProfile',
      sex,
      age: parseInt(age),
      height: parseInt(height),
      weight: parseInt(weight),
      activityLevel
    };
    await db.updateItem(userProfile);
    setProfileSubmitted(true);
    calculateRDI(userProfile);
  };

  const calculateRDI = (profile) => {
    // Basic BMR calculation using Harris-Benedict equation
    let bmr;
    if (profile.sex === 'male') {
      bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
    } else {
      bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
    }

    // Adjust BMR based on activity level
    let tdee;
    switch (profile.activityLevel) {
      case 'low':
        tdee = bmr * 1.2;
        break;
      case 'medium':
        tdee = bmr * 1.55;
        break;
      case 'high':
        tdee = bmr * 1.9;
        break;
      default:
        tdee = bmr * 1.2;
    }

    // Calculate macronutrient ratios (example: 50% carbs, 30% protein, 20% fat)
    const calculatedRdi = {
      calories: Math.round(tdee),
      carbohydrates: Math.round((tdee * 0.5) / 4), // 4 calories per gram of carbs
      protein: Math.round((tdee * 0.3) / 4), // 4 calories per gram of protein
      fats: Math.round((tdee * 0.2) / 9), // 9 calories per gram of fat
      fiber: 30 // General recommendation, adjust as needed
    };

    setRdi(calculatedRdi);
  };

  const calculateTotalConsumption = () => {
    return consumedFoodList.reduce((total, food) => {
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
  };

  const renderNutritionComparison = () => {
    const totalConsumption = calculateTotalConsumption();
    const nutritionTypes = ['calories', 'carbohydrates', 'protein', 'fats', 'fiber'];

    return nutritionTypes.map(type => {
      const consumed = totalConsumption[type];
      const recommended = rdi[type];
      const difference = consumed - recommended;
      const status = difference > 0 ? 'over' : 'under';

      return (
        <div key={type} className="mb-2">
          <strong className="text-capitalize">{type}:</strong>
          <br />
          Consumed: {consumed.toFixed(1)} {type === 'calories' ? 'kcal' : 'g'} | 
          RDI: {recommended} {type === 'calories' ? 'kcal' : 'g'} | 
          {Math.abs(difference).toFixed(1)} {type === 'calories' ? 'kcal' : 'g'} {status} RDI
        </div>
      );
    });
  };

  if (profileSubmitted && rdi) {
    return (
      <div className="user-profile mb-4">
        <h2>Your Nutrition Summary</h2>
        {renderNutritionComparison()}
        <button onClick={() => setProfileSubmitted(false)} className="btn btn-secondary mt-3">Edit Profile</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label htmlFor="sex" className="form-label">Sex</label>
        <select id="sex" className="form-select" value={sex} onChange={(e) => setSex(e.target.value)} required>
          <option value="">Select sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="age" className="form-label">Age</label>
        <input type="number" id="age" className="form-control" value={age} onChange={(e) => setAge(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label htmlFor="height" className="form-label">Height (cm)</label>
        <input type="number" id="height" className="form-control" value={height} onChange={(e) => setHeight(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label htmlFor="weight" className="form-label">Weight (kg)</label>
        <input type="number" id="weight" className="form-control" value={weight} onChange={(e) => setWeight(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label htmlFor="activityLevel" className="form-label">Activity Level</label>
        <select id="activityLevel" className="form-select" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} required>
          <option value="">Select activity level</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary">Update Profile</button>
    </form>
  );
};

export default UserProfile;