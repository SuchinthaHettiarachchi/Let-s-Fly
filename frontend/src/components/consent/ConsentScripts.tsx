"use client";

import Script from "next/script";
import { useConsent } from "./ConsentProvider";

/** Set these in .env.local (and on the host) to switch the trackers on. Unset means nothing loads. */
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Loads Google Analytics and the Meta Pixel only after the visitor allows them.
 * Google Consent Mode starts at "denied" and is updated from the stored choice.
 */
export function ConsentScripts() {
  const { consent } = useConsent();
  if (!consent) return null;

  const ads = consent.marketing ? "granted" : "denied";

  return (
    <>
      {GA_ID && consent.analytics && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="lf-gtag" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  analytics_storage: 'granted',
  ad_storage: '${ads}',
  ad_user_data: '${ads}',
  ad_personalization: '${ads}'
});
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true });`}
          </Script>
        </>
      )}

      {META_PIXEL_ID && consent.marketing && (
        <Script id="lf-meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
      )}
    </>
  );
}
