/**
 * Build a WhatsApp deep link (https://wa.me/<international-number>) from a
 * displayed phone number. Strips spaces, brackets, hyphens and other
 * formatting, drops the leading '+', and defaults a bare Indian number to
 * the +91 country code when no country code is present.
 */
export function whatsappLink(phone: string): string {
  let digits = phone.replace(/[^\d+]/g, '');
  const hadPlus = digits.startsWith('+');
  digits = digits.replace(/\D/g, '');
  // No explicit country code (10-digit local number) → assume India (+91).
  if (!hadPlus && digits.length === 10) digits = `91${digits}`;
  return `https://wa.me/${digits}`;
}
