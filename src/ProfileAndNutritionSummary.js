import React, { useState } from 'react';
import UserProfile from './UserProfile';
import NutritionSummary from './NutritionSummary';

const ProfileAndNutritionSummary = ({ consumedFoodList = [], onProfileUpdate, userProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(!userProfile);

  const handleProfileUpdate = (updatedProfile) => {
    onProfileUpdate(updatedProfile);
    setShowProfileForm(false);
  };

  return (
    <div className="card mb-4">
      <div 
        className="card-header d-flex justify-content-between align-items-center"
        role="button" 
        onClick={() => setIsOpen(!isOpen)}
        data-bs-toggle="collapse" 
        data-bs-target="#profileAndNutrition"
      >
        <span>Profile and Nutrition Summary</span>
        <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </div>
      <div id="profileAndNutrition" className={`collapse ${isOpen ? 'show' : ''}`}>
        <div className="card-body">
          <div className="mb-4">
            {showProfileForm ? (
              <UserProfile 
                onProfileUpdate={handleProfileUpdate} 
                userProfile={userProfile}
                onCancel={() => setShowProfileForm(false)}
              />
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">User Profile</h5>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => setShowProfileForm(true)}>
                    Edit Profile
                  </button>
                </div>
                <ul className="list-group">
                  <li className="list-group-item">Sex: {userProfile?.sex}</li>
                  <li className="list-group-item">Age: {userProfile?.age}</li>
                  <li className="list-group-item">Height: {userProfile?.height} cm</li>
                  <li className="list-group-item">Weight: {userProfile?.weight} kg</li>
                  <li className="list-group-item">Activity Level: {userProfile?.activityLevel}</li>
                </ul>
              </>
            )}
          </div>
          {userProfile && userProfile.rdi && (
            <NutritionSummary consumedFoodList={consumedFoodList} rdi={userProfile.rdi} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileAndNutritionSummary;