import test from 'node:test';
import assert from 'node:assert/strict';
import { sendBooking } from '../src/lib/booking-delivery.mjs';
const values={name:'Test Person',email:'visitor@example.com',date:'2027-06-20',event:'Weddings',venue:'Test Venue',format:'Band — five piece',message:'Times: 18:00–20:00. Song request: “Dreams”.'};
test('sends all booking details and a reply-to address to the email service',async()=>{
 let sent;
 assert.equal(await sendBooking(values,'public-form-id',async(url,options)=>{sent={url,options,payload:JSON.parse(options.body)};return {ok:true,json:async()=>({success:true})};}),true);
 assert.equal(sent.url,'https://api.web3forms.com/submit');assert.equal(sent.options.method,'POST');
 assert.equal(sent.payload.replyto,values.email);assert.equal(sent.payload.name,values.name);
 assert.equal(sent.payload.event_date,values.date);assert.equal(sent.payload.event_type,values.event);
 assert.equal(sent.payload.venue,values.venue);assert.equal(sent.payload.lineup,values.format);assert.equal(sent.payload.message,values.message);
 assert.equal(sent.payload.to,undefined);
});
test('missing key and honeypot never send a request',async()=>{
 let calls=0;const mock=async()=>{calls++;};
 await assert.rejects(sendBooking(values,'',mock),/not-configured/);
 await assert.rejects(sendBooking({...values,botcheck:'on'},'id',mock),/invalid-submission/);
 assert.equal(calls,0);
});
test('HTTP errors, rejected submissions, invalid JSON and network failure never report success',async()=>{
 for(const mock of [async()=>({ok:false,status:429}),async()=>({ok:true,json:async()=>({success:false})}),async()=>({ok:true,json:async()=>({})}),async()=>({ok:true,json:async()=>{throw new Error('invalid-json');}}),async()=>{throw new Error('offline');}]){
  await assert.rejects(sendBooking(values,'id',mock));
 }
});
