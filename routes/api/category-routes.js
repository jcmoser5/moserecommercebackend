const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// find all categories
router.get('/', async (req, res) => {
  try {
    const catData = await Category.findAll({
      // be sure to include its associated Products
      include: [Product]
    });
    res.status(200).json(catData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// find one category by its `id` value
router.get('/:id', async (req, res) => {
  try {
    const catData = await Category.findOne({
      where: {
        id: req.params.id
      },
      // be sure to include its associated Products
      include: [Product]
    });
    if (!catData) {
      res.status(404).json({ message: `No category found with that id` });
      return;
    }
    res.status(200).json(catData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// create a new category
router.post('/', async (req, res) => {
  try{
    const { category_name } = req.body;
    if (!category_name) {
      res.status(404).json({ message: `Needs value for category_name` });
      return;
    }
    const catData = await Category.create(req.body);
    res.status(200).json(catData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const { category_name } = req.body;
    if (!category_name) {
      res.status(404).json({ message: `Needs value for category_name` });
      return;
    }
    const catData = await Category.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    if (!catData[0]) {
      res.status(404).json({ message: `No category found with that id` });
      return;
    }
    res.status(200).json(catData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// delete a category by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const catData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!catData) {
      res.status(404).json({ message: `No category found with that id` });
      return;
    }
    res.status(200).json(catData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
