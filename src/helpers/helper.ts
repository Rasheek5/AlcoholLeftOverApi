export const searchTermRegex = (searchTerm: string) =>
  new RegExp(searchTerm ?? "", "i");
