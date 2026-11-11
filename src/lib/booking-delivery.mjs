/** Browser-side delivery. The Web3Forms access key is a public form ID. */
export async function sendBooking(values, accessKey, fetcher = globalThis.fetch) {
  if (!accessKey?.trim()) throw new Error('not-configured');
  if (values.botcheck) throw new Error('invalid-submission');
  const payload = {
    access_key: accessKey.trim(),
    from_name: 'Buachailli Dana website',
    subject: `Booking enquiry — ${values.format || ''} — ${values.date || ''}`,
    name: values.name || '', email: values.email || '', replyto: values.email || '',
    event_date: values.date || '', event_type: values.event || '',
    venue: values.venue || '', lineup: values.format || '', message: values.message || ''
  };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetcher('https://api.web3forms.com/submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload), signal: controller.signal
    });
    if (!response.ok) throw new Error('delivery-unconfirmed');
    const result = await response.json();
    if (result.success !== true) throw new Error('delivery-unconfirmed');
    return true;
  } finally { clearTimeout(timer); }
}
