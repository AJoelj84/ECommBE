const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const productTag = await Tag.findAll({
      include: [{ model: Product, through: ProductTag}],
    });
    res.status(200).json(productTag);
  } 
    catch (err) {
    res.status(500).json(err);
  }
  // find all tags
  // be sure to include its associated Product data
});

router.get('/:id', async (req, res) => {
  try {
    const productTag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag}],
    });
    if (!productTag) {
      res.status(404).json({ message: "ID for that Tag Not Found!" });
      return;
    }
    res.status(200).json(productTag);
  } 
    catch (err) {
    res.status(500).json(err);
  }
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post('/', async (req, res) => {
  try {
    const productTag = await Tag.create(req.body);
    res.status(200).json(productTag);
  } 
    catch (err) {
    res.status(400).json(err);
  }
  // create a new tag
});

router.put('/:id', async (req, res) => {
  try {
    const productTag = await Tag.update(req.body, {
      where: {id: req.params.id}
  });
    res.status(200).json(productTag);
  } 
    catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const productTag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!productTag) {
      res.status(404).json({ message: "ID for that Tag Not Found!" });
      return;
    }
    res.status(200).json(productTag);
  } 
    catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;