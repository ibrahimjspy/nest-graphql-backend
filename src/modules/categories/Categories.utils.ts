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


/**
 * @description -- this method validates categories list whether it includes default type or not , also it returns categories in list format which
 * is according to contract
 * This method also returns only parent categories with child categories and move all child categories in there parents if there any exist
 */
export const moveChildCategoriesToParents = (
  categoriesData: CategoryListType,
) => {
  const categories = validateCategoriesResponse(categoriesData);
  const parentCategories = categories.filter(category => {
    if(category.node.level === 0){
      category.node.children.edges = [];
      return category;
    }
  });

  const childCategories = categories.filter(category => {
    if(category.node.level !== 0){
      category.node.children.edges = [];
      return category;
    }
  });

  childCategories.forEach(category => {
    const categoryAncestorLevel0 = category.node.ancestors.edges.length && category.node.ancestors.edges[0];
    const categoryAncestorLevel1 = (category.node.ancestors.edges.length > 1) && category.node.ancestors.edges[1];
    let isArrangedInLevel0 = false;
    let isArrangedInLevel1 = false;
    parentCategories.find(categoryLevel0 => {
      if(categoryLevel0?.node?.id === categoryAncestorLevel0?.node?.id){
        if(category.node.level === 1){
          isArrangedInLevel0 = true;
          category.node.ancestors.edges = [];
          categoryLevel0.node.children.edges.push(category);
        }
        if(category.node.level === 2){
          isArrangedInLevel0 = true;
          categoryLevel0.node.children.edges.find(categoryLevel1 => {
            if(categoryLevel1?.node?.id === categoryAncestorLevel1?.node?.id){
              isArrangedInLevel1 = true;
              category.node.ancestors.edges = [];
              categoryLevel1.node.children.edges.push(category);
            }
          });
          if(!isArrangedInLevel1){
            category.node.ancestors.edges = [];
            const newCategoryLevel1 = {
              node: {
                ...categoryAncestorLevel1.node,
                children: {
                  edges: [category]
                }
              }
            }
            categoryLevel0.node.children.edges.push(newCategoryLevel1)
          }
        }
      }
    })
    if(!isArrangedInLevel0){
      category.node.ancestors.edges = [];
      const newCategoryLevel0 = {
        node: {
          ...categoryAncestorLevel0.node,
          children: {
            edges: [category]
          }
        },
      }
      parentCategories.push(newCategoryLevel0)
    }
  })
  return parentCategories;
};
