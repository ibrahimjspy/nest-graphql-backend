/**
 * This function removes duplicate categories conflicting with group name
 * value
 */
export function categoriesFilter(categories: any) {
  //  TODO fix categories list when no duplicates are coming
  const categoriesList = [...categories.categories.edges.slice(1)];
  const newCategoriesList = categoriesList.map((category) => {
    const parentCategoryName = category?.node?.name?.toLowerCase();
    const childCategoryName =
      category?.node?.children?.edges[0].node?.name?.toLowerCase();
    if (parentCategoryName === childCategoryName) {
      return (category = category?.node?.children?.edges[0]);
    }
    return category;
  });
  return newCategoriesList;
}
