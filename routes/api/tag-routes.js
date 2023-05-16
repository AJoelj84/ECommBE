const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [
        {
          model: Product,
          through: ProductTag,
          attributes: ['id', 'product_name', 'price', 'category_id'],
        },
      ],
    });
    res.status(200).json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  Tag.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'category_id'],
      }
    ]
  })
    .then(productTag => {
      if (!productTag) {
        res.status(404).json({ message: 'ID for that Tag Not Found!'});
        return;
      }
      res.json(productTag);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});
  // find a single tag by its `id`
  // be sure to include its associated Product data


router.post('/', async (req, res) => {
  Tag.create({
    tag_name: req.body.tag_name
  })
    .then(productTag => res.json(productTag))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
  });
});
  // create a new tag

router.put('/:id', async (req, res) => {
  Tag.update(req.body, {
    where: {
        id: req.params.id
    }
  })
    .then(productTag => {
        if (!productTag[0]) {
            res.status(404).json({ message: 'ID for that Tag Not Found!'});
            return;
        }
        res.json(productTag);
  })
    .catch(err => {
        console.log(err); 
        res.status(500).json(err);
  });
});

router.delete('/:id', async (req, res) => {
  Tag.destroy({
    where: {
        id: req.params.id
    }
  })
    .then(productTag => {
        if (!productTag) {
            res.status(404).json({ message: 'ID for that Tag Not Found!'});
            return;
        }
        res.json(productTag);
  })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
  });
});

module.exports = router;