

/*The warpper for SImpleIndexedDB for persisitency across every component 
By using "const db = useDB", you will get a SimpleIndexedDB obecjt for use


*/
import React, { createContext, useEffect, useState, useContext } from 'react';
import SimpleIndexedDB from './SimpleIndexedDB'; // Adjust path as necessary

// Create the context 
const DBContext = createContext(null);

// Export a hook to use the DBContext easily in components
export const useDB = () => {
  return useContext(DBContext);
};

// The DBProvider component to wrap your application and provide the IndexedDB instance
export const DBProvider = ({ children }) => {
  const [dbInstance, setDbInstance] = useState(null);

  useEffect(() => {
    // Initialize the SimpleIndexedDB only once when the provider mounts
    const initDB = async () => {
      const db = new SimpleIndexedDB('MyDatabase', 'MyStore');
      await db.openDB(); // Open the database
      setDbInstance(db); // Set the shared db instance
    };

    initDB(); // Initialize the DB
  }, []); // Empty dependency array ensures this only runs once

  return (
    <DBContext.Provider value={dbInstance}>
      {children}
    </DBContext.Provider>
  );
};
