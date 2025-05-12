import { FilterTypeEnum } from "./enums";

type WhereClauseMultipleFilters = {
  [K in FilterTypeEnum]?: { [key: string]: any }[];
};

export interface IBodyFilter {
  offset?: number; //对应skip
  limit?: number; // 对应take
  filter?: { [key: string]: any }[] | { [key: string]: any }; // []需要配合and,or这类filterType
  filterType?: string; // FilterTypeEnum
  select?: {
    [key: string]: boolean;
  };
  include?: any;
  sortBy?: string;
  orderBy?: string; // orderByEnum
}
