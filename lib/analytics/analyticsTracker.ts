/**
 * Analytics tracking functions for Phase 2 integration.
 * MVP uses mock data; these stubs prepare the event pipeline.
 */

export function trackFlipbookView(flipbookId: string): void {
  // Phase 2: POST /api/analytics/view { flipbookId }
  console.debug("[analytics] flipbook view", flipbookId);
}

export function trackPageView(flipbookId: string, pageId: string): void {
  // Phase 2: POST /api/analytics/page-view { flipbookId, pageId }
  console.debug("[analytics] page view", flipbookId, pageId);
}

export function trackDownload(flipbookId: string): void {
  // Phase 2: POST /api/analytics/download { flipbookId }
  console.debug("[analytics] download", flipbookId);
}

export function trackShare(flipbookId: string, platform?: string): void {
  // Phase 2: POST /api/analytics/share { flipbookId, platform }
  console.debug("[analytics] share", flipbookId, platform);
}

export function trackHotspotClick(flipbookId: string, hotspotId: string): void {
  // Phase 2: POST /api/analytics/hotspot { flipbookId, hotspotId }
  console.debug("[analytics] hotspot click", flipbookId, hotspotId);
}

export function trackReadTime(flipbookId: string, seconds: number): void {
  // Phase 2: POST /api/analytics/read-time { flipbookId, seconds }
  console.debug("[analytics] read time", flipbookId, seconds);
}

export function getMockAnalyticsData(flipbookId: string) {
  return {
    viewsOverTime: [
      { date: "Mon", views: 45 },
      { date: "Tue", views: 62 },
      { date: "Wed", views: 38 },
      { date: "Thu", views: 71 },
      { date: "Fri", views: 89 },
      { date: "Sat", views: 54 },
      { date: "Sun", views: 43 },
    ],
    pageViews: [
      { page: "Page 1", views: 402 },
      { page: "Page 2", views: 356 },
      { page: "Page 3", views: 298 },
      { page: "Page 4", views: 245 },
      { page: "Page 5", views: 189 },
    ],
    devices: [
      { device: "Desktop", percent: 58 },
      { device: "Mobile", percent: 32 },
      { device: "Tablet", percent: 10 },
    ],
    referrers: [
      { source: "Direct", percent: 42 },
      { source: "Social", percent: 28 },
      { source: "Email", percent: 18 },
      { source: "Embed", percent: 12 },
    ],
    flipbookId,
  };
}
