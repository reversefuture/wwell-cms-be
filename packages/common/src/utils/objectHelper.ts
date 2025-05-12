export const removeUndefinedFromObj = (obj) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

export const objIsEmpty = (obj) => Object.keys(obj).length === 0;

export const trimKeysAndValue = (object: object) =>
  Object.keys(object).forEach(function (key) {
    object[key] =
      typeof object[key] === 'string' ? object[key].trim() : object[key];

    const newKey = key.trim();
    if (key !== newKey) {
      object[newKey] = object[key];
      delete object[key];
    }
  });

export type MapBoolean<T> = {
  [PropertyKey in keyof T]: boolean;
};

export const mapObjValuesToTrue = (obj: any) =>
  Object.keys(obj).forEach((key) => {
    obj[key] = true;
  });

export function deepClone(obj:any){
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const clone:any = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Recursively copy each property of obj
      clone[key] = deepClone(obj[key]);
    }
  }

  return clone;
}

export function getTargetDtoFields<T extends new ()=>any>(originalObject: any, targetDto: T): Partial<T> {
  const result: Partial<T> = {};

  // 获取 targetDto 的所有字段
  // const fields = Object.keys(targetDto) as (keyof T)[]; //返回[]
  const fields = Object.keys(new targetDto());
  // console.log(">> target fields: ", fields)
  fields.forEach(field => {
      if (originalObject[field]) {
          result[field] = originalObject[field];
      }
  });

  return result;
}