import { afterEach, describe, expect, it } from 'vitest';

import { readCollection, writeCollection } from '@/adapters/localStorageRepository';

afterEach(() => {
  window.localStorage.clear();
});

describe('localStorageRepository', () => {
  it('escribe y lee una coleccion respetando el limite', () => {
    writeCollection('test.items', [1, 2, 3, 4], 2);

    expect(readCollection<number>('test.items')).toEqual([1, 2]);
  });

  it('devuelve una lista vacia cuando la clave no existe', () => {
    expect(readCollection('test.missing')).toEqual([]);
  });

  it('descarta el contenido corrupto y limpia la clave', () => {
    window.localStorage.setItem('test.corrupt', '{ no es json');

    expect(readCollection('test.corrupt')).toEqual([]);
    expect(window.localStorage.getItem('test.corrupt')).toBeNull();
  });
});
