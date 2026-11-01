import {DOCUMENT} from '@angular/common';
import {inject,Injectable} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {RouterStateSnapshot,TitleStrategy} from '@angular/router';
import {SITE} from './site-info';
import {PRERENDER_PATHS,SEO_PAGES} from './site-pages';
@Injectable()
export class ReportingSeoStrategy extends TitleStrategy {
 private readonly document=inject(DOCUMENT);
 private readonly meta=inject(Meta);
 private readonly title=inject(Title);
 override updateTitle(snapshot:RouterStateSnapshot){
  const raw=snapshot.url.split(/[?#]/)[0].replace(/\/+$/,'')||'/docs/getting-started';
  const path=raw==='/'?'/docs/getting-started':raw;
  const page=SEO_PAGES[path]??{title:(this.buildTitle(snapshot)??'Report examples')+' | DSS Reporting',
   description:'Explore DSS Reporting examples for RDL/RDLC reports in ASP.NET Core and Angular, with report definitions, fictional data, parameters, and source code.'};
  const canonical=SITE.reportingUrl+path+((PRERENDER_PATHS as readonly string[]).includes(path)?'/':'');
  this.title.setTitle(page.title);
  this.meta.updateTag({name:'description',content:page.description});
  this.meta.updateTag({name:'robots',content:page.noindex?'noindex,follow':'index,follow,max-image-preview:large'});
  for(const [property,content] of Object.entries({'og:title':page.title,'og:description':page.description,'og:type':'website','og:url':canonical,'og:site_name':SITE.name,'og:image':SITE.reportingUrl+'/assets/dss-reporting-social.png'}))
   this.meta.updateTag({property,content});
  this.meta.updateTag({name:'twitter:card',content:'summary_large_image'});
  this.meta.updateTag({name:'twitter:title',content:page.title});
  this.meta.updateTag({name:'twitter:description',content:page.description});
  this.meta.updateTag({name:'twitter:image',content:SITE.reportingUrl+'/assets/dss-reporting-social.png'});
  let link=this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if(!link){link=this.document.createElement('link');link.rel='canonical';this.document.head.appendChild(link);}
  link.href=canonical;
  let schema=this.document.getElementById('dss-site-schema');
  if(!schema){schema=this.document.createElement('script');schema.id='dss-site-schema';schema.setAttribute('type','application/ld+json');this.document.head.appendChild(schema);}
  schema.textContent=JSON.stringify({'@context':'https://schema.org','@graph':[
   {'@type':'Organization','@id':SITE.companyUrl+'#organization',name:SITE.companyName,url:SITE.companyUrl,email:SITE.email,telephone:SITE.phoneHref,
    address:{'@type':'PostalAddress',streetAddress:"'Veer', 4th Lane, ShreeRam Nagar, Government Colony (East), Wanlesswadi Area",addressLocality:'Sangli',addressRegion:'Maharashtra',postalCode:'416414',addressCountry:'IN'}},
   {'@type':'WebSite','@id':SITE.reportingUrl+'/#website',name:SITE.name,url:SITE.reportingUrl+'/',publisher:{'@id':SITE.companyUrl+'#organization'}},
   {'@type':'SoftwareApplication','@id':SITE.reportingUrl+'/#software',name:SITE.name,url:SITE.reportingUrl+'/',applicationCategory:'DeveloperApplication',operatingSystem:'Windows',
    description:'Free-to-use proprietary RDL/RDLC reporting library for ASP.NET Core and Angular. Includes document exports, JSON and SQL datasets, QR codes, barcodes, and report actions.',
    license:SITE.reportingUrl+'/license.txt',offers:{'@type':'Offer',price:'0',priceCurrency:'INR'},publisher:{'@id':SITE.companyUrl+'#organization'},downloadUrl:'https://www.nuget.org/packages/Bagojikop.Dss.Reporting.AspNetCore'},
   {'@type':path==='/about-us'?'AboutPage':path==='/contact-us'?'ContactPage':'WebPage','@id':canonical,name:page.title,description:page.description,url:canonical,isPartOf:{'@id':SITE.reportingUrl+'/#website'},publisher:{'@id':SITE.companyUrl+'#organization'}},
  ]});
 }
}
