import { useState, useEffect } from 'react'
import './popup.css'

function Popup() {
  const [isEnabled, setIsEnabled] = useState(true)
  const [stats, setStats] = useState({ translations: 0, searches: 0 })

  useEffect(() => {
    // Load settings and stats from storage
    chrome.storage.local.get(['enabled', 'stats'], (result) => {
      if (result.enabled !== undefined && result.enabled !== null) {
        setIsEnabled(result.enabled as boolean)
      }
      if (result.stats) {
        setStats(result.stats as { translations: number; searches: number })
      }
    })
  }, [])

  const handleToggle = () => {
    const newState = !isEnabled
    setIsEnabled(newState)
    chrome.storage.local.set({ enabled: newState })
  }

  const openOptions = () => {
    chrome.runtime.openOptionsPage()
  }

  return (
    <div className="popup-container">
      {/* Header */}
      <div className="header">
        <div className="logo">
          <span className="logo-icon">🌐</span>
          <h1 className="logo-text">Search Translate</h1>
        </div>
        <div className="status-badge">
          <span className={`status-dot ${isEnabled ? 'active' : 'inactive'}`}></span>
          <span className="status-text">{isEnabled ? 'Active' : 'Inactive'}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="content">
        {/* Feature Highlights */}
        <div className="feature-section">
          <h2 className="section-title">✨ What It Does</h2>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">🔄</span>
              <div className="feature-text">
                <strong>Real-time Translation</strong>
                <p>Instantly translates Chinese to English as you type</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <div className="feature-text">
                <strong>One-Click Search</strong>
                <p>Click translation to search automatically</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌍</span>
              <div className="feature-text">
                <strong>Multi-Engine Support</strong>
                <p>Works on Google, Bing, GitHub, Stack Overflow</p>
              </div>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="value-section">
          <h2 className="section-title">💡 Why Use It</h2>
          <div className="value-card">
            <p className="value-text">
              English search queries often return <strong>better and more comprehensive results</strong>, 
              especially for technical content, documentation, and research.
            </p>
            <p className="value-highlight">
              Search Translate bridges the language gap effortlessly!
            </p>
          </div>
        </div>

        {/* Stats */}
        {stats.translations > 0 && (
          <div className="stats-section">
            <h2 className="section-title">📊 Your Stats</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{stats.translations}</div>
                <div className="stat-label">Translations</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.searches}</div>
                <div className="stat-label">Searches</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="actions-section">
          <button 
            className={`toggle-button ${isEnabled ? 'enabled' : 'disabled'}`}
            onClick={handleToggle}
          >
            <span className="button-icon">{isEnabled ? '✓' : '○'}</span>
            <span className="button-text">
              {isEnabled ? 'Extension Enabled' : 'Extension Disabled'}
            </span>
          </button>
          
          <button className="secondary-button" onClick={openOptions}>
            <span className="button-icon">⚙️</span>
            <span className="button-text">Settings</span>
          </button>
        </div>

        {/* How to Use */}
        <div className="help-section">
          <h2 className="section-title">🚀 How to Use</h2>
          <ol className="help-list">
            <li>Visit any supported search engine</li>
            <li>Type your query in Chinese</li>
            <li>See instant English translation</li>
            <li>Click to search automatically</li>
          </ol>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <a 
          href="https://github.com/wenxiaoyu/search-translate" 
          target="_blank" 
          rel="noopener noreferrer"
          className="footer-link"
        >
          ⭐ Star on GitHub
        </a>
        <span className="footer-divider">•</span>
        <a 
          href="https://github.com/wenxiaoyu/search-translate/issues" 
          target="_blank" 
          rel="noopener noreferrer"
          className="footer-link"
        >
          🐛 Report Issue
        </a>
      </div>
    </div>
  )
}

export default Popup
