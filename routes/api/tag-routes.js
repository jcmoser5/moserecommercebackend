const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// find all tags
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      // be sure to include its associated Product data
      include: [Product]
    });
    res.status(200).json(tagData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// find a single tag by its `id`
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      where: {
        id: req.params.id
      },
      // be sure to include its associated Product data
      include: [Product]
    });
    if (!tagData) {
      res.status(404).json({ message: `No product found with that id` });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// create a new tag
router.post('/', async (req, res) => {
  try {
    const { tag_name } = req.body;
    if (!tag_name) {
      res.status(404).json({ message: `Needs value for tag_name` });
      return;
    }
    const tagData = await Tag.create(
      {
        tag_name
      }
    );
    res.status(200).json(tagData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const { tag_name } = req.body;
    if (!tag_name) {
      res.status(404).json({ message: `Needs value for tag_name` });
      return;
    }
    const tagData = await Tag.update(
      {
        tag_name
      }, 
      {
        where: {
          id: req.params.id
        }
      }
      );
    if (!tagData[0]) {
      res.status(404).json({ message: `No tag found with that id` });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// delete on tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!tagData) {
      res.status(404).json({ message: `No tag found with that id` });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
