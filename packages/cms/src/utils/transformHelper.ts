interface SearchCondition {
  contains: string;
  mode: 'insensitive';
}

export function transformToSearchConditions(input: Record<string, any>): {
  [key: string]: SearchCondition;
} {
  const result: { [key: string]: SearchCondition } = {};

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && typeof value === 'string') {
      result[key] = {
        contains: value,
        mode: 'insensitive',
      };
    }
  }

  return result;
}
