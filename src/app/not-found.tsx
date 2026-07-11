// Work around for Github pages that don't have nice build-in 301 redirects
// to redirect URLs with trailingSlashes to URLs without.
//
// For proper infra we'd need to migrate the website deployment to Cloudflare
// and use a worker to handle the redirect.
export default function NotFound() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              var p = location.pathname;
              if (p.length > 1 && p.endsWith('/')) {
                location.replace(p.replace(/\\/+$/, '') + location.search + location.hash);
              }
            })();
          `,
        }}
      />
      {/* 404 page UI */}
    </>
  );
}