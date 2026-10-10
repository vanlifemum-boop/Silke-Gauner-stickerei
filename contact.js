export const WHATSAPP_URL='https://wa.me/491636997060';
export const whatsappIcon='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M27.5 15.5a12 12 0 0 1-17.8 10.5L3 28l2-6.4A12 12 0 1 1 27.5 15.5Z"/><path d="m11 8 2.5 4-1.8 1.8a13 13 0 0 0 6.5 6.5L20 18l4 2.5c-.5 2-2.4 3-4.5 2.5C12 21.5 7 16 8 11c.3-1.7 1.2-2.8 3-3Z"/></svg>';
export const whatsappLink=(label='Per WhatsApp schreiben',className='whatsapp-contact')=>`<a class="${className}" href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" aria-label="${label} an Sylke Gauder">${whatsappIcon}<span>${label}</span></a>`;
