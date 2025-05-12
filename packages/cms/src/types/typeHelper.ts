export type PickType<T, Keys extends keyof T> = {
  [K in Keys]: T[K];
};

export type FilterByInterface<T, U> = {
  [K in keyof T]: K extends keyof U ? T[K] : never;
};

export function filterObjectByInterface<T extends object, U extends object>(obj: T, interfaceShape: U): Partial<T> {
  const keys = Object.keys(obj) as (keyof T)[];
  const validKeys = new Set<keyof U>(Object.keys(interfaceShape) as (keyof U)[]);

  return keys.reduce((filteredObj, key) => {
    if (validKeys.hasOwnProperty(key as unknown as keyof U)) {
      filteredObj[key] = obj[key];
    }
    return filteredObj;
  }, {} as Partial<T>);
}
