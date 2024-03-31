const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// Get all products
router.get('/', async (req, res) => {
  try {
    // Find all products and include associated Category and Tag data
    const productsData = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    res.status(200).json(productsData);
  } catch (err) {
    res.status(500).json(err); // Internal server error if something goes wrong
  }
});

// Get one product by ID
router.get('/:id', async (req, res) => {
  try {
    // Find a single product by its id and include associated Category and Tag data
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });

    if (!productData) {
      // If no product found, send 404 status with a message
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }

    // Send the product data if found
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err); // Internal server error if something goes wrong
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    // Create a new product with the request body
    const product = await Product.create(req.body);

    if (req.body.tagIds && req.body.tagIds.length) {
      // If there are product tags, create pairings to bulk create in the ProductTag model
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }

    // Send success message with the created product
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err); // Bad request if request body is invalid
  }
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      [1, 2]
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// Delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    // Delete a product by its id
    const deletedProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedProduct) {
      // If no product found with the id, send 404 status with a message
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }

    // Send success message if product deleted successfully
    res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (err) {
    res.status(500).json(err); // Internal server error if something goes wrong
  }
});

module.exports = router;
