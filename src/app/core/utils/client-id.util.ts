const KEY = 'elicora_client_id';

export function getClientId(): string {
  let id = localStorage.getItem(KEY);
  if (id) return id;

  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    id = crypto.randomUUID();
  } else {
    id = `cid_${Math.random().toString(16).slice(2)}_${Date.now()}`;
  }

  localStorage.setItem(KEY, id);
  return id;
}
