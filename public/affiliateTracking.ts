import { UAParser } from "ua-parser-js";

(function () {
  const TRACKING_ENDPOINT =
    "https://affiliate-marketing-ten.vercel.app/api/track";
  const ORGID_ENDPOINT = "https://affiliate-marketing-ten.vercel.app/api/org";
  const REF_KEYS = ["ref", "aff", "via"];

  function convertToSeconds(value: number, unit: string): number {
    const unitToSeconds: Record<string, number> = {
      second: 1,
      minute: 60,
      hour: 3600,
      day: 86400,
      week: 604800,
      month: 2592000,
      year: 31536000,
    };
    return value * (unitToSeconds[unit.toLowerCase()] || 86400);
  }

  async function storeRefCode(code: string) {
    try {
      const res = await fetch(
        `${ORGID_ENDPOINT}/?code=${encodeURIComponent(code)}`,
      );
      if (!res.ok) throw new Error("Failed to fetch organization info");
      const {
        cookieLifetimeValue,
        cookieLifetimeUnit,
        commissionType,
        commissionValue,
        commissionDurationValue,
        commissionDurationUnit,
      } = await res.json();

      const maxAge = convertToSeconds(cookieLifetimeValue, cookieLifetimeUnit);

      const affiliateData = {
        code,
        commissionType,
        commissionValue,
        commissionDurationValue,
        commissionDurationUnit,
      };

      document.cookie = `refearnapp_affiliate_cookie=${encodeURIComponent(
        JSON.stringify(affiliateData),
      )}; path=/; max-age=${maxAge}`;
    } catch (err) {
      console.error("Failed to set affiliate cookie:", err);
    }
  }

  function getReferralCode(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    for (const key of REF_KEYS) {
      if (urlParams.has(key)) return urlParams.get(key);
    }
    return null;
  }
  function getCookie(name: string) {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="));
  }

  function setTempClickCookie() {
    document.cookie = `refearnapp_affiliate_click_tracked=true; max-age=86400; path=/`; // 5 minutes
  }
  function getDeviceInfo() {
    const parser = new UAParser();
    const result = parser.getResult();
    return {
      browser: result.browser.name,
      os: result.os.name,
      deviceType: result.device.type || "desktop",
    };
  }

  function sendTrackingData(data: any) {
    const payload = JSON.stringify(data);
    const sent = navigator.sendBeacon(TRACKING_ENDPOINT, payload);
    if (!sent) {
      fetch(TRACKING_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }

  // 🔥 Only this is needed — track on landing
  const refCode = getReferralCode();
  if (refCode && !getCookie("click_tracked")) {
    storeRefCode(refCode)
      .then(() => {
        sendTrackingData({
          ref: refCode,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          url: window.location.href,
          ...getDeviceInfo(),
        });
        setTempClickCookie();
      })
      .catch((err) => {
        console.error("Failed to process affiliate tracking:", err);
      });
  }
})();
