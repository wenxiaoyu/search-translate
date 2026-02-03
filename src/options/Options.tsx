import { useState, useEffect } from 'react'
import './options.css'
import { getCacheStats, clearAllCache } from '../utils/cache'

interface Settings {
  enableNotifications: boolean
  autoStart: boolean
  theme: 'light' | 'dark'
  translationEnabled: boolean
  enabledSites: {
    google: boolean
    baidu: boolean
    bing: boolean
    github: boolean
  }
}

interface CacheStats {
  count: number
  size: number
}

function Options() {
  const [settings, setSettings] = useState<Settings>({
    enableNotifications: true,
    autoStart: false,
    theme: 'light',
    translationEnabled: true,
    enabledSites: {
      google: true,
      baidu: true,
      bing: true,
      github: true,
    },
  })
  const [saved, setSaved] = useState(false)
  const [cacheStats, setCacheStats] = useState<CacheStats>({ count: 0, size: 0 })
  const [cacheCleared, setCacheCleared] = useState(false)

  useEffect(() => {
    // Load settings from storage
    chrome.storage.local.get(['settings'], (result) => {
      if (result.settings) {
        setSettings(result.settings as Settings)
      }
    })

    // Load translation settings from sync storage
    chrome.storage.sync.get(['translationEnabled', 'enabledSites'], (result) => {
      if (result.translationEnabled !== undefined || result.enabledSites) {
        setSettings((prev) => ({
          ...prev,
          translationEnabled: typeof result.translationEnabled === 'boolean' 
            ? result.translationEnabled 
            : prev.translationEnabled,
          enabledSites: result.enabledSites 
            ? (result.enabledSites as typeof prev.enabledSites)
            : prev.enabledSites,
        }))
      }
    })

    // Load cache stats
    updateCacheStats()
  }, [])

  const updateCacheStats = () => {
    const stats = getCacheStats()
    setCacheStats(stats)
  }

  const handleSave = () => {
    // Save general settings to local storage
    chrome.storage.local.set({ settings }, () => {
      // Save translation settings to sync storage
      chrome.storage.sync.set(
        {
          translationEnabled: settings.translationEnabled,
          enabledSites: settings.enabledSites,
        },
        () => {
          setSaved(true)
          setTimeout(() => setSaved(false), 2000)
        }
      )
    })
  }

  const handleReset = () => {
    const defaultSettings: Settings = {
      enableNotifications: true,
      autoStart: false,
      theme: 'light',
      translationEnabled: true,
      enabledSites: {
        google: true,
        baidu: true,
        bing: true,
        github: true,
      },
    }
    setSettings(defaultSettings)
    chrome.storage.local.set({ settings: defaultSettings })
    chrome.storage.sync.set({
      translationEnabled: defaultSettings.translationEnabled,
      enabledSites: defaultSettings.enabledSites,
    })
  }

  const handleClearCache = () => {
    if (confirm('确定要清空所有翻译缓存吗?')) {
      clearAllCache()
      updateCacheStats()
      setCacheCleared(true)
      setTimeout(() => setCacheCleared(false), 2000)
    }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="options-container">
      <header>
        <h1>Extension Settings</h1>
        <p>Configure your extension preferences</p>
      </header>

      <main>
        <section className="settings-section">
          <h2>Translation Settings</h2>

          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.translationEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, translationEnabled: e.target.checked })
                }
              />
              <span>Enable Translation</span>
            </label>
            <p className="setting-description">
              Enable real-time translation suggestions in search boxes
            </p>
          </div>

          <div className="setting-item">
            <label>Enabled Search Engines</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.enabledSites.google}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      enabledSites: { ...settings.enabledSites, google: e.target.checked },
                    })
                  }
                />
                <span>Google</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={settings.enabledSites.baidu}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      enabledSites: { ...settings.enabledSites, baidu: e.target.checked },
                    })
                  }
                />
                <span>Baidu</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={settings.enabledSites.bing}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      enabledSites: { ...settings.enabledSites, bing: e.target.checked },
                    })
                  }
                />
                <span>Bing</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={settings.enabledSites.github}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      enabledSites: { ...settings.enabledSites, github: e.target.checked },
                    })
                  }
                />
                <span>GitHub</span>
              </label>
            </div>
            <p className="setting-description">
              Select which search engines should have translation enabled
            </p>
          </div>
        </section>

        <section className="settings-section">
          <h2>Translation Cache</h2>

          <div className="setting-item">
            <div className="cache-stats">
              <p>
                <strong>Cached Translations:</strong> {cacheStats.count}
              </p>
              <p>
                <strong>Cache Size:</strong> {formatBytes(cacheStats.size)}
              </p>
            </div>
            <button className="btn-secondary" onClick={handleClearCache}>
              {cacheCleared ? '✓ Cache Cleared!' : 'Clear Cache'}
            </button>
            <p className="setting-description">
              Clear all cached translation results. Cache helps improve performance and reduce API
              calls.
            </p>
          </div>
        </section>

        <section className="settings-section">
          <h2>General</h2>

          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) =>
                  setSettings({ ...settings, enableNotifications: e.target.checked })
                }
              />
              <span>Enable Notifications</span>
            </label>
            <p className="setting-description">
              Show notifications when content script receives messages
            </p>
          </div>

          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.autoStart}
                onChange={(e) => setSettings({ ...settings, autoStart: e.target.checked })}
              />
              <span>Auto Start</span>
            </label>
            <p className="setting-description">
              Automatically start extension features on page load
            </p>
          </div>
        </section>

        <section className="settings-section">
          <h2>Appearance</h2>

          <div className="setting-item">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              value={settings.theme}
              onChange={(e) =>
                setSettings({ ...settings, theme: e.target.value as 'light' | 'dark' })
              }
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <p className="setting-description">Choose your preferred color theme</p>
          </div>
        </section>

        <div className="actions">
          <button className="btn-primary" onClick={handleSave}>
            {saved ? '✓ Saved!' : 'Save Settings'}
          </button>
          <button className="btn-secondary" onClick={handleReset}>
            Reset to Defaults
          </button>
        </div>
      </main>

      <footer>
        <p>Smart Search Translate v{chrome.runtime.getManifest().version}</p>
      </footer>
    </div>
  )
}

export default Options
