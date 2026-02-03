import { StateStorage } from 'zustand/middleware';

const DB_NAME = 'wardrobe-db';
const STORE_NAME = 'wardrobe-store';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

async function getItem(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result ?? null);
    });
  } catch (error) {
    console.error('IndexedDB getItem error:', error);
    // Fallback to localStorage
    return localStorage.getItem(key);
  }
}

async function setItem(key: string, value: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.error('IndexedDB setItem error:', error);
    // Fallback to localStorage
    localStorage.setItem(key, value);
  }
}

async function removeItem(key: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.error('IndexedDB removeItem error:', error);
    localStorage.removeItem(key);
  }
}

// Custom storage adapter for zustand using IndexedDB
// IndexedDB typically allows 50MB+ storage (vs 5MB for localStorage)
export const indexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await removeItem(name);
  },
};

// Migrate data from localStorage to IndexedDB (one-time migration)
export async function migrateFromLocalStorage(): Promise<void> {
  const localData = localStorage.getItem('wardrobe-storage');
  if (localData) {
    try {
      await setItem('wardrobe-storage', localData);
      localStorage.removeItem('wardrobe-storage');
      console.log('Successfully migrated data from localStorage to IndexedDB');
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }
}
