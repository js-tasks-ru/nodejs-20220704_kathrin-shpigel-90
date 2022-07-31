const Product = require('../models/Product');
const mongoose = require('mongoose');

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

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  /**
   * If subcategory is not passed, then return all products
   */
  if (!subcategory) return next();

  if (!mongoose.isValidObjectId(subcategory)) {
    ctx.throw(400, 'Id not valid');
  }

  const productsDB = await Product.find({subcategory});
  const products = productsDB.map(prepareProduct);

  ctx.body = {products};
};

module.exports.productList = async function productList(ctx, next) {
  const productsDB = await Product.find({});
  const products = productsDB.map(prepareProduct);

  ctx.body = {products};
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;

  if (!mongoose.isValidObjectId(id)) {
    ctx.throw(400, 'Id not valid');
  }

  const productDB = await Product.findById(id);

  if (!productDB) {
    ctx.throw(404, 'Product not found');
  }

  const product = prepareProduct(productDB);

  ctx.body = {product};
};
