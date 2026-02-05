type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export function makeFavStore(storage: StorageLike) {
  return {
    read: (id: string) => readFav(storage, id),
    write: (id: string, v: boolean) => writeFav(storage, id, v),
  };
}

function key(id: string): string {
  return `fav_${id}`;
}

function readFav(s: StorageLike, id: string): boolean {
  return s.getItem(key(id)) === '1';
}

function writeFav(s: StorageLike, id: string, value: boolean) {
  if (value) s.setItem(key(id), '1');
  else s.removeItem(key(id));
}
