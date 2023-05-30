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

export const getChildCategoriesInParents = (
  categoriesData: CategoryListType,
) => {
  const categories = validateCategoriesResponse(categoriesData);
  const categoriesWithParents = categories.filter(category => {
    if(category.node.level === 0){
      category.node.children.edges = [];
      return category;
    }
  });

  categories.forEach(category => {
    const ancestorCategoryLevel0 = category.node.ancestors.edges.length && category.node.ancestors.edges[0];
    const ancestorCategoryLevel1 = (category.node.ancestors.edges.length > 1) && category.node.ancestors.edges[1];
    if(category.node.level === 1){
      let isCategoryArranged = false;
      categoriesWithParents.find(parentCategory => {
        if(parentCategory?.node?.id === ancestorCategoryLevel0?.node?.id){
          isCategoryArranged = true;
          category.node.ancestors.edges = [];
          parentCategory.node.children.edges.push(category);
        }
      })
      if(!isCategoryArranged){
        category.node.ancestors.edges = [];
        const newParentCategoryWithChild = {
          node: {
            ...ancestorCategoryLevel0.node,
            children: {
              edges: [category]
            }
          },
        }
        categoriesWithParents.push(newParentCategoryWithChild)
      }
    }

    if(category.node.level === 2){
      let isCategoryLevel1 = false;
      let isCategoryLevel2 = false;
      categoriesWithParents.find(parentCategory => {
        if(parentCategory?.node?.id === ancestorCategoryLevel0?.node?.id){
          isCategoryLevel1 = true;
          parentCategory.node.children.edges.find(parentCategorylevel1 => {
            if(parentCategorylevel1?.node?.id === ancestorCategoryLevel1?.node?.id){
              isCategoryLevel2 = true;
              category.node.ancestors.edges = [];
              parentCategorylevel1.node.children.edges.push(category);
            }
          })
          if(!isCategoryLevel2){
            category.node.ancestors.edges = [];
            const newChildCategoryWithSub = {
              node: {
                ...ancestorCategoryLevel1.node,
                children: {
                  edges: [category]
                }
              }
            }
            parentCategory.node.children.edges.push(newChildCategoryWithSub)
          }
        }
      })
      if(!isCategoryLevel1){
        category.node.ancestors.edges = [];
        const newParentCategoryWithChild = {
          node: {
            ...ancestorCategoryLevel0.node,
            children: {
              edges: [{
                node: {
                  ...ancestorCategoryLevel1.node,
                  children: {
                    edges: [category]
                  }
                }
              }]
            }
          },
        }
        categoriesWithParents.push(newParentCategoryWithChild)
      }
    }
  })
  return categoriesWithParents;
};
