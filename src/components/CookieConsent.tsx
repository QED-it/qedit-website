'use client';

import CookieConsent from 'react-cookie-consent';
import Link from 'next/link';

export default function CookieConsentBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      enableDeclineButton
      style={{
        background: '#1e2125',
        fontSize: '16px',
        padding: '16px',
      }}
      buttonStyle={{
        background: '#38b1df',
        color: 'white',
        fontSize: '16px',
        borderRadius: '9999px',
        padding: '8px 32px',
      }}
      declineButtonStyle={{
        background: 'transparent',
        border: '2px solid #38b1df',
        color: '#38b1df',
        fontSize: '16px',
        borderRadius: '9999px',
        padding: '8px 32px',
      }}
      expires={365}
      onAccept={() => {
        // Enable GA
        if (typeof window.gtag !== 'undefined') {
          window.gtag('consent', 'update', {
            'analytics_storage': 'granted'
          });
        }
      }}
      onDecline={() => {
        // Disable GA
        if (typeof window.gtag !== 'undefined') {
          window.gtag('consent', 'update', {
            'analytics_storage': 'denied'
          });
        }
      }}
    >
      This website uses cookies to enhance your browsing experience. 
      By clicking &quot;Accept&quot;, you consent to our use of cookies. See our{' '}
      <Link href="/privacy-policy/" className="text-blue-500 hover:text-blue-700">
        Privacy Policy
      </Link>{' '}
      to learn more.
    </CookieConsent>
  );
} 