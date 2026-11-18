/**
 * Shakherhat SMS Gateway Helper for Netlify Functions
 */

const SMS_BASE_URL = process.env.SMS_BASE_URL || 'https://api.shakherhat.com';

export function formatBdMobile(phone) {
  if (!phone) return '';
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const en = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let clean = String(phone);
  bn.forEach((d, i) => { clean = clean.replaceAll(d, en[i]); });
  const digits = clean.replace(/\D/g, '');
  if (digits.length === 13 && digits.startsWith('8801')) return digits;
  if (digits.length === 11 && digits.startsWith('01')) return '88' + digits;
  if (digits.length === 10 && digits.startsWith('1')) return '880' + digits;
  return digits;
}

export function getChamberPhone(chamberId = '', chamberLocation = '') {
  const key = String(chamberId + ' ' + chamberLocation).toLowerCase();
  if (key.includes('ashuganj')) return '8801771358595'; // Ashuganj chamber serial mobile strictly
  if (key.includes('brahmanbaria')) return '8801766662233'; // Brahmanbaria chamber serial mobile
  if (key.includes('dhaka')) return '8801841822442'; // Dhaka chamber serial mobile
  return '8801841822442';
}

export function getShortChamberName(chamberId = '', chamberLocation = '') {
  const key = String(chamberId + ' ' + chamberLocation).toLowerCase();
  if (key.includes('ashuganj')) return 'Ashuganj';
  if (key.includes('brahmanbaria')) return 'Brahmanbaria';
  if (key.includes('dhaka')) return 'Dhaka';
  return 'Chamber';
}

export async function sendSmsNotification(mobileNumber, message, apiKey = '') {
  const formatted = formatBdMobile(mobileNumber);
  if (formatted.length < 11) {
    return { success: false, message: 'Invalid phone: ' + mobileNumber };
  }

  const key = apiKey || process.env.SMS_API_KEY || '';
  if (!key) {
    console.warn('[SMS Gateway] SMS_API_KEY is not configured in Netlify environment variables.');
    return { success: false, message: 'SMS_API_KEY missing' };
  }

  try {
    const res = await fetch(`${SMS_BASE_URL}/sms/sendSms`, {
      method: 'POST',
      headers: {
        'X-API-KEY': key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        MobileNumber: formatted,
        Message: message
      })
    });

    const data = await res.json().catch(() => ({}));
    console.log(`[SMS Gateway] Sent to ${formatted}:`, data.message || res.status);
    return { success: res.ok, data };
  } catch (err) {
    console.error(`[SMS Gateway] Failed for ${formatted}:`, err.message);
    return { success: false, error: err.message };
  }
}
