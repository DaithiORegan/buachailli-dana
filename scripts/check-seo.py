"""Check generated indexing, canonical URLs, metadata, structured data and sitemap."""
from pathlib import Path
from html.parser import HTMLParser
import json,xml.etree.ElementTree as ET
from urllib.parse import urlsplit
root=Path(__file__).resolve().parent.parent
config=json.loads((root/'src/data/site.json').read_text())
class P(HTMLParser):
 def __init__(self):super().__init__();self.meta={};self.canonical=[];self.schema=[];self.title='';self.mode=''
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if t=='meta':self.meta[a.get('name') or a.get('property')]=a.get('content','')
  if t=='link' and a.get('rel')=='canonical':self.canonical.append(a['href'])
  if t=='title':self.mode='title'
  if t=='script' and a.get('type')=='application/ld+json':self.mode='json'
 def handle_endtag(self,t):
  if t in ('title','script'):self.mode=''
 def handle_data(self,d):
  if self.mode=='title':self.title+=d
  if self.mode=='json':self.schema.append(json.loads(d))
sitemap=ET.fromstring((root/'dist/sitemap.xml').read_text())
urls=[el.text for el in sitemap.iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
assert len(urls)==len(set(urls))==6
assert 'Allow: /' in (root/'dist/robots.txt').read_text()
titles=[];descriptions=[]
for url in urls:
 path=urlsplit(url).path
 p=P();p.feed((root/'dist'/path.lstrip('/')/'index.html').read_text())
 assert p.canonical==[url],(path,p.canonical)
 assert url.startswith(config['siteUrl']+'/'),url
 assert 'noindex' not in p.meta['robots']
 assert p.meta['og:url']==url and p.meta['twitter:card']=='summary_large_image'
 assert 15<=len(p.title)<=80,(path,p.title)
 assert 60<=len(p.meta['description'])<=180,(path,p.meta['description'])
 assert p.schema and p.schema[0]['@context']=='https://schema.org'
 assert any(n['@type']=='MusicGroup' for n in p.schema[0]['@graph'])
 titles.append(p.title);descriptions.append(p.meta['description'])
assert len(set(titles))==6
assert len(set(descriptions))==6
p=P();p.feed((root/'dist/404.html').read_text());assert 'noindex' in p.meta['robots']
print('PASS: six indexable canonical pages; unique titles/descriptions; valid JSON-LD; sitemap/robots; 404 noindex.')
