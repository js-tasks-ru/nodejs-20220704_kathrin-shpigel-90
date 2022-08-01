const Product = require('../models/Product');

/**
 * For preparing product for a query response
 * @param {productSchema} product
 * @return {
 *  {
 *    images: string[],
 *    price: number,
 *    description: string,
 *    id: string,
 *    title: string,
 *    category: string,
 *    subcategories: string,
 *  }
 * }
 */
function prepareProduct(product) {
  return {
    id: product._id.toString(),
    title: product.title,
    images: product.images,
    category: product.category.toString(),
    subcategory: product.subcategory.toString(),
    price: product.price,
    description: product.description,
  };
}

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query;

  const productsDB = await Product.find(
      {$text: {$search: query}},
      {score: {$meta: 'textScore'}},
  ).sort({score: {$meta: 'textScore'}});

  const products = productsDB.map(prepareProduct);

  ctx.body = {products};
};
