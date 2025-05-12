import { isArray, isString } from 'class-validator';

export const checkHasDuplicatesByField = (
  field: string,
  data: Record<string, unknown>[],
) => {
  // return true if the array has duplicates, determine by given field
  return new Set(data.map((obj) => obj[field])).size !== data.length;
};

export const handleObjectArrayDuplicatesByField = <T>(
  field: string,
  data: T[],
) => {
  // use Map and the given field to check the total occurrences of the field value
  const lookup = data.reduce((previous, current: any) => {
    previous.set(current[field], (previous.get(current[field]) ?? 0) + 1);
    return previous;
  }, new Map());

  // use filter to filter the result by the field value's total occurrences
  const getResult = (duplicated: boolean) => {
    return data.filter((obj: any) =>
      // if the field value's count is > 1, it is a duplicated record
      // and vice versa
      duplicated ? lookup.get(obj[field]) > 1 : lookup.get(obj[field]) === 1,
    );
  };

  return { duplicates: getResult(true), prunedData: getResult(false) };
};

export const removeNullOrUndefinedFromArray = (arr: string[]) => {
  return arr.filter((item) => item !== null && item !== undefined);
};

export function isArrayOfString(x: any[]): x is string[] {
  return isArray(x) && x.every(isString);
}
export function unique<T>(arr: T[]): T[] | undefined {
  if (!Array.isArray(arr)) {
    console.log('type error!');
    return;
  }
  const array: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (array.indexOf(arr[i]) === -1) {
      array.push(arr[i]);
    }
  }
  return array;
}

export const arrayRecursive = <T>(
  array: T[],
  key: keyof T,
  iteratee: (item: T) => boolean,
): void => {
  if (!Array.isArray(array)) {
    return;
  }
  array.forEach((item) => {
    if (iteratee(item)) {
      return;
    }
    arrayRecursive(item[key] as T[], key, iteratee);
  });
};

export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}
