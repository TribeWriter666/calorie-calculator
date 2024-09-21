export class SimpleIndexedDB {
        constructor(dbName, storeName) {
          this.dbName = dbName;
          this.storeName = storeName;
          this.db = null;
        }
      
        // Open or create the database
        openDB(version = 1) {
          return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, version);
      
            // Handle upgrade event to create object store if it doesn't exist
            request.onupgradeneeded = (event) => {
              const db = event.target.result;
              if (!db.objectStoreNames.contains(this.storeName)) {
                db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
              }
            };
      
            // Handle success
            request.onsuccess = (event) => {
              this.db = event.target.result;
              resolve(this.db);
            };
      
            // Handle errors
            request.onerror = (event) => {
              reject(`Failed to open the database: ${event.target.errorCode}`);
            };
          });
        }
      
        // Add an item to the store
        addItem(data) {
          return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
      
            const request = store.add(data);
      
            request.onsuccess = () => {
              resolve(request.result); // Return the ID of the added item
            };
      
            request.onerror = (event) => {
              reject(`Failed to add item: ${event.target.errorCode}`);
            };
          });
        }
      
        // Get an item by its ID
        getItem(id) {
          return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
      
            const request = store.get(id);
      
            request.onsuccess = () => {
              resolve(request.result); // Return the data retrieved
            };
      
            request.onerror = (event) => {
              reject(`Failed to retrieve item: ${event.target.errorCode}`);
            };
          });
        }
      
        // Get all items from the store
        getAllItems() {
          return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
      
            const request = store.getAll();
      
            request.onsuccess = () => {
              resolve(request.result); // Return all the items
            };
      
            request.onerror = (event) => {
              reject(`Failed to retrieve items: ${event.target.errorCode}`);
            };
          });
        }
      
        // Update an item by its ID
        updateItem(data) {
          return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
      
            const request = store.put(data);
      
            request.onsuccess = () => {
              resolve(`Item with ID ${data.id} updated successfully.`);
            };
      
            request.onerror = (event) => {
              reject(`Failed to update item: ${event.target.errorCode}`);
            };
          });
        }
      
        // Delete an item by its ID
        deleteItem(id) {
          return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
      
            const request = store.delete(id);
      
            request.onsuccess = () => {
              resolve(`Item with ID ${id} deleted successfully.`);
            };
      
            request.onerror = (event) => {
              reject(`Failed to delete item: ${event.target.errorCode}`);
            };
          });
        }
      }
      