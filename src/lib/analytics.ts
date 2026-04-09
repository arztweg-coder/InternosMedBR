interface UserAnalytics {
  userId: string;
  monthlyAccess: Record<string, number>;
  mostUsedTabs: Record<string, number>;
}

export function trackMonthlyAccess(userId: string): void {
  const yearMonth = new Date().toISOString().slice(0, 7);
  const analytics = getAnalytics(userId);
  analytics.monthlyAccess[yearMonth] = (analytics.monthlyAccess[yearMonth] || 0) + 1;
  saveAnalytics(userId, analytics);
}

export function trackTabUsage(userId: string, tabName: string): void {
  const analytics = getAnalytics(userId);
  analytics.mostUsedTabs[tabName] = (analytics.mostUsedTabs[tabName] || 0) + 1;
  saveAnalytics(userId, analytics);
}

function getAnalytics(userId: string): UserAnalytics {
  const key = `internosmed_analytics_${userId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : { userId, monthlyAccess: {}, mostUsedTabs: {} };
}

function saveAnalytics(userId: string, analytics: UserAnalytics): void {
  localStorage.setItem(`internosmed_analytics_${userId}`, JSON.stringify(analytics));
}

export function clearAnalytics(userId: string): void {
  localStorage.removeItem(`internosmed_analytics_${userId}`);
}
