import { readFile, writeFile } from 'node:fs/promises';
const s=JSON.parse(await readFile(new URL('../src/data/site.json',import.meta.url),'utf8'));
const lines=[s.bandName.toUpperCase(),'BAND & SOLO BOOKINGS','',s.bio,'','BAND: '+s.bandName+' — two to five piece, based on venue and requirements.','SOLO: '+s.name,'EVENTS: '+s.events.join(', '),'SETLIST: Catered to the venue and occasion.','','Email: '+s.email,'Phone: '+s.phone,'','Please include your date, venue, event type, preferred lineup and approximate performance times.'];
await writeFile(new URL('../public/downloads/artist-information.txt',import.meta.url),lines.join('\n')+'\n');

const songs=JSON.parse(await readFile(new URL('../src/data/setlist.json',import.meta.url),'utf8'));
const heading=[s.bandName+' / '+s.name,'SETLIST'+(s.setlistDraft?' — DRAFT FOR REVIEW':''),'Setlist catered to the venue and occasion. Confirm specific songs when booking.',''];
const entries=songs.slice().sort((a,b)=>a.title.localeCompare(b.title)).map(x=>x.title+' — '+x.artist+' ['+x.category+']');
await writeFile(new URL('../public/downloads/setlist.txt',import.meta.url),[...heading,...entries].join('\n')+'\n');
