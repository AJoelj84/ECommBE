const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// Get All Products
router.get('/', async (req, res) => {
  try{
    const productsAll = await Product.findAll({
      include: [{model: Category}, {model: Tag}],
    })
    res.status(200).json(productsAll);
  }
    catch (err){
      res.status(500).json(err);
    }
});

// Find Product by ID
router.get('/:id', async (req, res) => {
  try{
    const productsAll = await Product.findByPk(req.params.id, {
      include: [{model: Category}, {model: Tag}],
    })
    if (!productsAll){
      res.status(404).json({message: "There are No Products with the ID provided."});
      return;
    }
      res.status(200).json(productsAll);
  }
    catch (err){
      res.status(500).json(err);
    }
});

// Create A New Product
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// Update Product by ID
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {  
      
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds

        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      res.status(400).json(err);
    });
});
// Product Deletion by ID
router.delete('/:id', async (req, res) => {
  try{
    const productsAll = await Product.destroy({
      where: {
        id: req.params.id,
      }
    })
    if (!productsAll){
      res.status(404).json({ message: " No Products with that ID!"});
      return;
    }
    res.status(200).json(productsAll);
  }
  catch (err){
    res.status(500).json(err);
  }
});

module.exports = router;
