const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// GET all tags
router.get('/', async (req, res) => {
  try {
    // Find all tags and include associated product data
    const tagsData = await Tag.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(tagsData);
  } catch (err) {
    res.status(500).json(err); // Internal server error if something goes wrong
  }
});

// GET one tag by ID
router.get('/:id', async (req, res) => {
  try {
    // Find one tag by its id and include associated product data
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!tagData) {
      // If no tag found, send 404 status with a message
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    // Send the tag data if found
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err); // Internal server error if something goes wrong
  }
});

// POST a new tag
router.post('/', async (req, res) => {
  try {
    // Create a new tag with the request body
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag);
  } catch (err) {
    res.status(400).json(err); // Bad request if request body is invalid
  }
});

// PUT (update) a tag's name by ID
router.put('/:id', async (req, res) => {
  try {
    // Update a tag's name by its id with the request body
    const updatedTag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!updatedTag[0]) {
      // If no tag found with the id, send 404 status with a message
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    // Send success message if tag updated successfully
    res.status(200).json({ message: 'Tag updated successfully!' });
  } catch (err) {
    res.status(500).json(err); // Internal server error if something goes wrong
  }
});

// DELETE a tag by ID
router.delete('/:id', async (req, res) => {
  try {
    // Delete a tag by its id
    const deletedTag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedTag) {
      // If no tag found with the id, send 404 status with a message
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    // Send success message if tag deleted successfully
    res.status(200).json({ message: 'Tag deleted successfully!' });
  } catch (err) {
    res.status(500).json(err); // Internal server error if something goes wrong
  }
});

module.exports = router;
