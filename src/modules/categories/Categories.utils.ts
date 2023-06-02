import { CategoryListType } from './Categories.types';

/**
 * @description -- it takes categories list from saleor and mappings from elastic search then it compares the list to find out which of categories
 * are added against retailer -- if any category matches the criteria it adds a boolean sync == true otherwise it will be false
 * @warn -- static product count is only valid because we are only importing 100 products against category
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
 * Filters the categories data by removing categories, children, and grandchildren with zero product counts.
 *
 * @param categoriesData - The categories data to be filtered.
 * @returns The filtered categories data.
 */
export const validateCategoriesResponse = (
  categoriesData: CategoryListType,
) => {
  // Define the slug of the default category to exclude if needed
  const DEFAULT_CATEGORY_SLUG = 'default-category';

  // Filter the categories data
  return categoriesData.edges?.filter((category) => {
    // Exclude categories with zero product counts
    if (category.node.products.totalCount === 0) return false;

    // Filter the children categories
    const filteredChildren = category.node.children.edges.filter((childOne) => {
      // Exclude children categories with zero product counts
      if (childOne.node.products.totalCount === 0) return false;

      // Filter the grandchildren categories
      const filteredGrandchildren = childOne.node.children.edges.filter(
        (childTwo) => {
          // Keep grandchildren categories with non-zero product counts
          return childTwo.node.products.totalCount !== 0;
        },
      );

      // Replace the grandchildren categories with the filtered ones
      childOne.node.children.edges = filteredGrandchildren;

      // Keep children categories with at least one non-zero product count grandchild
      return filteredGrandchildren.length > 0;
    });

    // Replace the children categories with the filtered ones
    category.node.children.edges = filteredChildren;

    // Keep categories with at least one non-zero product count child or non-default slug
    return (
      category.node.children.edges.length > 0 ||
      category.node.slug !== DEFAULT_CATEGORY_SLUG
    );
  });
};
