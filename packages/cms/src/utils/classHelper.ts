import { PickType } from '@gcswwell/common';
import {
  getMetadataStorage,
  IsOptional,
  registerDecorator,
  ValidationTypes,
} from 'class-validator';
import {} from 'class-validator/types/metadata/ValidationMetadata';
// import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';
import 'reflect-metadata';

export function createSubClass<T, K extends keyof T>(
  ClassRef: new () => T,
  keys: K[],
): new () => PickType<T, K> {
  class SubClass<T> {
    constructor(ClassRef: new () => T, keys: (keyof T)[]) {
      const instance = new ClassRef();
      keys.forEach((key) => {
        (this as any)[key] = instance[key];
      });
    }
  }

  // Copy metadata for class-validator and class-transformer decorators
  keys.forEach((key: any) => {
    Reflect.getMetadataKeys(ClassRef.prototype, key).forEach((metadataKey) => {
      const metadataValue = Reflect.getMetadata(
        metadataKey,
        ClassRef.prototype,
        key,
      );
      Reflect.defineMetadata(
        metadataKey,
        metadataValue,
        SubClass.prototype,
        key,
      );
    });
  });

  return SubClass as any;
}

// TODO: 无效
export function createOptionalClass<T>(ClassRef: new () => any): new () => any {
  const properties = Object.getOwnPropertyNames(ClassRef.prototype);
  // 创建一个新的类
  const NewClass = class extends ClassRef {};
  // 复制属性描述符
  properties.forEach((propertyName) => {
    const propertyDescriptor = Object.getOwnPropertyDescriptor(
      ClassRef.prototype,
      propertyName,
    );
    if (propertyDescriptor) {
      Object.defineProperty(
        NewClass.prototype,
        propertyName,
        propertyDescriptor,
      );
    }
  });

  // Copy properties from original class and make them optional
  const instance = new ClassRef();
  Object.getOwnPropertyNames(instance).forEach((key) => {
    // console.log('>> kk: ', key);
    if (key !== 'constructor') {
      // Add @IsOptional decorator, 无效
      // Reflect.defineMetadata('class-validator:validation-decorator', IsOptional(), NewClass.prototype, key);
      // TODO： 无效
      addIsOptionalValidationMetadata(NewClass, key);
      // console.log(
      //   '>> meta: ',
      //   getPropertyValidationMetadata(ClassRef, 'title'),
      // );
    }
  });

  return NewClass;
}

export function getPropertyValidationMetadata(
  targetClass: any,
  propertyName: string,
): any[] {
  const metadataStorage = getMetadataStorage();
  const targetName = targetClass.name;

  // 获取目标类的所有验证元数据
  const metadatas = metadataStorage.getTargetValidationMetadatas(
    targetClass,
    targetName,
    true,
    false,
  );

  // 过滤出指定属性的元数据
  return metadatas.filter((metadata) => metadata.propertyName === propertyName);
}

export function addIsOptionalValidationMetadata(
  targetClass: any,
  propertyName: string,
) {
  registerDecorator({
    validator: IsOptional(),
    target: targetClass,
    propertyName: propertyName,
    name: 'optional',
    // validationOptions: { optional: true },
  });
}

// Helper decorator function to apply multiple decorators
export function applyDecorators(
  ...decorators: PropertyDecorator[]
): PropertyDecorator {
  return (target, propertyKey) => {
    decorators.forEach((decorator) => decorator(target, propertyKey));
  };
}
