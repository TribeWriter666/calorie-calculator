import React, { useEffect, useState } from 'react'
import './App.scss'
import ConsumedFood from './ConsumedFood'
import ConsumptionHistoryItem from './ConsumptionHistoryItem'
import UploadImage from './UploadImage'
import { useDB } from './DBProvider'
import ProfileAndNutritionSummary from './ProfileAndNutritionSummary'

function App() {
  const [uploading, setUploading] = useState(false)
  const [responseList, setResponseList] = useState([])
  const [dbError, setdbError] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const db = useDB()

  useEffect(() => {
    const fetch_data = async () => {
      if (db) {
        try {
          let list = await db.getAllItems()
          const foodItems = list.filter((item) => item.food_name)
          const consumedFoodList = foodItems
            .map((item) => new ConsumedFood(item))
            .sort(
              (a, b) => new Date(b.uploadDateTime) - new Date(a.uploadDateTime)
            )
          setResponseList(consumedFoodList)

          // Load user profile
          const profileData = list.find((item) => item.type === 'userProfile')
          if (profileData) {
            setUserProfile(profileData)
          }
        } catch (error) {
          console.error('Error fetching data:', error)
          setdbError(error.message)
        }
      }
    }
    fetch_data()
  }, [db, uploading])

  const handleDelete = async (id) => {
    console.log('Deleting item with id:', id) // Add this line
    if (db && id !== undefined) {
      try {
        await db.deleteItem(id)
        setResponseList((prevList) => prevList.filter((item) => item.id !== id))
      } catch (error) {
        console.error('Error deleting item:', error)
      }
    } else {
      console.error('Invalid id or database not initialized')
    }
  }

  const handleUpdate = async (updatedItem) => {
    if (db) {
      await db.updateItem(updatedItem)
      setResponseList((prevList) =>
        prevList.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        )
      )
    }
  }

  const handleProfileUpdate = async (profile) => {
    if (db) {
      try {
        const updatedProfile = { ...profile, type: 'userProfile' }
        if (userProfile && userProfile.id) {
          await db.updateItem(updatedProfile)
        } else {
          await db.addItem(updatedProfile)
        }
        setUserProfile(updatedProfile)
      } catch (error) {
        console.error('Error updating profile:', error)
      }
    }
  }

  return (
    <div className='app'>
      <header>
        <h1>How much did you eat today?</h1>
      </header>
      <div
        className='container-sm'
        style={{ maxWidth: '600px', margin: '0 auto' }}
      >
        <UploadImage setUploading={setUploading} />

        <ProfileAndNutritionSummary
          consumedFoodList={responseList}
          onProfileUpdate={handleProfileUpdate}
          userProfile={userProfile}
        />

        <h2 className='app-section-title'>Consumption History</h2>
        <div className='consumption-history'>
          <ul className='list-group'>
            {responseList.map((item) => (
              <li key={item.id} className='list-group-item p-0'>
                <ConsumptionHistoryItem
                  item={item}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
