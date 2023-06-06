const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  Category.findAll({
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
      }
    ]
  })
    .then(productCategory => res.json(productCategory))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', async (req, res) => {
  Category.findOne({
    where: {
      id: req.params.id
    },
    // be sure to include its associated Products
    include: {
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
    }
  })
    .then(productCategory => {
      if (!productCategory) {
        res.status(404).json({ message: 'There are no products with that ID!' });
        return;
      }
      res.json(productCategory);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err)
    });
});

router.post('/', async (req, res) => {
  try{
    const productCategory = await Category.create(req.body);
    res.status(200).json(productCategory);
  }
    catch(err){
    res.status(400).json(err);
  }
  // create a new category
});

router.delete('/:id', async (req, res) => {
  try {
    const productCategory = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!productCategory) {
      res.status(404).json({ message: 'No Category found with that ID!' });
      return;
    }

    res.status(200).json(productCategory);
  } catch (err) {
    res.status(500).json(err);
  }
  // delete a category by its `id` value
});

module.exports = router;
