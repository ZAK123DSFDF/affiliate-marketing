// app/api/check/route.ts
export const runtime = "edge"

export function GET() {
  return new Response(
    `
    (function() {
      try {
        // 1. Get values from URL first
        const params = new URLSearchParams(window.location.search);
        let affiliateId = params.get('aff_id');
        let campaign = params.get('utm_campaign');
        
        // 2. Fallback to localStorage if URL params missing
        if (!affiliateId) {
          affiliateId = localStorage.getItem('aff_id');
          campaign = localStorage.getItem('utm_campaign');
        }
        // 3. If we found values, store them
        else {
          localStorage.setItem('aff_id', affiliateId);
          if (campaign) localStorage.setItem('utm_campaign', campaign);
        }
        
        // 4. Initialize bridge with proper typing
        window.AffiliateBridge = {
          setStorage: function(key, value) {
            try {
              localStorage.setItem(key, JSON.stringify(value));
              return true;
            } catch (e) {
              console.error('Storage error:', e);
              return false;
            }
          },
          getStorage: function(key) {
            try {
              const item = localStorage.getItem(key);
              return item ? JSON.parse(item) : null;
            } catch (e) {
              console.error('Storage error:', e);
              return null;
            }
          },
          affiliateData: {
            id: affiliateId || '',
            campaign: campaign || ''
          }
        };
        
        // 5. Send to server (works with both URL and localStorage values)
        if (affiliateId) {
          const trackingData = {
            affiliateId: affiliateId,
            campaign: campaign,
            source: params.has('aff_id') ? 'url' : 'localStorage',
            url: window.location.href,
            timestamp: Date.now()
          };
          
          navigator.sendBeacon('http://localhost:3000/api/log-affiliate', JSON.stringify(trackingData));
        }
      } catch (error) {
        console.error('Affiliate tracking failed:', error);
      }
    })();
    `,
    {
      headers: {
        "Content-Type": "application/javascript",
        "Access-Control-Allow-Origin": "*",
      },
    }
  )
}
