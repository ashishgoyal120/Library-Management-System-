export const countryCodes = [
  { code: '+91', label: 'India (+91)' },
  { code: '+1', label: 'United States (+1)' },
  { code: '+44', label: 'United Kingdom (+44)' },
  { code: '+61', label: 'Australia (+61)' },
  { code: '+971', label: 'United Arab Emirates (+971)' },
  { code: '+65', label: 'Singapore (+65)' },
];

export const defaultCountryCode = '+91';

export function digitsOnly(value) {
  return String(value || '').replace(/\D/g, '');
}

export function formatPhone(countryCode, phone) {
  return phone ? `${countryCode || defaultCountryCode} ${phone}` : '-';
}
