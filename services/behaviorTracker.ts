
/**
 * Simple cookie management for user behavior tracking.
 */
export const behaviorTracker = {
  setCookie: (name: string, value: string, days: number = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  },

  getCookie: (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  trackPageVisit: (path: string) => {
    if (path.includes('/solutions/hosting')) {
      behaviorTracker.setCookie('zabah_interest', 'hosting');
    } else if (path.includes('/domains') || path.includes('/solutions/official')) {
      behaviorTracker.setCookie('zabah_interest', 'domains');
    } else if (path.includes('/solutions/web')) {
      behaviorTracker.setCookie('zabah_interest', 'web');
    } else if (path.includes('/blog')) {
      behaviorTracker.setCookie('zabah_interest', 'blog');
    }
  },

  getUserInterest: () => {
    return behaviorTracker.getCookie('zabah_interest');
  }
};
