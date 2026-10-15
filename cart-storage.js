export const STORAGE_KEY = 'gauder-design-cart-v1';
export const CONSENT_KEY = 'gauder-cart-consent-v1';
export const REMEMBER_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

// This module stores selections, not trusted product/price data. Callers still
// validate restored selections against the current catalogue with sanitizeCart.
export function createCartStorage({session, local, now = () => Date.now()} = {}) {
  let loaded = false;
  let cart = [];
  let expiresAt = 0;

  const readResult = (storage, key) => {
    try { return {ok: Boolean(storage), value: storage?.getItem(key) ?? null}; }
    catch { return {ok: false, value: null}; }
  };
  const read = (storage, key) => readResult(storage, key).value;
  const remove = (storage, key) => {
    try { storage?.removeItem(key); } catch { /* Memory remains usable. */ }
  };
  const write = (storage, key, value) => {
    try {
      if (!storage) return false;
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch { return false; }
  };
  const parse = raw => {
    try { return JSON.parse(raw); } catch { return null; }
  };
  const snapshot = value => {
    try {
      const copy = JSON.parse(JSON.stringify(value));
      return Array.isArray(copy) ? copy : [];
    } catch { return []; }
  };
  const forgetPersistent = () => {
    expiresAt = 0;
    remove(local, STORAGE_KEY);
    remove(local, CONSENT_KEY);
  };
  const validConsent = consent => consent?.version === 1 &&
    Number.isFinite(consent.expiresAt) && consent.expiresAt > now();
  const expire = () => {
    if (!expiresAt) return;
    // Another tab may have withdrawn, cleared or renewed consent. The current
    // record takes precedence over this tab's cached expiry before any write.
    const current = readResult(local, CONSENT_KEY);
    const consent = parse(current.value);
    if (validConsent(consent)) {
      expiresAt = consent.expiresAt;
    } else {
      expiresAt = 0;
      // A failed read is not proof that a newer consent record is absent.
      if (current.ok) forgetPersistent();
    }
  };

  function initialize() {
    if (loaded) return;
    loaded = true;
    const sessionCart = parse(read(session, STORAGE_KEY));
    const consentRaw = read(local, CONSENT_KEY);
    const consent = parse(consentRaw);
    if (validConsent(consent)) {
      expiresAt = consent.expiresAt;
      const localCart = parse(read(local, STORAGE_KEY));
      cart = snapshot(Array.isArray(localCart) ? localCart : sessionCart);
      if (cart.length) write(session, STORAGE_KEY, cart);
      return;
    }

    cart = snapshot(sessionCart);
    // Do not even read an expired persistent selection. Only a missing consent
    // record can identify an older cart eligible for the one-time migration.
    const legacyRaw = consentRaw === null ? read(local, STORAGE_KEY) : null;
    const localCart = parse(legacyRaw);
    // Preserve a pre-consent legacy selection once in the current session, but
    // do not revive an explicitly expired or malformed consent record.
    if (consentRaw === null && Array.isArray(localCart) && !Array.isArray(sessionCart)) {
      cart = snapshot(localCart);
      if (cart.length) write(session, STORAGE_KEY, cart);
    }
    if (consentRaw !== null || legacyRaw !== null) forgetPersistent();
  }

  return {
    load() {
      initialize();
      expire();
      return snapshot(cart);
    },
    save(value) {
      initialize();
      expire();
      cart = snapshot(value);
      write(session, STORAGE_KEY, cart);
      if (expiresAt && !write(local, STORAGE_KEY, cart)) forgetPersistent();
    },
    setRemember(remember) {
      initialize();
      expire();
      // Keep the current choice available for the session after opting out,
      // including a selection originally restored from persistent storage.
      write(session, STORAGE_KEY, cart);
      if (remember !== true) {
        forgetPersistent();
        return false;
      }
      expiresAt = now() + REMEMBER_DURATION_MS;
      if (!write(local, CONSENT_KEY, {version: 1, expiresAt}) ||
          !write(local, STORAGE_KEY, cart)) forgetPersistent();
      return Boolean(expiresAt);
    },
    isRemembered() {
      initialize();
      expire();
      return Boolean(expiresAt);
    },
    clear() {
      loaded = true;
      cart = [];
      expiresAt = 0;
      for (const storage of [session, local]) {
        remove(storage, STORAGE_KEY);
        remove(storage, CONSENT_KEY);
      }
    }
  };
}
