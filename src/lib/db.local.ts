import { openDB, DBSchema, IDBPDatabase } from 'idb'

// Database schema
interface VocabDB extends DBSchema {
  progress_by_word: {
    key: string // format: `${deviceId}:${wordId}`
    value: {
      wordId: string
      lastSeen: number
      interval: number // days
      ease: number // 1.3 ~ 2.5
      reps: number
      lapses: number
      nextReviewAt: number
    }
  }
  settings: {
    key: 'global'
    value: {
      tts: 'web' | 'audio'
      quizOptionCount: number
      dailyGoal: number
      showPhonetic: boolean
      autoPlay: boolean
    }
  }
  errors: {
    key: string // wordId
    value: {
      wordId: string
      errorCount: number
      lastError: number
      errorType: 'meaning' | 'spelling' | 'pronunciation'
    }
  }
}

let dbInstance: IDBPDatabase<VocabDB> | null = null

// Initialize database
export async function initDB(): Promise<IDBPDatabase<VocabDB>> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<VocabDB>('voca', 1, {
    upgrade(db) {
      // Create stores
      if (!db.objectStoreNames.contains('progress_by_word')) {
        const progressStore = db.createObjectStore('progress_by_word')
        progressStore.createIndex('nextReviewAt', 'nextReviewAt')
        progressStore.createIndex('wordId', 'wordId')
      }

      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings')
      }

      if (!db.objectStoreNames.contains('errors')) {
        const errorsStore = db.createObjectStore('errors')
        errorsStore.createIndex('errorCount', 'errorCount')
      }
    },
  })

  return dbInstance
}

// Progress management
export async function saveWordProgress(
  deviceId: string,
  wordId: string,
  progress: Omit<VocabDB['progress_by_word']['value'], 'wordId'>
) {
  const db = await initDB()
  const key = `${deviceId}:${wordId}`
  await db.put('progress_by_word', { wordId, ...progress }, key)
}

export async function getWordProgress(
  deviceId: string,
  wordId: string
): Promise<VocabDB['progress_by_word']['value'] | null> {
  const db = await initDB()
  const key = `${deviceId}:${wordId}`
  const result = await db.get('progress_by_word', key)
  return result || null
}

export async function getWordsForReview(deviceId: string): Promise<string[]> {
  const db = await initDB()
  const now = Date.now()
  const tx = db.transaction('progress_by_word', 'readonly')
  const index = tx.store.index('nextReviewAt')
  
  const results = []
  for await (const cursor of index.iterate(IDBKeyRange.upperBound(now))) {
    const key = cursor.key as string
    if (key.startsWith(`${deviceId}:`)) {
      results.push(cursor.value.wordId)
    }
  }
  
  return results
}

// Settings management
export async function saveSettings(settings: VocabDB['settings']['value']) {
  const db = await initDB()
  await db.put('settings', settings, 'global')
}

export async function getSettings(): Promise<VocabDB['settings']['value'] | null> {
  const db = await initDB()
  return await db.get('settings', 'global') || null
}

// Error tracking
export async function saveWordError(
  wordId: string,
  errorType: VocabDB['errors']['value']['errorType']
) {
  const db = await initDB()
  const existing = await db.get('errors', wordId)
  
  const errorData: VocabDB['errors']['value'] = {
    wordId,
    errorCount: (existing?.errorCount || 0) + 1,
    lastError: Date.now(),
    errorType,
  }
  
  await db.put('errors', errorData, wordId)
}

export async function getWordErrors(wordId: string): Promise<VocabDB['errors']['value'] | null> {
  const db = await initDB()
  return await db.get('errors', wordId) || null
}

export async function getMostMissedWords(limit = 10): Promise<VocabDB['errors']['value'][]> {
  const db = await initDB()
  const tx = db.transaction('errors', 'readonly')
  const index = tx.store.index('errorCount')
  
  const results = []
  for await (const cursor of index.iterate(null, 'prev')) {
    results.push(cursor.value)
    if (results.length >= limit) break
  }
  
  return results
}

// Clear all local data
export async function clearAllData(): Promise<void> {
  const db = await initDB()
  const tx = db.transaction(['progress_by_word', 'settings', 'errors'], 'readwrite')
  
  await Promise.all([
    tx.objectStore('progress_by_word').clear(),
    tx.objectStore('settings').clear(),
    tx.objectStore('errors').clear(),
  ])
}

// Export/Import functionality for backup
export async function exportData(deviceId: string): Promise<string> {
  const db = await initDB()
  const tx = db.transaction(['progress_by_word', 'settings', 'errors'], 'readonly')
  
  const progressData = []
  const progressStore = tx.objectStore('progress_by_word')
  
  for await (const cursor of progressStore.iterate()) {
    const key = cursor.key as string
    if (key.startsWith(`${deviceId}:`)) {
      progressData.push({
        key,
        value: cursor.value,
      })
    }
  }
  
  const settings = await tx.objectStore('settings').get('global')
  const errors = await tx.objectStore('errors').getAll()
  
  const exportObj = {
    deviceId,
    exportedAt: Date.now(),
    progress: progressData,
    settings,
    errors,
  }
  
  return JSON.stringify(exportObj, null, 2)
}

export async function importData(jsonData: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonData)
    const db = await initDB()
    const tx = db.transaction(['progress_by_word', 'settings', 'errors'], 'readwrite')
    
    // Import progress
    if (data.progress && Array.isArray(data.progress)) {
      for (const item of data.progress) {
        await tx.objectStore('progress_by_word').put(item.value, item.key)
      }
    }
    
    // Import settings
    if (data.settings) {
      await tx.objectStore('settings').put(data.settings, 'global')
    }
    
    // Import errors
    if (data.errors && Array.isArray(data.errors)) {
      for (const error of data.errors) {
        await tx.objectStore('errors').put(error, error.wordId)
      }
    }
    
    return true
  } catch (error) {
    console.error('Failed to import data:', error)
    return false
  }
}