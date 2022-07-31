const Category = require('../models/Category');

/**
 * For preparing category for a query response
 * @param {categorySchema} category
 * @return {{id: string, title: string, subcategories: {id: string, title: string}[]}}
 */
function prepareCategory(category) {
  return {
    id: category._id.toString(),
    title: category.title,
    subcategories: category.subcategories.map(prepareSubCategory),
  };
}

/**
 * For preparing subCategory for a query response
 * @param {subCategorySchema} subCategory
 * @return {{id: string, title: string}}
 */
function prepareSubCategory(subCategory) {
  return {
    id: subCategory._id.toString(),
    title: subCategory.title,
  };
}

module.exports.categoryList = async function categoryList(ctx, next) {
  const categoriesDB = await Category.find({});
  const categories = categoriesDB.map(prepareCategory);

  ctx.body = {categories};
}