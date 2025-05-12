import { Transform } from 'class-transformer';
import { MultiLanguageKeys } from 'constants/country-codes';

const ToMultilang = (propertyName: string) => {
  const toPlain = Transform(
    ({ value }) => {
      return value;
    },
    {
      toPlainOnly: true,
    },
  );
  const toClass = (target: any, key: string) => {
    return Transform(
      ({ obj }) => {
        return valueToMultilangSearch(propertyName, obj[propertyName]);
      },
      {
        toClassOnly: true,
      },
    )(target, key);
  };
  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
};

const valueToMultilangSearch = (searchName: string, searchValue: string) => {
  if (searchValue && typeof searchValue === 'string') {
    const queries = MultiLanguageKeys.map((lang) => ({
      [searchName]: {
        is: {
          [`${lang}`]: {
            contains: searchValue,
            mode: 'insensitive',
          },
        },
      },
    }));
    return queries;
  }
  if (searchValue === null || searchValue === undefined) {
    return undefined;
  }
  return undefined;
};

export { ToMultilang };
