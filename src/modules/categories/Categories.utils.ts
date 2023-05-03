import { CategoryListType } from './Categories.types';

/**
 * @description -- it takes categories list from saleor and mappings from elastic search then it compares the list to find out which of categories
 * are added against retailer -- if any category matches the criteria it adds a boolean sync == true otherwise it will be false
 */
export const prepareSyncedCategoriesResponse = (
  categoriesData,
  syncedCategoriesMapping,
) => {
  categoriesData.edges.map((category) => {
    if (
      syncedCategoriesMapping.results.some(
        (mapping) => mapping?.shr_category_id?.raw === category?.node?.id,
      )
    ) {
      category.node.sync = true;
      return;
    }
    category.node.sync = false;
    return category;
  });
  return categoriesData;
};

/**
 * @description -- this method validates categories list whether it includes default type or not , also it returns categories in list format which
 * is according to contract
 */
export const validateCategoriesResponse = (
  categoriesData: CategoryListType,
) => {
  const DEFAULT_CATEGORY_SLUG = 'default-category';
  return categoriesData.edges?.filter((category) => {
    return category.node.slug !== DEFAULT_CATEGORY_SLUG;
  });
};
