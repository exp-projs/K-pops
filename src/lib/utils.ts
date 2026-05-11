/** Utility to conditionally join class names */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Format a number with commas (e.g., 1000 → 1,000) */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/** Compact number format (e.g., 42500000 → 42.5M) */
export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
}

/** Format a date string to readable format */
export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-US', options || defaultOptions);
}

/** Get relative time (e.g., "2 hours ago") */
export function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  const intervals = [
    { label: 'y', seconds: 31536000 }, { label: 'mo', seconds: 2592000 },
    { label: 'd', seconds: 86400 }, { label: 'h', seconds: 3600 },
    { label: 'm', seconds: 60 },
  ];
  for (const { label, seconds: s } of intervals) {
    const count = Math.floor(seconds / s);
    if (count >= 1) return `${count}${label} ago`;
  }
  return 'just now';
}

/** Convert minutes to hours/minutes string */
export function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/** Generate a drama slug from title */
export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/** TMDB image URL builder */
export function tmdbImage(path: string | null, size: string = 'w500'): string {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

/** Get a poster gradient fallback color based on index */
export function getPosterGradient(index: number): string {
  const gradients = [
    'linear-gradient(135deg, #1a0a2e, #2d1b4e)', 'linear-gradient(135deg, #0a1628, #1a2940)',
    'linear-gradient(135deg, #2a0a1e, #3d1b2e)', 'linear-gradient(135deg, #0a2818, #1b3d28)',
    'linear-gradient(135deg, #28200a, #3d321b)',
  ];
  return gradients[index % gradients.length];
}

/** Debounce a function */
export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
