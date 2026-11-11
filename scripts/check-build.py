"""Static integrity audit of the generated site; no browser simulation."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re
root=Path(__file__).resolve().parent.parent/'dist'
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=set(); self.links=[]; self.lang=None; self.h1=0
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='html': self.lang=a.get('lang')
        if tag=='h1': self.h1+=1
        if a.get('id'):
            assert a['id'] not in self.ids, f'Duplicate ID: {a["id"]}'
            self.ids.add(a['id'])
        for name in ('href','src'):
            if a.get(name):self.links.append(a[name])
pages={}
for file in root.rglob('*.html'):
    p=Page();p.feed(file.read_text());pages[file]=p
    assert p.lang=='en' and p.h1==1, f'Invalid document structure: {file}'
for file,p in pages.items():
    for value in p.links:
        u=urlsplit(value)
        if u.scheme or u.netloc: continue
        target=root/unquote(u.path).lstrip('/') if u.path.startswith('/') else file.parent/unquote(u.path)
        if target.is_dir():target=target/'index.html'
        if not u.path:target=file
        assert target.exists(), f'Missing asset: {file}: {value}'
        if u.fragment and target in pages:
            assert u.fragment in pages[target].ids, f'Missing fragment: {value}'
for file in root.rglob('*.css'):
    for value in re.findall(r'url\([\'\"]?([^\)\'\"]+)', file.read_text()):
        if value.startswith('data:'):continue
        target=root/value.lstrip('/') if value.startswith('/') else file.parent/value
        assert target.exists(), f'Missing CSS asset: {value}'
print(f'PASS: {len(pages)} pages; local assets, links, anchor targets, document language and heading structure verified.')
