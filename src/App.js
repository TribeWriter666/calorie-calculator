import './App.scss'
import ConsumedFood, { nutritionTypes } from './ConsumedFood'
import ConsumptionHistoryItem from './ConsumptionHistoryItem'
import UploadImage from './UploadImage'
import { useDB } from './DBProvider'
import { useEffect, useState } from 'react'
import { upload } from '@testing-library/user-event/dist/upload'

function App() {
  const [uploading, setUploading] = useState(false)
  const [responseList, setResponseList] = useState([])
  const [dbError, setdbError] = useState(null)
  const db = useDB()
  // process response list

  let consumptionHistory = responseList.map((elem) => {
    let name = elem.food_name
    // remove the subscedenting g in macronutrient
    let nutritions = Object.fromEntries(
      Object.entries(elem.macronutrients).map(([k, v]) => [k, parseInt(v)])
    )
    return new ConsumedFood(name, nutritions)
  })

  useEffect(() => {
    const fetch_data = async () => {
      if (db) {
        let list = await db.getAllItems()

        setResponseList(list)
        console.log('list setted')
      }
    }
    fetch_data()
  }, [db, uploading])

  return (
    <div className='app'>
      <header>
        <h1>How much did you eat today?</h1>
      </header>
      <div className='container'>
        <UploadImage setUploading={setUploading} />

        <h2 className='app-section-title'>Consumption History</h2>
        <ul className='list-group'>
          {consumptionHistory.map((item) => (
            <li className='list-group-item p-0'>
              <ConsumptionHistoryItem item={item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
