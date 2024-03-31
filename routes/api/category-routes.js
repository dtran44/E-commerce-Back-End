const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // GET all categories

  const categories = await Category.findAll({
    include: [
      {
        model: Product,
      }
    ]
  })

  res.json(categories);

});

router.get('/:id', async (req, res) => {
  // GET one category by its `id` value

  const categories = await Category.findByPk(req.params.id, {
    include: [
      {
        model: Product,
      }
    ]
  })

  res.json(categories);

});

router.post('/', async (req, res) => {
  // POST a new category

  const created = await Category.create({
    name: req.body.name,
  })

  res.json(created);
});

router.put('/:id', async (req, res) => {
  // PUT a category by its `id` value

  const category = await Category.findByPk(req.params.id);

  const updated = await category.update({
    name: req.body.name
  });

  res.json(updated);

});

router.delete('/:id', async (req, res) => {
  // DELETE a category by its `id` value

  const deleted = await Category.destroy({
    where: {
      id: req.params.id
    }
  })

  res.json(deleted);

});

module.exports = router;
