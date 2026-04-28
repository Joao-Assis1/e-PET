import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { syncService } from '@/services/syncService'
import { useSyncStore } from '../syncStore'

vi.mock('@/services/syncService', () => ({
  syncService: {
    performInitialSync: vi.fn(),
  },
}))

describe('syncStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should update state during sync', async () => {
    const syncStore = useSyncStore()
    vi.mocked(syncService.performInitialSync).mockResolvedValueOnce(true)

    const syncPromise = syncStore.startSync()

    expect(syncStore.isSyncing).toBe(true)

    await syncPromise

    expect(syncStore.isSyncing).toBe(false)
    expect(syncStore.lastSync).not.toBe(null)
    expect(syncStore.error).toBe(null)
  })

  it('should handle errors during sync', async () => {
    const syncStore = useSyncStore()
    vi.mocked(syncService.performInitialSync).mockRejectedValueOnce(new Error('API Down'))

    await syncStore.startSync()

    expect(syncStore.isSyncing).toBe(false)
    expect(syncStore.error).toBe('API Down')
  })
})
