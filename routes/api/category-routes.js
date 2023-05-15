const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try{
    const productCategory = await Tag.findAll({
      include: [{model: Product}],
    })
    res.status(200).json(productCategory);
  }
    catch (err){
    res.status(500).json(err);
    }
  // find all categories
  // be sure to include its associated Products
});

router.get('/:id', async (req, res) => {
  try{
    const productCategory = await Category.findByPk(req.params.id, {
      include: [{model:Product}],
    })
    if (!productCategory){
      res.status(404).json({message: "There are no Categories with that ID!"});
      return;
    }
    res.status(200).json(productCategory);
  }
    catch(err){
    res.status(500).json(err);
  }
  // find one category by its `id` value
  // be sure to include its associated Products
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

router.put('/:id', async (req, res) => {
  try {
    const productCategory = await Category.update(
      {category_name: req.body.category_name},
      {where: req.params.id}
    );
    res.status(200).json(productCategory);
  } 
    catch (err) {
    res.status(400).json(err);
  }
  // update a category by its `id` value
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
