# About, Contact, and Google Search setup

The reporting site links to the main company website, [dsserp.com](https://www.dsserp.com/), and includes About Us and Contact Us pages. Company details are centralized in `web/src/app/site-info.ts`. Public contact details were checked against the main website's current application content on 1 November 2026.

## Search-facing content

The site describes DSS Reporting as a **free reporting tool for ASP.NET Core and Angular**. The library is free to use under its proprietary package license; it is not advertised as open source. Each main guide has a descriptive title, meta description, canonical URL, Open Graph metadata, and structured Organization/SoftwareApplication/page data. No reviews, ratings, or guaranteed ranking claims are invented.

`web/src/app/site-pages.ts` defines route metadata and the eight public pages to pre-render. Interactive sharing preview is marked noindex and excluded from the sitemap. The HTML language is English; the site includes a favicon, a social preview image, robots.txt, and sitemap.xml.

## Build and deploy

From the web directory:

```powershell
npm.cmd run build:production
```

The build compiles the app, generates robots.txt and sitemap.xml, and opens a local headless Chromium browser to save real rendered HTML for Getting Started, Common Settings, Report Builder, the three sharing guides, About Us, and Contact Us. It does not connect to a live messaging service. The homepage also receives static Getting Started content. Angular then boots normally for interactive navigation.

A local Chrome/Chromium/Edge executable is required for this step. If automatic discovery fails, set `DSS_PRERENDER_BROWSER` to its executable path. Node 24 is used by these scripts.

For the engine source checkout, deploy **all contents** of `web/dist/dss-report-ui/browser`, including the route directories. The public sample app uses `web/dist/samples/browser`. Edit aa.config.json for your deployed API. Serve the pre-rendered index.html inside public route folders and retain Angular fallback to root index.html for application routes. Do not block JavaScript, CSS, or screenshot assets from crawlers.

The reporting origin is `https://rdlreports.dsserp.in`; company links use `https://www.dsserp.com/`. If the reporting hostname changes, update site-info.ts and the base metadata in src/index.html, then rebuild before deployment. Update browser build paths and base href if you host under a subfolder.

If you build with `ng build -c production` directly, run `npm.cmd run seo` afterward to create the pre-rendered pages and social image. `npm run build` also runs SEO through its postbuild hook.

## After deployment

1. Confirm About Us, Contact Us, the guides, robots.txt, sitemap.xml, and the social image return successfully over HTTPS. Check direct links and refreshed pages.
2. Verify ownership of the reporting site in [Google Search Console](https://search.google.com/search-console/). Submit `https://rdlreports.dsserp.in/sitemap.xml` in its Sitemaps section.
3. Use URL Inspection for the homepage and key documentation pages to check Google's rendered content and request indexing where available.
4. Add a visible link from the main dsserp.com website to the reporting documentation. The reporting site already links back to the main company site.
5. Monitor indexing and search queries, then improve useful examples and documentation over time.

These changes make the site easier to crawl and understand. They do not guarantee inclusion in Google's index, a particular search position, or immediate traffic. Google makes those decisions after deployment and crawling. Search Console verification and submission are account actions for the site owner; they have not been performed by this local build.

References: [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
