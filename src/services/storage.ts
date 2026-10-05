import { Municipality, NotificationItem, TimelineEvent } from '../types';
import { INITIAL_MUNICIPALITIES, INITIAL_NOTIFICATIONS, INITIAL_TIMELINE_EVENTS } from '../data/mockData';

const STORAGE_KEYS = {
  MUNICIPALITIES: 'harpia_tech_municipalities',
  NOTIFICATIONS: 'harpia_tech_notifications',
  TIMELINE: 'harpia_tech_timeline',
  SAVED_FILTERS: 'harpia_tech_saved_filters',
};

export const getStoredMunicipalities = (): Municipality[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MUNICIPALITIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MUNICIPALITIES, JSON.stringify(INITIAL_MUNICIPALITIES));
      return INITIAL_MUNICIPALITIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading municipalities from localStorage', e);
    return INITIAL_MUNICIPALITIES;
  }
};

export const saveStoredMunicipalities = (data: Municipality[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.MUNICIPALITIES, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving municipalities to localStorage', e);
  }
};

export const toggleMunicipalityMonitoring = (id: string): Municipality[] => {
  const current = getStoredMunicipalities();
  const updated = current.map((m) => {
    if (m.id === id) {
      return { ...m, isMonitored: !m.isMonitored };
    }
    return m;
  });
  saveStoredMunicipalities(updated);
  return updated;
};

export const updateMunicipalityPipelineStage = (id: string, stage: Municipality['pipelineStage']): Municipality[] => {
  const current = getStoredMunicipalities();
  const updated = current.map((m) => {
    if (m.id === id) {
      return { ...m, pipelineStage: stage };
    }
    return m;
  });
  saveStoredMunicipalities(updated);
  return updated;
};

export const getStoredNotifications = (): NotificationItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_NOTIFICATIONS;
  }
};

export const markNotificationAsRead = (id: string): NotificationItem[] => {
  const current = getStoredNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, lida: true } : n));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  return updated;
};

export const markAllNotificationsAsRead = (): NotificationItem[] => {
  const current = getStoredNotifications();
  const updated = current.map((n) => ({ ...n, lida: true }));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  return updated;
};

export const getStoredTimeline = (): TimelineEvent[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TIMELINE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(INITIAL_TIMELINE_EVENTS));
      return INITIAL_TIMELINE_EVENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_TIMELINE_EVENTS;
  }
};

export const resetAllDemoData = (): void => {
  localStorage.setItem(STORAGE_KEYS.MUNICIPALITIES, JSON.stringify(INITIAL_MUNICIPALITIES));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(INITIAL_TIMELINE_EVENTS));
};
