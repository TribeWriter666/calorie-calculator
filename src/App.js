import './App.scss';
import {IndexedDB}  from'./SimpleIndexedDB'

function App() {
  const db = new IndexedDB("TestDatabase","TestStore")
  db.openDB().then(()=>{
    console.log("DB sucessfully opened")
  }).catch((error)=>{
    console.error("Error while opening db")
  })
  return (
    <div className="App">
      <h1>Title TBD</h1>
      <button className="btn btn-primary">Upload</button>
    </div>
  );
}

export default App;
