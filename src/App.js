import './App.scss'
import { IndexedDB } from './SimpleIndexedDB'
import ConsumedFood from './ConsumedFood'
import ConsumptionHistoryItem from './ConsumptionHistoryItem'
import UploadImage from './UploadImage'

function App() {
  let consumptionHistory = [
    new ConsumedFood('Fish', { carbs: 12 }),
    new ConsumedFood('Banana', { carbs: 22 }),
  ]

  return (
    <div className='app'>
      <header>
        <h1>Title TBD</h1>
      </header>
      <div className='container'>
        <UploadImage />

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
