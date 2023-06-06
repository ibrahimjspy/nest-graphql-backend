import { CategoryListType, CategoryType } from './Categories.types';

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

// TODO we need to handle all levels of categories for product count
/**
 * Filters the categories data by removing categories, children, and grandchildren with zero product counts.
 *
 * @param categoriesData - The categories data to be filtered.
 * @returns The filtered categories data.
 */
export const validateCategoriesResponse = (
  categoriesData: CategoryListType,
) => {
  // Filter and reorder the categories data
  const filteredCategories = categoriesData.edges?.filter((category) => {
    // Exclude categories with "display" set to "none"
    if (
      category.node.metadata.some(
        (meta) => meta.key === 'display' && meta.value === 'none',
      )
    ) {
      return false;
    }
    if (!category.node.children.edges) {
      return category;
    }
    // Filter the children categories
    const filteredChildren = category.node.children?.edges?.filter(
      (childOne) => {
        // Filter the grandchildren categories
        const filteredGrandchildren = childOne.node.children.edges.filter(
          (childTwo) => {
            // Exclude grandchildren categories with zero product counts
            return childTwo.node.products.totalCount !== 0;
          },
        );

        // Replace the grandchildren categories with the filtered ones
        childOne.node.children.edges = filteredGrandchildren;

        // Keep children categories with at least one non-zero product count grandchild
        return filteredGrandchildren.length > 0;
      },
    );

    // Replace the children categories with the filtered ones
    category.node.children.edges = filteredChildren;
    // Keep categories with at least one non-zero product count child or non-default slug
    return category;
  });

  // Filter the top-level parent categories with "display" set to "none"
  const filteredTopParents = filteredCategories?.filter((category) => {
    // Exclude top-level parent categories with "display" set to "none" and zero product count, unless they have metadata key "order" set to 1
    return (
      !category.node.metadata.some(
        (meta) => meta.key === 'display' && meta.value === 'none',
      ) &&
      (category.node.products.totalCount !== 0 ||
        (category.node.metadata.some((meta) => meta.key === 'order') &&
          getCategoryOrderValue(category.node) === 1))
    );
  });

  // Reorder the categories based on metadata key "order" value
  const reorderedCategories = filteredTopParents?.sort((a, b) => {
    const orderA = getCategoryOrderValue(a.node);
    const orderB = getCategoryOrderValue(b.node);
    return orderA - orderB;
  });

  return reorderedCategories;
};

/**
 * Retrieves the order value from the metadata of a category.
 *
 * @param {CategoryType} category - The category object.
 * @returns {number} - The order value extracted from the metadata, or 0 if not found.
 */
const getCategoryOrderValue = (category) => {
  const orderMeta = category.metadata.find((meta) => meta.key === 'order');
  return orderMeta ? parseInt(orderMeta.value, 10) : 0;
};

/**
 * @description -- this method return catagories by filter there level against given level
 * @param categories -- All categories
 * @param level -- Category level for filter categories
 * @return -- Categories against given catagory level
 */
export const getCategoriesByLevel = (
  categories: CategoryListType['edges'],
  level: number,
) => {
  if (typeof level !== 'number' || !categories) {
    return [];
  }
  return categories.filter((category) => {
    if (category.node.level === level) {
      category.node.children.edges = [];
      return category;
    }
  });
};

/**
 * @description -- this method return ancestors of given catagory
 * @param category -- Category detail
 * @return -- ancestors of given catagory
 */
export const getCategoryAncestors = (category: CategoryType) => {
  return category.node?.ancestors?.edges?.length
    ? category.node?.ancestors?.edges
    : [];
};

/**
 * @description -- this method add given child category in given parent catagory
 * @param parentCategory -- Parent Category detail
 * @param childCategory -- Child Category need to add in parent category
 * @return -- parent category with child catagory
 */
export const addChildCategory = (
  parentCategory: CategoryType,
  childCategory: CategoryType,
) => {
  const category: CategoryType = {
    node: {
      ...childCategory?.node,
      children: {
        edges: [],
      },
      ancestors: {
        edges: [],
      },
    },
  };
  const mergedCategories: CategoryType = {
    node: {
      ...parentCategory?.node,
      children: {
        edges: [...(parentCategory?.node?.children?.edges || []), category],
      },
    },
  };
  return mergedCategories;
};
/**
 * @description -- this method validates categories list whether it includes default type or not , also it returns categories in list format which
 * is according to contract
 * This method also returns only parent categories with child categories and move all child categories in there parents if there any exist
 */
export const moveChildCategoriesToParents = (
  categoriesData: CategoryListType,
) => {
  const categories = validateCategoriesResponse(categoriesData);
  const parentCategories = getCategoriesByLevel(categories, 0);
  const categorieslevel1 = getCategoriesByLevel(categories, 1);
  const categorieslevel2 = getCategoriesByLevel(categories, 2);
  const childCategories = [...categorieslevel1, ...categorieslevel2];

  childCategories.forEach((category) => {
    const categoryAncestors = getCategoryAncestors(category);
    const ancestorLevel0 = categoryAncestors.length && categoryAncestors[0];
    const ancestorLevel1 = categoryAncestors.length > 1 && categoryAncestors[1];

    let isArrangedInLevel0 = false;
    let isArrangedInLevel1 = false;

    parentCategories.find((categoryLevel0) => {
      const isMatchLevel0 =
        categoryLevel0?.node?.id === ancestorLevel0?.node?.id;

      if (ancestorLevel0 && isMatchLevel0) {
        if (category.node.level === 1) {
          isArrangedInLevel0 = true;
          categoryLevel0 = addChildCategory(categoryLevel0, category);
        }

        if (categoryLevel0 && category.node.level === 2) {
          isArrangedInLevel0 = true;
          categoryLevel0.node.children.edges.find((categoryLevel1) => {
            const isMatchLevel1 =
              categoryLevel1?.node?.id === ancestorLevel1?.node?.id;
            if (ancestorLevel1 && isMatchLevel1) {
              isArrangedInLevel1 = true;
              category.node.ancestors.edges = [];
              categoryLevel1.node.children.edges.push(category);
            }
          });
          if (!isArrangedInLevel1) {
            const mergedCategory = addChildCategory(ancestorLevel1, category);
            categoryLevel0.node.children.edges.push(mergedCategory);
          }
        }
      }
    });

    if (!isArrangedInLevel0 && ancestorLevel0) {
      const mergedCategory = addChildCategory(ancestorLevel0, category);
      parentCategories.push(mergedCategory);
    }
  });
  return {
    edges: parentCategories,
  };
};
