import './App.scss'
import Dashboard from './dashboard'

function App() {
  const db = new IndexedDB("TestDatabase","TestStore")
  db.openDB().then(()=>{
    console.log("DB sucessfully opened")
  }).catch((error)=>{
    console.error("Error while opening db")
  })
  return (
    <div className='App'>
      <Dashboard />
    </div>
  )
}

export default App
