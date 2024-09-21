import React, { useEffect, useState } from 'react'
import './App.scss'
import ConsumedFood, { nutritionTypes } from './ConsumedFood'
import ConsumptionHistoryItem from './ConsumptionHistoryItem'
import UploadImage from './UploadImage'
import { useDB } from './DBProvider'
import UserProfile from './UserProfile'

function App() {
  const [uploading, setUploading] = useState(false)
  const [responseList, setResponseList] = useState([])
  const [dbError, setdbError] = useState(null)
  const db = useDB()

  useEffect(() => {
    const fetch_data = async () => {
      if (db) {
        try {
          let list = await db.getAllItems()
          const consumedFoodList = list
            .map((item) => {
              try {
                const consumedFood = new ConsumedFood(item)
                console.log('Created ConsumedFood object:', consumedFood)
                return consumedFood
              } catch (error) {
                console.error(
                  'Error creating ConsumedFood object:',
                  error,
                  item
                )
                return null
              }
            })
            .filter(Boolean) // Remove any null items
            .sort(
              (a, b) => new Date(b.uploadDateTime) - new Date(a.uploadDateTime)
            )
          setResponseList(consumedFoodList)
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

  return (
    <div className='app'>
      <header>
        <h1>How much did you eat today?</h1>
      </header>
      <div
        className='container-sm'
        style={{ maxWidth: '600px', margin: '0 auto' }}
      >
        <UserProfile consumedFoodList={responseList} />
        <UploadImage setUploading={setUploading} />

        <h2 className='app-section-title'>Consumption History</h2>
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
  )
}

export default App
