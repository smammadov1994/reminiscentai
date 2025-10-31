// Browser database service for storing generation history using IndexedDB

export interface HistoryEntry {
  id: string;
  timestamp: number;
  originalImage: {
    base64: string;
    mimeType: string;
    url: string;
  };
  generatedImages: (string | null | 'error')[];
  milestoneLabel: string;
  milestoneIndex: number;
  favoritedIndex: number | null;
  isPaid: boolean;
}

class HistoryDatabase {
  private dbName = 'LogoReactivatorDB';
  private version = 1;
  private storeName = 'history';
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Opening IndexedDB:', this.dbName);
      
      if (!window.indexedDB) {
        reject(new Error('IndexedDB not supported'));
        return;
      }

      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('IndexedDB open error:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        console.log('IndexedDB opened successfully');
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        console.log('IndexedDB upgrade needed');
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          console.log('Creating object store:', this.storeName);
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          console.log('Object store created');
        }
      };
    });
  }

  async saveGeneration(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): Promise<string> {
    if (!this.db) {
      console.log('Database not initialized, initializing...');
      await this.init();
    }

    const id = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = Date.now();
    
    const fullEntry: HistoryEntry = {
      id,
      timestamp,
      ...entry,
    };

    console.log('Saving entry to IndexedDB:', fullEntry);

    return new Promise((resolve, reject) => {
      const transaction = this.db!.createTransaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(fullEntry);

      request.onerror = () => {
        console.error('Failed to save entry:', request.error);
        reject(request.error);
      };
      request.onsuccess = () => {
        console.log('Entry saved successfully with ID:', id);
        resolve(id);
      };
    });
  }

  async getAllHistory(): Promise<HistoryEntry[]> {
    if (!this.db) {
      console.log('Database not initialized for getAllHistory, initializing...');
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.createTransaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('timestamp');
      const request = index.getAll();

      request.onerror = () => {
        console.error('Failed to get all history:', request.error);
        reject(request.error);
      };
      request.onsuccess = () => {
        // Sort by timestamp descending (newest first)
        const results = request.result.sort((a, b) => b.timestamp - a.timestamp);
        console.log('Retrieved history entries:', results.length);
        resolve(results);
      };
    });
  }

  async getHistoryById(id: string): Promise<HistoryEntry | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.createTransaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async updateHistory(id: string, updates: Partial<HistoryEntry>): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.createTransaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      // First get the existing entry
      const getRequest = store.get(id);
      getRequest.onsuccess = () => {
        const existingEntry = getRequest.result;
        if (existingEntry) {
          const updatedEntry = { ...existingEntry, ...updates };
          const putRequest = store.put(updatedEntry);
          putRequest.onerror = () => reject(putRequest.error);
          putRequest.onsuccess = () => resolve();
        } else {
          reject(new Error('Entry not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async deleteHistory(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.createTransaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clearAllHistory(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.createTransaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

// Export singleton instance
export const historyDB = new HistoryDatabase();

// Helper functions
export const formatHistoryDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

export const getHistoryPreview = (entry: HistoryEntry): string => {
  const validImages = entry.generatedImages.filter(img => typeof img === 'string').length;
  return `${validImages} variations • ${entry.milestoneLabel}`;
};