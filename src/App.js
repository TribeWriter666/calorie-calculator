import './App.scss'
import ConsumedFood, { nutritionTypes } from './ConsumedFood'
import ConsumptionHistoryItem from './ConsumptionHistoryItem'
import UploadImage from './UploadImage'
import { useDB } from './DBProvider'
import { useEffect, useState } from 'react'

function App() {
  const [uploading, setUploading] = useState(false)
  const [responseList, setResponseList] = useState([])
  const [dbError, setdbError] = useState(null)
  const db = useDB()

  useEffect(() => {
    const fetch_data = async () => {
      if (db) {
        let list = await db.getAllItems()
        const consumedFoodList = list
          .map((item) => new ConsumedFood(item))
          .sort(
            (a, b) => new Date(a.uploadDateTime) - new Date(b.uploadDateTime)
          )
        setResponseList(consumedFoodList)
        console.log('list setted')
        console.log(responseList)
      }
    }
    fetch_data()
  }, [db, uploading])

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

        <h2 className='app-section-title'>Consumption History</h2>
        <ul className='list-group'>
          {responseList.map((item, index) => (
            <li key={index} className='list-group-item p-0'>
              <ConsumptionHistoryItem item={item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
