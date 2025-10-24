# 📊 Observability Quick Wins

**Purpose**: Add lightweight monitoring for production health and Web Vitals.

---

## 🎯 Quick Wins

### **1. Web Vitals Reporting** 📈

#### **Setup (5 minutes)**

```bash
# Install web-vitals package
cd apps/frontend
pnpm add web-vitals

# Create Web Vitals reporter
cat > src/lib/webVitals.ts << 'EOF'
import { onCLS, onFID, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

function sendToAnalytics(metric: WebVitalsMetric) {
  // Send to your analytics service
  // Examples: Google Analytics, Datadog, New Relic, Sentry
  
  if (import.meta.env.PROD) {
    // Example: Google Analytics
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', metric.name, {
        value: Math.round(metric.value),
        metric_rating: metric.rating,
        metric_delta: Math.round(metric.delta),
        metric_id: metric.id,
      });
    }
    
    // Example: Console log for debugging
    console.log('[Web Vitals]', metric);
  }
}

function getRating(value: number, thresholds: [number, number]): 'good' | 'needs-improvement' | 'poor' {
  if (value <= thresholds[0]) return 'good';
  if (value <= thresholds[1]) return 'needs-improvement';
  return 'poor';
}

export function reportWebVitals() {
  // Largest Contentful Paint (LCP)
  // Good: ≤2.5s, Needs Improvement: ≤4s, Poor: >4s
  onLCP((metric: Metric) => {
    sendToAnalytics({
      name: 'LCP',
      value: metric.value,
      rating: getRating(metric.value, [2500, 4000]),
      delta: metric.delta,
      id: metric.id,
    });
  });

  // First Input Delay (FID)
  // Good: ≤100ms, Needs Improvement: ≤300ms, Poor: >300ms
  onFID((metric: Metric) => {
    sendToAnalytics({
      name: 'FID',
      value: metric.value,
      rating: getRating(metric.value, [100, 300]),
      delta: metric.delta,
      id: metric.id,
    });
  });

  // Cumulative Layout Shift (CLS)
  // Good: ≤0.1, Needs Improvement: ≤0.25, Poor: >0.25
  onCLS((metric: Metric) => {
    sendToAnalytics({
      name: 'CLS',
      value: metric.value,
      rating: getRating(metric.value, [0.1, 0.25]),
      delta: metric.delta,
      id: metric.id,
    });
  });

  // First Contentful Paint (FCP)
  // Good: ≤1.8s, Needs Improvement: ≤3s, Poor: >3s
  onFCP((metric: Metric) => {
    sendToAnalytics({
      name: 'FCP',
      value: metric.value,
      rating: getRating(metric.value, [1800, 3000]),
      delta: metric.delta,
      id: metric.id,
    });
  });

  // Time to First Byte (TTFB)
  // Good: ≤800ms, Needs Improvement: ≤1800ms, Poor: >1800ms
  onTTFB((metric: Metric) => {
    sendToAnalytics({
      name: 'TTFB',
      value: metric.value,
      rating: getRating(metric.value, [800, 1800]),
      delta: metric.delta,
      id: metric.id,
    });
  });
}
EOF

# Update main entry point
cat >> src/main.tsx << 'EOF'

// Report Web Vitals in production
if (import.meta.env.PROD) {
  import('./lib/webVitals').then(({ reportWebVitals }) => {
    reportWebVitals();
  });
}
EOF

git add src/lib/webVitals.ts src/main.tsx package.json pnpm-lock.yaml
git commit -m "feat(observability): add Web Vitals reporting"
git push origin main
```

**Result**: ✅ Web Vitals (LCP, FID, CLS, FCP, TTFB) reporting enabled

---

### **2. Release Health Dashboard** 📊

#### **Dashboard Spec (Ready for Ops)**

```yaml
# Release Health Dashboard Specification
# Hand this to your ops team or use with Grafana/Datadog/New Relic

dashboard:
  name: "Traffic CRM - Release Health"
  refresh: 30s
  time_range: last_24h

panels:
  - title: "Error Rate"
    type: timeseries
    query: |
      sum(rate(http_requests_total{status=~"5.."}[5m])) 
      / 
      sum(rate(http_requests_total[5m])) * 100
    thresholds:
      - value: 1
        color: yellow
        label: "Warning"
      - value: 5
        color: red
        label: "Critical"
    unit: "%"
    
  - title: "P95 Latency"
    type: timeseries
    query: |
      histogram_quantile(0.95, 
        sum(rate(http_request_duration_seconds_bucket[5m])) by (le)
      )
    thresholds:
      - value: 1
        color: yellow
        label: "Slow"
      - value: 3
        color: red
        label: "Critical"
    unit: "s"
    
  - title: "Requests per Minute"
    type: timeseries
    query: |
      sum(rate(http_requests_total[1m])) * 60
    unit: "req/min"
    
  - title: "Build Failures (Last 7 Days)"
    type: stat
    query: |
      count(github_workflow_runs{status="failure", workflow="CI"})
    thresholds:
      - value: 0
        color: green
      - value: 1
        color: yellow
      - value: 5
        color: red
        
  - title: "Workflow Failures (Last 7 Days)"
    type: stat
    query: |
      count(github_workflow_runs{status="failure"})
    thresholds:
      - value: 0
        color: green
      - value: 1
        color: yellow
      - value: 10
        color: red
        
  - title: "Web Vitals - LCP"
    type: gauge
    query: |
      avg(web_vitals_lcp_seconds)
    thresholds:
      - value: 2.5
        color: green
        label: "Good"
      - value: 4.0
        color: yellow
        label: "Needs Improvement"
      - value: 4.1
        color: red
        label: "Poor"
    unit: "s"
    
  - title: "Web Vitals - FID"
    type: gauge
    query: |
      avg(web_vitals_fid_milliseconds)
    thresholds:
      - value: 100
        color: green
        label: "Good"
      - value: 300
        color: yellow
        label: "Needs Improvement"
      - value: 301
        color: red
        label: "Poor"
    unit: "ms"
    
  - title: "Web Vitals - CLS"
    type: gauge
    query: |
      avg(web_vitals_cls_score)
    thresholds:
      - value: 0.1
        color: green
        label: "Good"
      - value: 0.25
        color: yellow
        label: "Needs Improvement"
      - value: 0.26
        color: red
        label: "Poor"
    unit: "score"

alerts:
  - name: "High Error Rate"
    condition: error_rate > 5%
    duration: 5m
    severity: critical
    notify: ["#engineering", "on-call"]
    
  - name: "Slow P95 Latency"
    condition: p95_latency > 3s
    duration: 10m
    severity: warning
    notify: ["#engineering"]
    
  - name: "Build Failures"
    condition: build_failures > 3
    duration: 1h
    severity: warning
    notify: ["#engineering"]
```

**Implementation Options**:

1. **Grafana** (Recommended)
   ```bash
   # Import dashboard JSON (generated from spec)
   # Settings → Data Sources → Add Prometheus/Loki
   # Dashboards → Import → Paste JSON
   ```

2. **Datadog**
   ```bash
   # Use Datadog Dashboard API
   # Create dashboard from spec
   ```

3. **New Relic**
   ```bash
   # Use New Relic Dashboards
   # Import custom dashboard
   ```

**Result**: ✅ Release health dashboard spec ready for ops

---

### **3. Lightweight Error Tracking** 🐛

#### **Setup Sentry (5 minutes)**

```bash
# Install Sentry
cd apps/frontend
pnpm add @sentry/react @sentry/vite-plugin

# Create Sentry config
cat > src/lib/sentry.ts << 'EOF'
import * as Sentry from '@sentry/react';

export function initSentry() {
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION || 'unknown',
      
      // Performance Monitoring
      tracesSampleRate: 0.1, // 10% of transactions
      
      // Session Replay
      replaysSessionSampleRate: 0.1, // 10% of sessions
      replaysOnErrorSampleRate: 1.0, // 100% of errors
      
      // Integrations
      integrations: [
        new Sentry.BrowserTracing({
          // Set sampling rate for navigation transactions
          tracePropagationTargets: ['localhost', /^https:\/\/.*\.example\.com/],
        }),
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      
      // Filter out known errors
      beforeSend(event, hint) {
        // Filter out browser extension errors
        if (event.exception?.values?.[0]?.value?.includes('chrome-extension://')) {
          return null;
        }
        return event;
      },
    });
  }
}
EOF

# Update main entry point
cat > src/main.tsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { initSentry } from './lib/sentry';
import App from './App';

// Initialize Sentry first
initSentry();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Report Web Vitals in production
if (import.meta.env.PROD) {
  import('./lib/webVitals').then(({ reportWebVitals }) => {
    reportWebVitals();
  });
}
EOF

# Add Sentry DSN to .env
echo "VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/your-project-id" >> .env.local

git add src/lib/sentry.ts src/main.tsx package.json pnpm-lock.yaml
git commit -m "feat(observability): add Sentry error tracking"
git push origin main
```

**Result**: ✅ Error tracking with Sentry enabled

---

## ✅ Verification Checklist

- [ ] Web Vitals reporting enabled (LCP, FID, CLS, FCP, TTFB)
- [ ] Release health dashboard spec created
- [ ] Dashboard handed to ops team
- [ ] Error tracking configured (Sentry or alternative)
- [ ] Alerts configured for critical metrics
- [ ] Team notified of new monitoring

---

## 📊 Expected Metrics

### **Web Vitals Targets**
| **Metric** | **Good** | **Needs Improvement** | **Poor** |
|------------|----------|-----------------------|----------|
| **LCP** | ≤2.5s | ≤4s | >4s |
| **FID** | ≤100ms | ≤300ms | >300ms |
| **CLS** | ≤0.1 | ≤0.25 | >0.25 |
| **FCP** | ≤1.8s | ≤3s | >3s |
| **TTFB** | ≤800ms | ≤1.8s | >1.8s |

### **Release Health Targets**
| **Metric** | **Target** | **Warning** | **Critical** |
|------------|------------|-------------|--------------|
| **Error Rate** | <0.1% | <1% | <5% |
| **P95 Latency** | <500ms | <1s | <3s |
| **Build Failures** | 0 | <3/week | <10/week |
| **Workflow Failures** | 0 | <5/week | <20/week |

---

## 📞 Support

- **Engineering Lead**: @omar120489
- **Ops Team**: ops@traffic-crm.example.com
- **Monitoring**: monitoring@traffic-crm.example.com

---

**Status**: ✅ Ready to Execute  
**Time**: ~15 minutes total  
**Impact**: High (production visibility)

