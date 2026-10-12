import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark,
  Bug,
  CheckCircle2,
  Copy,
  Check,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  Flame,
  Terminal,
} from 'lucide-react';
import SectionTitle from './SectionTitle';
import { bugCases, bugLogRules, bugCategories } from '../data/bugs';

export default function BugDeathNote() {
  const [selectedCaseId, setSelectedCaseId] = useState(bugCases[0].id);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRules, setShowRules] = useState(false);
  const [stampedMap, setStampedMap] = useState(() => {
    // Default: all bugs are stamped as ELIMINATED
    const initial = {};
    bugCases.forEach((b) => {
      initial[b.id] = true;
    });
    return initial;
  });
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  // Filtered cases list based on category and search query
  const filteredCases = useMemo(() => {
    return bugCases.filter((c) => {
      const matchesCategory =
        activeCategory === 'all' || c.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.alias.toLowerCase().includes(q) ||
        c.subsystem.toLowerCase().includes(q) ||
        c.project.toLowerCase().includes(q) ||
        c.incident.toLowerCase().includes(q) ||
        c.culprit.toLowerCase().includes(q) ||
        c.verdict.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Ensure active case is in filtered set or fallback
  const activeCase = useMemo(() => {
    const found = filteredCases.find((c) => c.id === selectedCaseId);
    if (found) return found;
    return filteredCases[0] || bugCases[0];
  }, [filteredCases, selectedCaseId]);

  const currentIndex = filteredCases.findIndex((c) => c.id === activeCase.id);

  const handleNextCase = () => {
    if (filteredCases.length === 0) return;
    const nextIdx = (currentIndex + 1) % filteredCases.length;
    setSelectedCaseId(filteredCases[nextIdx].id);
  };

  const handlePrevCase = () => {
    if (filteredCases.length === 0) return;
    const prevIdx = (currentIndex - 1 + filteredCases.length) % filteredCases.length;
    setSelectedCaseId(filteredCases[prevIdx].id);
  };

  const handleToggleStamp = (caseId) => {
    setStampedMap((prev) => ({
      ...prev,
      [caseId]: !prev[caseId],
    }));
  };

  const handleCopyCode = (snippet, id) => {
    navigator.clipboard.writeText(snippet);
    setCopiedCodeId(id);
    setTimeout(() => {
      setCopiedCodeId(null);
    }, 2000);
  };

  const isStamped = stampedMap[activeCase.id] ?? true;

  return (
    <section
      className="section-padding bg-surface bug-death-note-section"
      id="death-note-bug-log"
      aria-label="Death Note — The Bug Log"
    >
      <div className="container">
        {/* Section Header */}
        <div className="death-note-header-wrap">
          <SectionTitle
            badge="Engineering Case Files"
            title="Death Note — The Bug Log"
            subtitle="Har bug ka ek naam, ek kaaran, aur ek pakka solution. Real engineering crimes against production, inscribed and eliminated forever."
            align="center"
          />

          {/* Quick Rules Toggle Bar */}
          <div className="death-note-ribbon-bar">
            <button
              type="button"
              className={`ribbon-action-btn ${showRules ? 'ribbon-active' : ''}`}
              onClick={() => setShowRules((prev) => !prev)}
              aria-expanded={showRules}
            >
              <Bookmark size={15} className="ribbon-icon text-accent" />
              <span>{showRules ? 'Close Notebook Rules' : 'Read Rules of the Bug Log'}</span>
              <span className="ribbon-pill">4 Rules</span>
            </button>
          </div>
        </div>

        {/* Collapsible Rules Drawer */}
        <AnimatePresence>
          {showRules && (
            <motion.div
              className="death-note-rules-dossier"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="rules-dossier-inner">
                <div className="rules-dossier-title">
                  <Flame size={16} className="text-accent" />
                  <h4>How to Use It: Inscribing Defects out of Existence</h4>
                </div>
                <div className="rules-grid">
                  {bugLogRules.map((rule) => (
                    <div key={rule.ruleNumber} className="rule-card">
                      <span className="rule-number-tag">{rule.ruleNumber}</span>
                      <p className="rule-text">{rule.statement}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Physical Notebook Container */}
        <div className="death-note-book-wrapper">
          {/* Leather Book Spine & Corner Accents */}
          <div className="death-note-book-chassis">
            {/* Top Hanging Ribbon Bookmark */}
            <div
              className="book-ribbon-tab"
              title="Click to toggle notebook rules"
              onClick={() => setShowRules((prev) => !prev)}
            >
              <span className="ribbon-tape" />
            </div>

            {/* Binder Rings / Stitch Column */}
            <div className="notebook-spine-stitch" aria-hidden="true">
              <span className="stitch-point" />
              <span className="stitch-point" />
              <span className="stitch-point" />
              <span className="stitch-point" />
              <span className="stitch-point" />
              <span className="stitch-point" />
            </div>

            {/* Main Open Spread Grid: TOC / Page Index on Left, Inscribed Page on Right */}
            <div className="notebook-spread-grid">
              {/* =========================================================
                  Left Page: Case Directory & Investigation Index
                  ========================================================= */}
              <aside className="notebook-page notebook-left-page" aria-label="Bug Case Directory">
                <div className="page-header-band">
                  <div className="page-badge-row">
                    <span className="page-serial">VOL. 01 · CASE INDEX</span>
                    <span className="page-counter-badge">
                      {filteredCases.length} Inscribed
                    </span>
                  </div>
                  <h3 className="page-main-heading">Elimination Roster</h3>
                </div>

                {/* Search Bar */}
                <div className="notebook-search-box">
                  <Search size={14} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by symptom, stack, or fix..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="notebook-search-input"
                    aria-label="Filter case files"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="search-clear-btn"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="notebook-category-tabs" role="tablist">
                  {bugCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      role="tab"
                      aria-selected={activeCategory === cat.id}
                      className={`notebook-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Case Directory List */}
                <div className="notebook-case-roster">
                  {filteredCases.length === 0 ? (
                    <div className="notebook-empty-search">
                      <Bug size={24} className="empty-icon" />
                      <p>No bugs matching “{searchQuery}”.</p>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          setSearchQuery('');
                          setActiveCategory('all');
                        }}
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    filteredCases.map((item) => {
                      const isItemActive = item.id === activeCase.id;
                      const isItemStamped = stampedMap[item.id] ?? true;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          className={`roster-item-btn ${isItemActive ? 'roster-item-active' : ''}`}
                          onClick={() => setSelectedCaseId(item.id)}
                        >
                          <div className="roster-item-top">
                            <span className="roster-case-num">{item.caseNumber}</span>
                            <span
                              className={`roster-stamp-tag ${isItemStamped ? 'stamp-eliminated' : 'stamp-pending'}`}
                            >
                              {isItemStamped ? 'ELIMINATED' : 'OPEN INCIDENT'}
                            </span>
                          </div>

                          <div className={`roster-item-title ${isItemStamped ? 'roster-title-striked' : ''}`}>
                            {item.title}
                          </div>

                          <div className="roster-item-meta">
                            <span className="roster-subsystem">{item.subsystem}</span>
                            <span className="roster-date">{item.dateEliminated}</span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Quick Navigation Footer */}
                <div className="notebook-left-footer">
                  <div className="roster-nav-actions">
                    <button
                      type="button"
                      className="nav-page-btn"
                      onClick={handlePrevCase}
                      disabled={filteredCases.length <= 1}
                      aria-label="Previous case"
                    >
                      <ChevronLeft size={14} />
                      <span>Prev</span>
                    </button>
                    <span className="roster-page-indicator">
                      {currentIndex >= 0 ? currentIndex + 1 : 1} of {filteredCases.length || 1}
                    </span>
                    <button
                      type="button"
                      className="nav-page-btn"
                      onClick={handleNextCase}
                      disabled={filteredCases.length <= 1}
                      aria-label="Next case"
                    >
                      <span>Next</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </aside>

              {/* =========================================================
                  Right Page: Inscribed Case File & Resolution Dossier
                  ========================================================= */}
              <main className="notebook-page notebook-right-page" aria-label="Inscribed Case Dossier">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCase.id}
                    className="case-dossier-content"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    {/* Header Strip */}
                    <div className="case-header-strip">
                      <div className="case-serial-block">
                        <span className="case-file-no">{activeCase.caseNumber}</span>
                        <span className="case-dot">•</span>
                        <span className="case-project-name">{activeCase.project}</span>
                        <span className="case-dot">•</span>
                        <span className="case-timestamp">{activeCase.dateEliminated}</span>
                      </div>

                      <div className="case-badges-block">
                        <span
                          className={`severity-pill severity-${activeCase.severity.toLowerCase()}`}
                        >
                          <ShieldAlert size={12} />
                          {activeCase.severity} SEVERITY
                        </span>
                      </div>
                    </div>

                    {/* Case Main Title & Stamped Verdict */}
                    <div className="case-headline-section">
                      <div className="headline-meta-row">
                        <span className="case-alias-tag">// Alias: {activeCase.alias}</span>
                        <span className="case-subsystem-tag">Subsystem: {activeCase.subsystem}</span>
                      </div>

                      <div className="headline-title-wrap">
                        <h2 className={`case-headline-title ${isStamped ? 'title-struck' : ''}`}>
                          {activeCase.title}
                        </h2>

                        {/* Stamped Badge */}
                        <div
                          className={`case-elimination-stamp ${isStamped ? 'stamp-visible' : 'stamp-hidden'}`}
                          title="This defect has been purged from production forever"
                        >
                          <div className="stamp-inner">
                            <span className="stamp-border">
                              <span className="stamp-text">ELIMINATED</span>
                              <span className="stamp-date">{activeCase.dateEliminated}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="case-story-lead">{activeCase.storySummary}</p>

                      {/* Interactive Stamp & Strike Action */}
                      <div className="stamp-control-bar">
                        <button
                          type="button"
                          className={`btn-stamp-trigger ${isStamped ? 'btn-stamp-active' : ''}`}
                          onClick={() => handleToggleStamp(activeCase.id)}
                          aria-label="Toggle bug elimination strike"
                        >
                          <CheckCircle2 size={15} />
                          <span>
                            {isStamped
                              ? 'Bug Struck from Production (Eliminated)'
                              : 'Stamp and Eliminate Bug'}
                          </span>
                        </button>
                        <span className="stamp-status-hint">
                          {isStamped
                            ? 'Root cause inscribed. Regression rate: 0.00%.'
                            : 'Click to inscribe resolution into the death note.'}
                        </span>
                      </div>
                    </div>

                    {/* Case Dossier Sections */}
                    <div className="case-body-sections">
                      {/* 1. The Incident (Crime Scene) */}
                      <div className="case-section-card incident-card">
                        <div className="card-section-label">
                          <span className="label-icon label-danger">🩸</span>
                          <h4>The Incident (What Broke in the Field)</h4>
                        </div>
                        <p className="section-narrative">{activeCase.incident}</p>
                      </div>

                      {/* 2. The Culprit (Root Cause) */}
                      <div className="case-section-card culprit-card">
                        <div className="card-section-label">
                          <span className="label-icon label-warning">🔍</span>
                          <h4>The Culprit (Root Cause Inscribed)</h4>
                        </div>
                        <p className="section-narrative">{activeCase.culprit}</p>
                      </div>

                      {/* 3. The Verdict & Executed Fix */}
                      <div className="case-section-card verdict-card">
                        <div className="card-section-label">
                          <span className="label-icon label-success">⚡</span>
                          <h4>The Verdict (Architectural Resolution)</h4>
                        </div>
                        <p className="section-narrative">{activeCase.verdict}</p>
                      </div>

                      {/* 4. Code Pattern / Inscription */}
                      <div className="case-code-dossier">
                        <div className="code-dossier-header">
                          <div className="code-header-left">
                            <Terminal size={14} className="text-accent" />
                            <span className="code-title">Inscribed Pattern Fix</span>
                          </div>
                          <button
                            type="button"
                            className="code-copy-btn"
                            onClick={() => handleCopyCode(activeCase.codeSnippet, activeCase.id)}
                            title="Copy code snippet"
                          >
                            {copiedCodeId === activeCase.id ? (
                              <>
                                <Check size={13} className="text-accent" />
                                <span>Inscribed!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={13} />
                                <span>Copy Fix</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="code-dossier-pre">
                          <code>{activeCase.codeSnippet}</code>
                        </pre>
                      </div>

                      {/* 5. The Inscribed Law / Rule */}
                      <div className="case-law-callout">
                        <div className="law-icon-wrap">
                          <Sparkles size={16} className="text-accent" />
                        </div>
                        <div className="law-text-wrap">
                          <span className="law-heading">The Architectural Law Inscribed:</span>
                          <p className="law-quote">“{activeCase.rule}”</p>
                          <span className="law-impact">
                            <strong>Impact:</strong> {activeCase.impact}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Page Navigation */}
                    <div className="case-bottom-nav">
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={handlePrevCase}
                        disabled={filteredCases.length <= 1}
                      >
                        <ChevronLeft size={15} />
                        <span>Previous Case</span>
                      </button>

                      <div className="nav-center-serial">
                        <span>
                          Case {currentIndex + 1} of {filteredCases.length}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={handleNextCase}
                        disabled={filteredCases.length <= 1}
                      >
                        <span>Next Case</span>
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
