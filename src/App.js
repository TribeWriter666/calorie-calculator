import './App.scss';
import { IndexedDB }  from './SimpleIndexedDB'
import ConsumedFood from './ConsumedFood';

function App() {
  let consumptionHistory = [
    new ConsumedFood('Fish', {carbs: 12}),
    new ConsumedFood('Banana', {carbs: 22}),
  ];

  return (
    <div className="app">
      <header>
        <h1>Title TBD</h1>
      </header>
      <div className='container'>

        <div className='d-grid gap-2'>
          <button className="btn btn-primary focus-ring">Upload</button>
        </div>

        <h2 className='app-section-title'>Consumption History</h2>
        <ul className='list-group'>
          {consumptionHistory.map(item =>
            <li className='list-group-item d-flex justify-content-between'>
              <span>{item.name}</span>
              <span>{item.calories} Cal</span>
            </li>
          )}
        </ul>

      </div>
    </div>
  );
}


export default App;
