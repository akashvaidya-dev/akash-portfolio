import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Layers, AlertCircle, RefreshCw } from 'lucide-react';
import { projects } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import SectionTitle from '../components/SectionTitle';

const categories = [
  { id: 'all', label: 'All', count: projects.length },
  { id: 'mobile', label: 'Flutter', count: projects.filter((p) => p.tags.includes('Flutter')).length },
];

/**
 * Projects Page Component
 * Enhanced filterable projects catalog with animated FLIP grid layouts,
 * category counts, search highlighting, and deep-dive case studies.
 */
function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter projects based on category and search query
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'mobile' && project.tags.includes('Flutter'));

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tags.some((t) => t.toLowerCase().includes(query)) ||
        project.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="page-wrapper projects-page">
      {/* Page Header */}
      <section className="page-header-section">
        <div className="container">
          <SectionTitle
            badge="Google Play"
            title="Published Apps"
            subtitle="Flutter apps live on the Play Store — swipe screenshots, open the listing."
          />

          {/* Filter & Search Bar */}
          <div className="projects-controls-wrap">
            {/* Category Tabs with Animated Spring Highlight */}
            <div className="category-tabs" role="tablist" aria-label="Filter projects by category">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`category-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <span>{cat.label}</span>
                    <span className="tab-count-badge">{cat.count}</span>
                    {isActive && (
                      <motion.span
                        layoutId="active-category-pill"
                        className="tab-active-pill"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="search-input-wrap">
              <Search size={16} className="search-icon" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search by tech, hardware, keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search projects by keyword"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid Section with Animated Layout */}
      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="container">
          {/* Active Results Summary */}
          <div className="results-summary-bar">
            <span>
              Showing <strong>{filteredProjects.length}</strong> of <strong>{projects.length}</strong> projects
            </span>
            {searchQuery && (
              <span className="search-active-pill">
                Matching "{searchQuery}"
              </span>
            )}
          </div>

          {/* Grid or Empty State */}
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              <motion.div layout className="projects-grid">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    layout
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProjectCard project={project} index={index} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="empty-state-box"
              >
                <AlertCircle size={36} className="text-muted" style={{ marginBottom: 12 }} />
                <h3>No matching projects found</h3>
                <p>Try adjusting your search query or selecting a different category filter.</p>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: 16 }}
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                >
                  <RefreshCw size={14} style={{ marginRight: 6 }} />
                  Reset Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Client & Proprietary Code Disclosure */}
          <div className="proprietary-note-box">
            <div className="proprietary-icon-wrap">
              <Layers size={20} className="text-accent" />
            </div>
            <div>
              <h4 className="proprietary-title">About office / client work</h4>
              <p className="proprietary-desc">
                I have built more Flutter apps at work, but those repos stay private. Happy to walk through
                sanitized examples or live demos in an interview — just ask.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Projects;
