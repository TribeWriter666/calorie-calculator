import React, { useState, useEffect } from 'react';
import { useDB } from './DBProvider';

const UserProfile = ({ onProfileUpdate, userProfile, onCancel }) => {
  const [sex, setSex] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');

  useEffect(() => {
    if (userProfile) {
      setSex(userProfile.sex || '');
      setAge(userProfile.age || '');
      setHeight(userProfile.height || '');
      setWeight(userProfile.weight || '');
      setActivityLevel(userProfile.activityLevel || '');
    }
  }, [userProfile]);

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
    return {
      calories: Math.round(tdee),
      carbohydrates: Math.round((tdee * 0.5) / 4), // 4 calories per gram of carbs
      protein: Math.round((tdee * 0.3) / 4), // 4 calories per gram of protein
      fats: Math.round((tdee * 0.2) / 9), // 9 calories per gram of fat
      fiber: 30 // General recommendation, adjust as needed
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const profile = { sex, age: parseInt(age), height: parseInt(height), weight: parseInt(weight), activityLevel };
    const rdi = calculateRDI(profile);
    onProfileUpdate({ ...profile, rdi });
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <div className="d-flex justify-content-between">
        <button type="submit" className="btn btn-primary">Update Profile</button>
        {userProfile && (
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default UserProfile;