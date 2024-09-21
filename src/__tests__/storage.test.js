import { SimpleIndexedDB  } from '../SimpleIndexedDB';

require('fake-indexeddb/auto'); // Use fake IndexedDB for testing
// Polyfill for structuredClone
if (typeof global.structuredClone !== 'function') {
        global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
      }
      

describe('SimpleIndexedDB', () => {
  let db;

  beforeAll(async () => {
    db = new SimpleIndexedDB('TestDB', 'TestStore');
    await db.openDB(); // Open the IndexedDB before running tests
  });

  afterAll(async () => {
    // Clean up: Delete the database after all tests
    const request = indexedDB.deleteDatabase('TestDB');
    await new Promise((resolve, reject) => {
      request.onsuccess = resolve;
      request.onerror = reject;
    });
  });

  it('should add an item to the object store', async () => {
    const item = { name: 'John Doe', age: 30 };
    const id = await db.addItem(item);
    expect(id).toBeDefined(); // Check that the ID is defined
  });

  it('should retrieve an item by ID', async () => {
    const item = { name: 'Jane Doe', age: 25 };
    const id = await db.addItem(item);
    const storedItem = await db.getItem(id);
    expect(storedItem).toEqual({ id, ...item }); // Check that the retrieved item matches the added one
  });

  it('should retrieve all items from the store', async () => {
    const allItems = await db.getAllItems();
    expect(Array.isArray(allItems)).toBe(true); // Ensure that the result is an array
    expect(allItems.length).toBeGreaterThan(0); // Ensure that at least one item exists in the store
  });

  it('should update an existing item', async () => {
    const item = { name: 'John Doe', age: 30 };
    const id = await db.addItem(item);
    const updatedItem = { id, name: 'John Doe', age: 35 };
    const updateMessage = await db.updateItem(updatedItem);
    expect(updateMessage).toBe(`Item with ID ${id} updated successfully.`);
    const retrievedItem = await db.getItem(id);
    expect(retrievedItem.age).toBe(35); // Check if the item was updated
  });

  it('should delete an item by ID', async () => {
    const item = { name: 'Jane Doe', age: 25 };
    const id = await db.addItem(item);
    const deleteMessage = await db.deleteItem(id);
    expect(deleteMessage).toBe(`Item with ID ${id} deleted successfully.`);
    const retrievedItem = await db.getItem(id);
    expect(retrievedItem).toBeUndefined(); // Ensure the item no longer exists
  });

  it('should return undefined when retrieving a non-existent item', async () => {
    const item = await db.getItem(999); // Non-existent ID
    expect(item).toBeUndefined();
  });
});
