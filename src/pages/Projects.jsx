import { useState, useMemo } from 'react';
import { Search, Layers, AlertCircle, RefreshCw } from 'lucide-react';
import { projects } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import SectionTitle from '../components/SectionTitle';

const categories = [
  { id: 'all', label: 'All Projects' },
  { id: 'mobile', label: 'Mobile (Flutter)' },
  { id: 'web', label: 'Web & Fullstack' },
];

/**
 * Projects Page Component
 * Filterable projects catalog with interactive search, category filters,
 * and deep-dive case study modal presentations.
 */
function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter projects based on category and search query
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        project.categoryFilter === selectedCategory ||
        (selectedCategory === 'mobile' && project.tags.includes('Flutter')) ||
        (selectedCategory === 'web' && (project.tags.includes('React') || project.tags.includes('Web')));

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
            badge="Engineering Portfolio"
            title="Projects &amp; Case Studies"
            subtitle="Commercial mobile applications, hardware automation systems, and modern web platforms built with Flutter and React."
          />

          {/* Filter & Search Bar */}
          <div className="projects-controls-wrap">
            {/* Category Tabs */}
            <div className="category-tabs" role="tablist" aria-label="Filter projects by category">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === cat.id}
                  className={`category-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="search-input-wrap">
              <Search size={16} className="search-icon" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search by technology, name, keyword..."
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

      {/* Projects Grid Section */}
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
          {filteredProjects.length > 0 ? (
            <div className="projects-grid">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          ) : (
            <div className="empty-state-box">
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
            </div>
          )}

          {/* Client & Proprietary Code Disclosure */}
          <div className="proprietary-note-box">
            <div className="proprietary-icon-wrap">
              <Layers size={20} className="text-accent" />
            </div>
            <div>
              <h4 className="proprietary-title">Note on Commercial &amp; Client Repositories</h4>
              <p className="proprietary-desc">
                Several projects featured above were built under commercial client arrangements and remain proprietary.
                Detailed architectural walkthroughs, sanitized code samples, and live demonstrations are available during
                technical interviews.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Projects;
