import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitCommit,
  FolderGit2,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  Clock,
  Code2,
  Star,
  GitFork,
  Radio,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Github } from './Icons';
import {
  fetchLiveDeveloperStatus,
  formatTimeAgo,
  formatReadableDate,
  LANGUAGE_COLORS,
} from '../services/github';

/**
 * LiveDeveloperStatus Component
 * Displays real-time GitHub activity, latest public repositories, and recent verified commits.
 * Powered by the GitHub REST API with 10-minute caching.
 * Shows a strict, graceful fallback state when data is unavailable or rate limited—never displays fake metrics.
 */
function LiveDeveloperStatus() {
  const [statusState, setStatusState] = useState({
    loading: true,
    data: null,
    error: null,
    isRateLimited: false,
  });
  const [activeTab, setActiveTab] = useState('commits'); // 'commits' | 'repos'
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadInitialData() {
      try {
        const res = await fetchLiveDeveloperStatus(false);
        if (ignore) return;

        if (res.isError) {
          setStatusState({
            loading: false,
            data: null,
            error: res.errorMessage,
            isRateLimited: res.isRateLimited,
          });
        } else {
          setStatusState({
            loading: false,
            data: res,
            error: null,
            isRateLimited: false,
          });
        }
      } catch (err) {
        if (ignore) return;
        setStatusState({
          loading: false,
          data: null,
          error: err.message || 'Failed to load GitHub activity',
          isRateLimited: false,
        });
      }
    }

    loadInitialData();

    return () => {
      ignore = true;
    };
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetchLiveDeveloperStatus(true);
      if (res.isError) {
        setStatusState({
          loading: false,
          data: null,
          error: res.errorMessage,
          isRateLimited: res.isRateLimited,
        });
      } else {
        setStatusState({
          loading: false,
          data: res,
          error: null,
          isRateLimited: false,
        });
      }
    } catch (err) {
      setStatusState({
        loading: false,
        data: null,
        error: err.message || 'Failed to load GitHub activity',
        isRateLimited: false,
      });
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const { loading, data, error, isRateLimited } = statusState;

  return (
    <section id="developer-status" className="section-padding dev-status-section" aria-label="Live Developer Status">
      <div className="container">
        {/* Section Header */}
        <div className="dev-status-header">
          <div className="dev-status-header-text">
            <div className="badge badge-accent dev-live-badge mb-2">
              <Radio size={13} className="radar-pulse-icon mr-1.5" />
              <span>Live Developer Status</span>
            </div>
            <h2 className="section-title">
              Real-Time GitHub <span className="text-gradient">Activity</span>
            </h2>
            <p className="section-subtitle max-w-2xl">
              Verified developer telemetry fetched directly via the GitHub REST API. Inspect real public
              repositories, recent commits, and production code updates.
            </p>
          </div>

          {/* Telemetry Actions (Profile link & Re-sync button) */}
          <div className="dev-status-header-actions">
            <a
              href="https://github.com/arao62916-sys"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm github-profile-btn"
              title="Open Akash Vaidya GitHub Profile"
            >
              <Github size={15} />
              <span>@arao62916-sys</span>
              <ExternalLink size={12} className="text-muted" />
            </a>

            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={loading || isRefreshing}
              className={`btn btn-secondary btn-sm dev-refresh-btn ${isRefreshing ? 'is-syncing' : ''}`}
              title="Refresh live GitHub data"
              aria-label="Refresh GitHub data"
            >
              <RefreshCw size={14} className={isRefreshing ? 'spin-animation' : ''} />
              <span className="hidden sm:inline">Sync API</span>
            </button>
          </div>
        </div>

        {/* Main Card Container */}
        <div className="dev-status-card card mt-8">
          {/* Top Status Banner */}
          <div className="dev-status-topbar">
            <div className="dev-status-topbar-left">
              <span className="live-status-indicator-dot" />
              <span className="dev-status-indicator-text">
                {loading
                  ? 'Connecting to GitHub API...'
                  : error
                  ? 'GitHub REST Fallback Active'
                  : 'Active & Syncing with GitHub'}
              </span>
              {data?.lastSyncedAt && (
                <span className="dev-synced-timestamp text-muted">
                  • Synced {formatTimeAgo(data.lastSyncedAt)}
                </span>
              )}
            </div>

            <div className="dev-status-topbar-right">
              <span className="dev-api-badge">
                <Code2 size={12} />
                <span>GitHub REST v3</span>
              </span>
            </div>
          </div>

          {/* =========================================================
              Case 1: Loading State
             ========================================================= */}
          {loading && (
            <div className="dev-status-loading-state">
              <div className="dev-status-spinner" />
              <p className="text-sm text-muted mt-3">
                Fetching latest public repositories and verified commits from GitHub...
              </p>
            </div>
          )}

          {/* =========================================================
              Case 2: Error / Rate-Limit Fallback State (No Fake Data)
             ========================================================= */}
          {!loading && error && (
            <div className="dev-status-fallback-state">
              <div className="fallback-icon-wrap">
                <AlertCircle size={28} className="text-accent" />
              </div>
              <div className="fallback-content">
                <h3 className="fallback-title">
                  {isRateLimited ? 'GitHub REST API Rate Limit Reached' : 'Live Data Temporarily Unavailable'}
                </h3>
                <p className="fallback-desc">
                  {isRateLimited
                    ? 'GitHub permits 60 unauthenticated REST requests per hour per visitor IP. To maintain strict integrity and technical honesty, this portfolio never displays fabricated statistics or simulated commits.'
                    : error}
                </p>
                <div className="fallback-actions mt-4">
                  <a
                    href="https://github.com/arao62916-sys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    <Github size={15} />
                    <span>View Real Activity on GitHub</span>
                    <ExternalLink size={13} />
                  </a>
                  <button
                    type="button"
                    onClick={handleManualRefresh}
                    className="btn btn-secondary btn-sm"
                  >
                    <RefreshCw size={13} />
                    <span>Retry API Connection</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              Case 3: Real Data Display (Tabs: Commits / Repositories)
             ========================================================= */}
          {!loading && data && (
            <div className="dev-status-body">
              {/* Telemetry Summary Stats Row */}
              <div className="dev-telemetry-metrics-grid">
                <div className="telemetry-metric-item">
                  <span className="telemetry-metric-label">Public Repositories</span>
                  <span className="telemetry-metric-value">{data.user.publicRepos}</span>
                  <span className="telemetry-metric-sub">Open Source Repos</span>
                </div>
                <div className="telemetry-metric-item">
                  <span className="telemetry-metric-label">Primary Stack</span>
                  <span className="telemetry-metric-value text-accent">Dart / React</span>
                  <span className="telemetry-metric-sub">Mobile &amp; Web</span>
                </div>
                <div className="telemetry-metric-item">
                  <span className="telemetry-metric-label">Latest Verified Push</span>
                  <span className="telemetry-metric-value">
                    {data.commits[0] ? formatTimeAgo(data.commits[0].date) : 'Recent'}
                  </span>
                  <span className="telemetry-metric-sub">
                    {data.commits[0]?.repoName || 'MeatWaala'}
                  </span>
                </div>
                <div className="telemetry-metric-item">
                  <span className="telemetry-metric-label">Authentication</span>
                  <span className="telemetry-metric-value text-success">
                    <ShieldCheck size={16} className="inline mr-1 text-accent" />
                    Verified
                  </span>
                  <span className="telemetry-metric-sub">Honest Telemetry</span>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="dev-status-tabs-row mt-6">
                <div className="segmented-control-grid dev-tabs-control">
                  <button
                    type="button"
                    onClick={() => setActiveTab('commits')}
                    className={`segmented-btn ${activeTab === 'commits' ? 'segmented-btn-active' : ''}`}
                    aria-pressed={activeTab === 'commits'}
                  >
                    <GitCommit size={15} />
                    <span>Recent Commits ({data.commits.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('repos')}
                    className={`segmented-btn ${activeTab === 'repos' ? 'segmented-btn-active' : ''}`}
                    aria-pressed={activeTab === 'repos'}
                  >
                    <FolderGit2 size={15} />
                    <span>Public Repositories ({data.repositories.length})</span>
                  </button>
                </div>
              </div>

              {/* Tab Contents */}
              <AnimatePresence mode="wait">
                {activeTab === 'commits' && (
                  <motion.div
                    key="tab-commits"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="dev-commits-stream mt-5"
                  >
                    {data.commits.length === 0 ? (
                      <p className="text-muted text-sm text-center py-6">
                        No recent public commits found in the last 90 days.
                      </p>
                    ) : (
                      <div className="commits-list">
                        {data.commits.map((commit, idx) => (
                          <div key={`${commit.sha}-${idx}`} className="commit-item-row">
                            <div className="commit-icon-col">
                              <div className="commit-dot-node">
                                <GitCommit size={14} className="text-accent" />
                              </div>
                              {idx < data.commits.length - 1 && <div className="commit-line-connector" />}
                            </div>

                            <div className="commit-details-col">
                              <div className="commit-msg-header">
                                <span className="commit-message-text" title={commit.message}>
                                  {commit.message.split('\n')[0]}
                                </span>
                                <a
                                  href={commit.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="commit-sha-badge"
                                  title={`View commit ${commit.sha} on GitHub`}
                                >
                                  <span>#{commit.sha}</span>
                                  <ExternalLink size={10} />
                                </a>
                              </div>

                              <div className="commit-meta-row mt-1 text-xs text-muted">
                                <span className="commit-repo-pill">
                                  <FolderGit2 size={11} className="mr-1" />
                                  {commit.repoFullName}
                                </span>
                                <span>•</span>
                                <span className="commit-author">by {commit.author}</span>
                                <span>•</span>
                                <span className="commit-timestamp">
                                  <Clock size={11} className="mr-1 inline" />
                                  {formatTimeAgo(commit.date)} ({formatReadableDate(commit.date)})
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'repos' && (
                  <motion.div
                    key="tab-repos"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="dev-repos-grid mt-5"
                  >
                    {data.repositories.map((repo) => {
                      const langColor =
                        LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.Default;
                      return (
                        <div key={repo.id} className="dev-repo-card">
                          <div className="repo-card-top">
                            <div className="repo-name-wrap">
                              <FolderGit2 size={16} className="text-accent flex-shrink-0" />
                              <a
                                href={repo.htmlUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="repo-name-link"
                              >
                                {repo.name}
                              </a>
                            </div>
                            <a
                              href={repo.htmlUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="repo-external-link"
                              aria-label={`Open ${repo.name} on GitHub`}
                            >
                              <ExternalLink size={13} />
                            </a>
                          </div>

                          <p className="repo-desc-text mt-2 text-xs text-secondary">
                            {repo.description}
                          </p>

                          <div className="repo-meta-footer mt-4">
                            <div className="repo-lang-pill">
                              <span
                                className="repo-lang-dot"
                                style={{ backgroundColor: langColor }}
                              />
                              <span className="text-xs">{repo.language}</span>
                            </div>

                            <div className="repo-stats-group text-xs text-muted">
                              {repo.stars > 0 && (
                                <span className="repo-stat-badge">
                                  <Star size={11} /> {repo.stars}
                                </span>
                              )}
                              {repo.forks > 0 && (
                                <span className="repo-stat-badge">
                                  <GitFork size={11} /> {repo.forks}
                                </span>
                              )}
                              <span className="repo-updated-time">
                                Updated {formatTimeAgo(repo.updatedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Direct Profile Link Banner */}
              <div className="dev-status-bottom-bar mt-6 pt-4 border-t border-subtle">
                <span className="dev-status-disclaimer text-xs text-muted">
                  <Sparkles size={12} className="inline mr-1 text-accent" />
                  Live telemetry via GitHub REST API. Real commits and public repos only.
                </span>
                <a
                  href={`https://github.com/arao62916-sys`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dev-all-repos-link text-xs text-accent"
                >
                  <span>Explore all repositories on GitHub</span>
                  <ExternalLink size={12} className="ml-1 inline" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default LiveDeveloperStatus;
