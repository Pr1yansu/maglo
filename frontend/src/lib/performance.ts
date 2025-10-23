import { useEffect } from 'react'

interface PerformanceMetrics {
  FCP?: number // First Contentful Paint
  LCP?: number // Largest Contentful Paint
  FID?: number // First Input Delay
  CLS?: number // Cumulative Layout Shift
  TTFB?: number // Time to First Byte
}

export function usePerformanceMetrics() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return

    const metrics: PerformanceMetrics = {}

    // Measure Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'navigation':
            const navEntry = entry as PerformanceNavigationTiming
            metrics.TTFB = navEntry.responseStart - navEntry.requestStart
            break
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              metrics.FCP = entry.startTime
            }
            break
          case 'largest-contentful-paint':
            metrics.LCP = entry.startTime
            break
          case 'first-input':
            const firstInput = entry as PerformanceEventTiming
            metrics.FID = firstInput.processingStart - firstInput.startTime
            break
          case 'layout-shift':
            const layoutShift = entry as any
            if (!layoutShift.hadRecentInput) {
              metrics.CLS = (metrics.CLS || 0) + layoutShift.value
            }
            break
        }
      }

      // Send metrics to analytics (implement your preferred analytics service)
      console.log('Performance Metrics:', metrics)

      // Example: Send to Google Analytics 4
      // gtag('event', 'web_vitals', {
      //   metric_name: entry.name,
      //   metric_value: entry.value,
      //   metric_id: entry.id,
      // })
    })

    // Observe different performance entry types
    try {
      observer.observe({
        entryTypes: [
          'navigation',
          'paint',
          'largest-contentful-paint',
          'first-input',
          'layout-shift',
        ],
      })
    } catch (e) {
      // Fallback for browsers that don't support all entry types
      observer.observe({ entryTypes: ['navigation', 'paint'] })
    }

    return () => observer.disconnect()
  }, [])
}

// Web Vitals thresholds (Google's recommendations)
export const PERFORMANCE_THRESHOLDS = {
  FCP: { good: 1800, needs_improvement: 3000 }, // ms
  LCP: { good: 2500, needs_improvement: 4000 }, // ms
  FID: { good: 100, needs_improvement: 300 }, // ms
  CLS: { good: 0.1, needs_improvement: 0.25 }, // score
  TTFB: { good: 800, needs_improvement: 1800 }, // ms
}

export function getPerformanceScore(
  metric: keyof PerformanceMetrics,
  value: number
): 'good' | 'needs_improvement' | 'poor' {
  const threshold = PERFORMANCE_THRESHOLDS[metric]
  if (!threshold) return 'good'

  if (value <= threshold.good) return 'good'
  if (value <= threshold.needs_improvement) return 'needs_improvement'
  return 'poor'
}
