import React, { useState } from 'react';

const UserProfile = ({ onProfileUpdate }) => {
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onProfileUpdate({ 
      gender, 
      age: parseInt(age), 
      height: parseInt(height), 
      weight: parseInt(weight), 
      activityLevel 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label htmlFor="gender" className="form-label">Gender</label>
        <select id="gender" className="form-select" value={gender} onChange={(e) => setGender(e.target.value)} required>
          <option value="">Select gender</option>
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