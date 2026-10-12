import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitCommit,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  Code2,
  Star,
  GitFork,
  Radio,
  ShieldCheck,
  TrendingUp,
  Pin,
  GitPullRequest,
  Flame,
  Globe,
} from 'lucide-react';
import { Github } from './Icons';
import {
  fetchLiveDeveloperStatus,
  generateContributionCalendar,
  calculateLanguageFootprint,
  getPinnedRepositories,
  groupActivityByMonth,
  formatTimeAgo,
  LANGUAGE_COLORS,
  PRIMARY_USERNAME,
} from '../services/github';

/**
 * LiveDeveloperStatus Component
 * Modern Developer Profile Dashboard:
 * 1. 52-Week Contribution Matrix (Contribution Dots / Heatmap) with month headers, day labels, tooltips & year selector
 * 2. Language Footprint Breakdown Card with segmented multi-color progress bar
 * 3. Pinned Repositories Grid with topics, language dots, stars, and forks
 * 4. Monthly Contribution Activity Timeline with verified commit stream
 * 5. Powered by GitHub REST API with graceful fallback when rate limited
 */
function LiveDeveloperStatus() {
  const [statusState, setStatusState] = useState({
    loading: true,
    data: null,
    error: null,
    isRateLimited: false,
  });
  const [selectedYear, setSelectedYear] = useState(2026);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);

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

  // Compute 52-week contribution dots matrix based on selected year and verified commits
  const calendarData = useMemo(() => {
    const commits = data?.commits || [];
    return generateContributionCalendar(selectedYear, commits);
  }, [selectedYear, data?.commits]);

  // Compute language footprint breakdown
  const languageData = useMemo(() => {
    return calculateLanguageFootprint(data?.repositories || []);
  }, [data?.repositories]);

  // Curate pinned repositories
  const pinnedRepos = useMemo(() => {
    return getPinnedRepositories(data?.repositories || []);
  }, [data?.repositories]);

  // Group verified commits by month
  const monthlyActivity = useMemo(() => {
    return groupActivityByMonth(data?.commits || []);
  }, [data?.commits]);

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
              Real-Time GitHub <span className="text-gradient">Activity &amp; Telemetry</span>
            </h2>
            <p className="section-subtitle max-w-2xl">
              Verified developer telemetry fetched directly from the GitHub REST API. Inspect contribution dots,
              repository language footprint, and recent verified commits.
            </p>
          </div>

          {/* Telemetry Actions (Profile link & Re-sync button) */}
          <div className="dev-status-header-actions">
            <a
              href={`https://github.com/${PRIMARY_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm github-profile-btn"
              title="Open Akash Vaidya GitHub Profile"
            >
              <Github size={15} />
              <span>@{PRIMARY_USERNAME}</span>
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

        {/* Status Topbar */}
        <div className="dev-status-topbar mt-6">
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
          <div className="dev-status-loading-state card mt-4">
            <div className="dev-status-spinner" />
            <p className="text-sm text-muted mt-3">
              Fetching contribution telemetry and repositories from GitHub...
            </p>
          </div>
        )}

        {/* =========================================================
            Case 2: Error / Rate-Limit Fallback State (No Fake Data)
           ========================================================= */}
        {!loading && error && (
          <div className="dev-status-fallback-state card mt-4">
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
                  href={`https://github.com/${PRIMARY_USERNAME}`}
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
            Case 3: Live Developer Dashboard (Contribution Dots & UI)
           ========================================================= */}
        {!loading && data && (
          <div className="dev-dashboard-root mt-4">
            {/* =======================================================
                Row 1: Contribution Dots Heatmap (Left) + Language Footprint (Right)
               ======================================================= */}
            <div className="dev-dashboard-grid-top">
              {/* Card 1: 52-Week Contribution Matrix */}
              <div className="dev-card contribution-heatmap-card card">
                {/* Heatmap Card Top Header */}
                <div className="heatmap-card-header">
                  <div>
                    <h3 className="heatmap-headline">
                      {calendarData.totalContributions.toLocaleString()} contributions in {selectedYear}
                    </h3>
                    <p className="heatmap-subtext">
                      Commits across public repositories &amp; verified workspaces.
                    </p>
                  </div>

                  <div className="heatmap-controls-row">
                    {/* Streak Badge */}
                    <div className="heatmap-streak-badge" title={`Current streak: ${calendarData.streak}`}>
                      <Flame size={13} className="text-accent mr-1" />
                      <span className="streak-label">STREAK</span>
                      <strong className="streak-value">{calendarData.streak}</strong>
                    </div>

                    {/* Year Selector Buttons */}
                    <div className="year-selector-group">
                      {[2026, 2025, 2024, 2023].map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => setSelectedYear(yr)}
                          className={`year-toggle-btn ${selectedYear === yr ? 'year-btn-active' : ''}`}
                          aria-pressed={selectedYear === yr}
                        >
                          {yr}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* The Contribution Dots Matrix */}
                <div className="heatmap-scroll-container mt-5">
                  <div className="heatmap-matrix-wrapper">
                    {/* Month Labels along top */}
                    <div className="heatmap-months-row">
                      <div className="heatmap-day-label-spacer" />
                      <div className="heatmap-months-track">
                        {calendarData.monthLabels.map((m, idx) => (
                          <span
                            key={`${m.label}-${idx}`}
                            className="heatmap-month-label"
                            style={{ left: `${(m.colIndex / 52) * 100}%` }}
                          >
                            {m.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Matrix: Day Labels on left + 52 Column grid of 7 dots */}
                    <div className="heatmap-grid-body">
                      {/* Left Day Labels */}
                      <div className="heatmap-days-col">
                        <span className="heatmap-day-label">Mon</span>
                        <span className="heatmap-day-label heatmap-day-empty" />
                        <span className="heatmap-day-label">Wed</span>
                        <span className="heatmap-day-label heatmap-day-empty" />
                        <span className="heatmap-day-label">Fri</span>
                        <span className="heatmap-day-label heatmap-day-empty" />
                        <span className="heatmap-day-label heatmap-day-empty" />
                      </div>

                      {/* 52 Columns of Contribution Dots */}
                      <div className="heatmap-columns-track">
                        {calendarData.weeks.map((week, wIdx) => (
                          <div key={`week-${wIdx}`} className="heatmap-week-col">
                            {week.map((day) => (
                              <div
                                key={day.date}
                                className={`contribution-dot dot-level-${day.level}`}
                                onMouseEnter={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setHoveredDay({
                                    ...day,
                                    x: rect.left + rect.width / 2,
                                    y: rect.top,
                                  });
                                }}
                                onMouseLeave={() => setHoveredDay(null)}
                                aria-label={day.tooltip}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Heatmap Footer: Explainer on left + Legend on right */}
                <div className="heatmap-footer mt-4">
                  <span className="heatmap-explainer-link text-xs text-muted">
                    Learn how we count contributions
                  </span>

                  <div className="heatmap-legend">
                    <span className="legend-label text-xs text-muted">Less</span>
                    <span className="contribution-dot dot-level-0" title="0 contributions" />
                    <span className="contribution-dot dot-level-1" title="1-2 contributions" />
                    <span className="contribution-dot dot-level-2" title="3-4 contributions" />
                    <span className="contribution-dot dot-level-3" title="5-7 contributions" />
                    <span className="contribution-dot dot-level-4" title="8+ contributions" />
                    <span className="legend-label text-xs text-muted">More</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Language Footprint Card */}
              <div className="dev-card language-footprint-card card">
                <div className="footprint-header">
                  <div className="footprint-title-wrap">
                    <TrendingUp size={16} className="text-accent" />
                    <h3 className="footprint-title">Language footprint</h3>
                  </div>
                  <span className="footprint-repos-count text-xs text-muted">
                    {languageData.totalRepos} repos
                  </span>
                </div>

                {/* Segmented Multi-Color Progress Bar */}
                <div className="language-bar-track mt-4">
                  {languageData.languages.map((lang) => (
                    <div
                      key={lang.name}
                      className="language-bar-segment"
                      style={{
                        width: `${lang.percentage}%`,
                        backgroundColor: lang.color,
                      }}
                      title={`${lang.name}: ${lang.percentage}%`}
                    />
                  ))}
                </div>

                {/* Language Breakdown List */}
                <div className="language-breakdown-list mt-5">
                  {languageData.languages.map((lang) => (
                    <div key={lang.name} className="language-item-row">
                      <div className="language-name-col">
                        <span
                          className="language-dot"
                          style={{ backgroundColor: lang.color }}
                        />
                        <span className="language-name">{lang.name}</span>
                      </div>
                      <div className="language-stats-col text-xs text-muted">
                        <span className="lang-count">{lang.count}</span>
                        <span className="lang-bullet">•</span>
                        <span className="lang-percent font-mono">{lang.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* =======================================================
                Row 2: Pinned Repositories Grid
               ======================================================= */}
            <div className="dev-dashboard-section mt-8">
              <div className="dashboard-section-header">
                <div className="dashboard-section-title">
                  <Pin size={16} className="text-accent" />
                  <h3>Pinned repositories</h3>
                  <span className="text-xs text-muted ml-2">
                    {pinnedRepos.length} of {data.user.publicRepos} • real activity
                  </span>
                </div>

                <a
                  href={`https://github.com/${PRIMARY_USERNAME}?tab=repositories`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dashboard-view-all-link text-xs text-accent"
                >
                  <span>All repositories</span>
                  <ExternalLink size={12} className="ml-1 inline" />
                </a>
              </div>

              {/* 3-Column Responsive Pinned Grid */}
              <div className="pinned-repos-grid mt-4">
                {pinnedRepos.map((repo) => {
                  const langColor =
                    LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.Default;
                  return (
                    <div key={repo.id} className="pinned-repo-card card">
                      {/* Top Owner / Link */}
                      <div className="pinned-card-header">
                        <div className="pinned-owner-row">
                          <Globe size={13} className="text-muted mr-1" />
                          <span className="pinned-owner-text text-xs text-muted">
                            {repo.owner} /
                          </span>
                        </div>
                        <a
                          href={repo.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pinned-external-btn"
                          aria-label={`Open ${repo.name} on GitHub`}
                        >
                          <ExternalLink size={13} />
                        </a>
                      </div>

                      {/* Repo Name */}
                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pinned-repo-name mt-1"
                      >
                        {repo.name}
                      </a>

                      {/* Description */}
                      <p className="pinned-repo-desc mt-2 text-xs text-secondary">
                        {repo.description}
                      </p>

                      {/* Topic Tags */}
                      <div className="pinned-tags-wrap mt-3">
                        {repo.topics.map((t) => (
                          <span key={t} className="pinned-tag-pill">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Card Footer: Language, Stars, License, Updated */}
                      <div className="pinned-footer mt-4 pt-3 border-t border-subtle">
                        <div className="pinned-meta-left">
                          <span className="pinned-lang-pill">
                            <span
                              className="pinned-lang-dot"
                              style={{ backgroundColor: langColor }}
                            />
                            <span className="text-xs">{repo.language}</span>
                          </span>

                          <span className="pinned-stat-item text-xs text-muted">
                            <Star size={11} className="mr-0.5" />
                            {repo.stars}
                          </span>

                          <span className="pinned-stat-item text-xs text-muted">
                            <GitFork size={11} className="mr-0.5" />
                            {repo.forks}
                          </span>
                        </div>

                        <span className="pinned-updated-text text-xs text-muted">
                          Updated {formatTimeAgo(repo.updatedAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* =======================================================
                Row 3: Contribution Activity Timeline
               ======================================================= */}
            <div className="dev-dashboard-section mt-8">
              <div className="dashboard-section-header">
                <div className="dashboard-section-title">
                  <GitCommit size={16} className="text-accent" />
                  <h3>Contribution activity</h3>
                </div>
                <span className="text-xs text-muted">
                  Aggregated work across repositories, grouped by month
                </span>
              </div>

              <div className="activity-timeline-card card mt-4">
                {monthlyActivity.length === 0 ? (
                  <p className="text-sm text-muted text-center py-6">
                    No verified commit activity available for the selected period.
                  </p>
                ) : (
                  <div className="activity-months-stream">
                    {monthlyActivity.map((group) => (
                      <div key={group.month} className="activity-month-block">
                        <div className="activity-month-heading">
                          <span className="activity-month-title font-semibold text-sm">
                            {group.month}
                          </span>
                          <span className="activity-month-divider" />
                        </div>

                        {/* Month Commit Item */}
                        <div className="activity-event-row mt-3">
                          <div className="activity-icon-bubble">
                            <GitCommit size={14} className="text-accent" />
                          </div>

                          <div className="activity-event-content">
                            <div className="activity-event-summary">
                              <span className="text-sm font-semibold text-primary">
                                Created {group.commits.length} commit{group.commits.length > 1 ? 's' : ''} in{' '}
                                {group.reposCount} repositor{group.reposCount > 1 ? 'ies' : 'y'}
                              </span>
                              <span className="text-xs text-muted">
                                {formatTimeAgo(group.commits[0]?.date)}
                              </span>
                            </div>

                            {/* Commits Sub-List */}
                            <div className="activity-commits-sublist mt-2">
                              {group.commits.map((commit, cIdx) => (
                                <div key={`${commit.sha}-${cIdx}`} className="activity-subcommit-item">
                                  <div className="subcommit-header">
                                    <GitPullRequest size={12} className="text-accent mr-1.5 flex-shrink-0" />
                                    <span className="subcommit-msg text-xs" title={commit.message}>
                                      {commit.message.split('\n')[0]}
                                    </span>
                                  </div>

                                  <div className="subcommit-meta-tags">
                                    <a
                                      href={commit.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="commit-sha-pill"
                                      title={`View commit ${commit.sha} on GitHub`}
                                    >
                                      #{commit.sha}
                                      <ExternalLink size={9} className="ml-1 inline" />
                                    </a>
                                    <span className="subcommit-repo text-xs text-muted font-mono">
                                      {commit.repoName}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bottom Assurance Bar */}
                <div className="activity-footer-bar mt-5 pt-3 border-t border-subtle">
                  <div className="flex items-center text-xs text-muted">
                    <ShieldCheck size={13} className="text-accent mr-1.5" />
                    <span>Real-time GitHub REST data. Zero artificial metrics or fabricated commits.</span>
                  </div>
                  <a
                    href={`https://github.com/${PRIMARY_USERNAME}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-accent font-semibold"
                  >
                    <span>View Full GitHub Profile ↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Tooltip for Hovered Contribution Dot */}
        <AnimatePresence>
          {hoveredDay && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className="contribution-floating-tooltip"
              style={{
                left: `${hoveredDay.x}px`,
                top: `${hoveredDay.y - 34}px`,
              }}
            >
              <span>{hoveredDay.tooltip}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default LiveDeveloperStatus;
