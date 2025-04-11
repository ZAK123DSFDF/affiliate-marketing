// app/api/check/route.ts
export const runtime = "edge";

export function GET() {
  return new Response(
    `
    (function() {
      // 1. Get params from client URL
      const params = new URLSearchParams(window.location.search);
      const affiliateId = params.get('aff_id');
      const campaign = params.get('utm_campaign');
      
      // 2. Send to server for logging
      if (affiliateId || campaign) {
        navigator.sendBeacon('/api/log-affiliate', JSON.stringify({
          affiliateId,
          campaign,
          url: window.location.href,
          timestamp: Date.now()
        }));
      }

      // 3. Initialize bridge
      if (!window.AffiliateBridge) {
        window.AffiliateBridge = {
          setStorage: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
          affiliateData: {
            id: affiliateId || '',
            campaign: campaign || ''
          }
        };
      }
    })();
    `,
    {
      headers: {
        "Content-Type": "application/javascript",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
