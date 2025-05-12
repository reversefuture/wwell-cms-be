export type paginatedReturnType<documentType> = {
  limit: number;
  offset: number;
  count: number;
  totalCount: number;
  documents: documentType[];
};

export type modifiedReturnType<documentType> = {
  original: documentType;
  modified: documentType;
};
