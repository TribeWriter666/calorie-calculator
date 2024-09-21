export default class SimpleIndexedDB {
  constructor(dbName, storeName) {
    this.dbName = dbName
    this.storeName = storeName
    this.db = null
  }

  /**
   * Opens the database. If the database or object store does not exist, it will be created.
   * @param {number} [version=1] - The version of the database (used to upgrade).
   * @returns {Promise} - Resolves with the opened database instance.
   */
  openDB(version = 1) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, version)

      // Handle upgrade event to create object store if it doesn't exist
      request.onupgradeneeded = (event) => {
        const db = event.target.result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, {
            keyPath: 'id',
            autoIncrement: true,
          })
        }
      }

      // Handle success
      request.onsuccess = (event) => {
        this.db = event.target.result
        resolve(this.db)
      }

      // Handle errors
      request.onerror = (event) => {
        reject(`Failed to open the database: ${event.target.errorCode}`)
      }
    })
  }

  /**
   * Adds a new item to the object store.
   * @param {Object} data - The data object to store.
   * @returns {Promise} - Resolves with the ID of the added item.
   */
  addItem(data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)

      const request = store.add(data)

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = (event) => {
        reject(`Failed to add item: ${event.target.errorCode}`)
      }
    })
  }

  /**
   * Retrieves an item from the object store by its ID.
   * @param {number} id - The ID of the item to retrieve.
   * @returns {Promise} - Resolves with the retrieved item.
   */
  getItem(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)

      const request = store.get(id)

      request.onsuccess = () => {
        resolve(request.result) // Return the data retrieved
      }

      request.onerror = (event) => {
        reject(`Failed to retrieve item: ${event.target.errorCode}`)
      }
    })
  }

  /**
   * Retrieves all items from the object store.
   * @returns {Promise} - Resolves with an array of all items in the store.
   */
  getAllItems() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)

      const request = store.getAll()

      request.onsuccess = () => {
        const items = request.result
        items.forEach((item) => {
          if (item.imageBlob) {
            item.imageURL = URL.createObjectURL(item.imageBlob)
          }
        })
        resolve(items)
      }

      request.onerror = (event) => {
        reject(`Failed to retrieve items: ${event.target.errorCode}`)
      }
    })
  }

  /**
   * Updates an existing item in the object store.
   * @param {Object} data - The updated data object, which must include an existing ID.
   * @returns {Promise} - Resolves with a success message.
   */
  updateItem(data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)

      const request = store.put(data)

      request.onsuccess = () => {
        resolve(`Item with ID ${data.id} updated successfully.`)
      }

      request.onerror = (event) => {
        reject(`Failed to update item: ${event.target.errorCode}`)
      }
    })
  }

  /**
   * Deletes an item from the object store by its ID.
   * @param {number} id - The ID of the item to delete.
   * @returns {Promise} - Resolves with a success message.
   */
  deleteItem(id) {
    return new Promise((resolve, reject) => {
      if (id === undefined) {
        reject('No ID provided for deletion')
        return
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)

      const request = store.delete(id)

      request.onsuccess = () => {
        resolve(`Item with ID ${id} deleted successfully.`)
      }

      request.onerror = (event) => {
        reject(`Failed to delete item: ${event.target.error}`)
      }
    })
  }
}
