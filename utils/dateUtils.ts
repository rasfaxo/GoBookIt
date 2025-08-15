export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
export function isDateInPast(date: Date | string): boolean {
  return new Date(date) < new Date();
}
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
