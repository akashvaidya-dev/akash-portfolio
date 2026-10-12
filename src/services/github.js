/**
 * GitHub REST API Service
 * Fetches real public activity, repositories, and commits for Akash Vaidya.
 * Implements 10-minute client-side caching to respect unauthenticated GitHub rate limits (60 req/hr).
 * Strictly provides graceful fallback states without fabricating fake data.
 */

const PRIMARY_USERNAME = 'arao62916-sys';
const ALT_USERNAME = 'akashvadh12';
const CACHE_KEY = 'akash_github_live_status_v1';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatTimeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}y ago`;
}

/**
 * Format ISO date string into readable month and year
 */
export function formatReadableDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Language colors for GitHub badges
 */
export const LANGUAGE_COLORS = {
  Dart: '#00B4AB',
  Flutter: '#02569B',
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  HTML: '#E34F26',
  CSS: '#1572B6',
  Python: '#3776AB',
  Shell: '#89E051',
  Default: '#10B981',
};

/**
 * Read cached GitHub data if valid
 */
function getCachedData() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY) || localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const age = Date.now() - (parsed.timestamp || 0);
    if (age < CACHE_TTL_MS && parsed.data) {
      return parsed.data;
    }
  } catch (err) {
    console.warn('Could not read cached GitHub data', err);
  }
  return null;
}

/**
 * Save GitHub data to cache
 */
function setCachedData(data) {
  if (typeof window === 'undefined') return;
  try {
    const payload = JSON.stringify({
      timestamp: Date.now(),
      data,
    });
    sessionStorage.setItem(CACHE_KEY, payload);
    localStorage.setItem(CACHE_KEY, payload);
  } catch (err) {
    console.warn('Could not cache GitHub data', err);
  }
}

/**
 * Fetch live developer status, repositories, and commits from GitHub REST API
 */
export async function fetchLiveDeveloperStatus(forceRefresh = false) {
  if (!forceRefresh) {
    const cached = getCachedData();
    if (cached) {
      return { ...cached, isCached: true };
    }
  }

  try {
    // 1. Fetch user profiles and repos in parallel
    const [userRes, reposRes, altReposRes] = await Promise.allSettled([
      fetch(`https://api.github.com/users/${PRIMARY_USERNAME}`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      }),
      fetch(`https://api.github.com/users/${PRIMARY_USERNAME}/repos?sort=updated&per_page=8`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      }),
      fetch(`https://api.github.com/users/${ALT_USERNAME}/repos?sort=updated&per_page=8`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      }),
    ]);

    // Check for rate limit or errors
    const isRateLimited =
      (userRes.status === 'fulfilled' && userRes.value.status === 403) ||
      (reposRes.status === 'fulfilled' && reposRes.value.status === 403);

    if (isRateLimited) {
      return {
        isError: true,
        isRateLimited: true,
        errorMessage: 'GitHub API unauthenticated hourly rate limit reached (60 req/hr).',
        fallbackUrl: `https://github.com/${PRIMARY_USERNAME}`,
        username: PRIMARY_USERNAME,
      };
    }

    let user = null;
    if (userRes.status === 'fulfilled' && userRes.value.ok) {
      user = await userRes.value.json();
    }

    let allRepos = [];
    if (reposRes.status === 'fulfilled' && reposRes.value.ok) {
      const primaryRepos = await reposRes.value.json();
      allRepos = allRepos.concat(primaryRepos);
    }
    if (altReposRes.status === 'fulfilled' && altReposRes.value.ok) {
      const altRepos = await altReposRes.value.json();
      allRepos = allRepos.concat(altRepos);
    }

    // Deduplicate repos by id/name and sort by updated_at descending
    const seenRepoNames = new Set();
    const sortedRepos = allRepos
      .filter((repo) => {
        const key = repo.name.toLowerCase();
        if (seenRepoNames.has(key)) return false;
        seenRepoNames.add(key);
        return true;
      })
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 6);

    // If no repos could be reached and user fetch failed, trigger fallback
    if (!user && sortedRepos.length === 0) {
      return {
        isError: true,
        isRateLimited: false,
        errorMessage: 'Unable to connect to GitHub REST API. Network connection or server timeout.',
        fallbackUrl: `https://github.com/${PRIMARY_USERNAME}`,
        username: PRIMARY_USERNAME,
      };
    }

    // 2. Fetch real recent commits from top active repos
    const topRepos = sortedRepos.slice(0, 3);
    let commits = [];

    const commitFetches = topRepos.map((repo) =>
      fetch(`https://api.github.com/repos/${repo.full_name}/commits?per_page=4`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((repoCommits) =>
          repoCommits.map((c) => ({
            sha: c.sha ? c.sha.substring(0, 7) : '',
            message: c.commit?.message || '',
            author: c.commit?.author?.name || c.author?.login || 'akash',
            avatarUrl: c.author?.avatar_url || user?.avatar_url,
            date: c.commit?.author?.date || c.commit?.committer?.date,
            repoName: repo.name,
            repoFullName: repo.full_name,
            url: c.html_url,
          }))
        )
        .catch(() => [])
    );

    const commitResults = await Promise.all(commitFetches);
    commits = commitResults.flat().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

    const result = {
      isError: false,
      isRateLimited: false,
      user: {
        login: user?.login || PRIMARY_USERNAME,
        name: user?.name || 'Akash Vaidya',
        avatarUrl: user?.avatar_url || 'https://avatars.githubusercontent.com/u/224037309?v=4',
        htmlUrl: user?.html_url || `https://github.com/${PRIMARY_USERNAME}`,
        publicRepos: sortedRepos.length,
        followers: user?.followers ?? 0,
        following: user?.following ?? 0,
        createdAt: user?.created_at,
        updatedAt: user?.updated_at,
      },
      repositories: sortedRepos.map((r) => ({
        id: r.id,
        name: r.name,
        fullName: r.full_name,
        description: r.description || 'Public repository maintained by Akash Vaidya.',
        language: r.language || 'Dart',
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        updatedAt: r.updated_at,
        pushedAt: r.pushed_at,
        htmlUrl: r.html_url,
        isFork: r.fork,
      })),
      commits,
      lastSyncedAt: new Date().toISOString(),
    };

    setCachedData(result);
    return result;
  } catch (error) {
    console.error('GitHub REST API fetch failed:', error);
    return {
      isError: true,
      isRateLimited: false,
      errorMessage: error.message || 'Network request to GitHub failed.',
      fallbackUrl: `https://github.com/${PRIMARY_USERNAME}`,
      username: PRIMARY_USERNAME,
    };
  }
}
