export * from './dateHelper';
export * from './arrayHelper';
export * from './help';
export * from './objectHelper';
export * from './regExp';
export * from './stringHelper';

export const sleep = (time = 2000) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1);
    }, time);
  });

interface IMemory {
  data: any;
  get: (key: string) => any;
  set: (key: string, value: any) => void;
  clear: () => void;
  remove: (key: string) => void;
}

export const memoryManage: IMemory = {
  data: null,
  get(key: string) {
    return this.data ? this.data[key] : null;
  },
  set(key: string, value) {
    if (!this.data) {
      this.data = {};
    }
    this.data[key] = value;
  },
  clear() {
    this.data = null;
  },
  remove(key: string) {
    this.data[key] = null;
    delete this.data[key];
  },
};
