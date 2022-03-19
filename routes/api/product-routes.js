const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findAll({
      include: [Category, Tag]
    });
    res.status(200).json(productData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findOne({
      where: {
        id: req.params.id
      },
      include: [Category, Tag]
    });
    if (!productData) {
      res.status(404).json({ message: `No product found with that id` });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
     category_id: 1,
      tagIds: [1, 2, 3, 4] (optional)
    }
  */
    try {
      const { product_name, price, stock, category_id, tagIds } = req.body;
      if (!product_name || !price || !stock || !category_id) {
        res.status(404).json({ message: `Needs values for product_name, price, stock, category_id` });
        return;
      }
      const productData = await Product.create(
        {
          product_name,
          price,
          stock,
          category_id
        }
      );
      if (!tagIds.length) {
        res.status(200).json(productData);
      return;
    }
    const productTagIdArr = tagIds.map((tag_id) => {
      return {
        product_id: productData.id,
        tag_id
      };
    });
    const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
    res.status(200).json(productTagIds);
  } catch (err) {
      console.log(err);
      res.status(500).json(err);
  }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    const { product_name, price, stock, category_id, tagIds } = req.body;
    if (!product_name && !price && !stock && !category_id && !tagIds) {
      res.status(404).json({ message: `Please send at least one value to update from the following: product_name, price, stock, category_id, tagIds` });
      return;
    }
    const productData = await Product.update(
      {
        product_name,
        price,
        stock,
        category_id
      },
      {
        where: {
          id: req.params.id,
      },
    });
    
    if (!productData) {
      res.status(404).json({ message: `No product found with that id` });
      return;
    }

if (!tagIds.length) {
  res.status(200).json(productData);
  return;
}

    const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });

    const productTagIds = productTags.map(({ tag_id }) => tag_id);

    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id
        };
      });

    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);

    const updatedProductTags = await Promise.all([
      ProductTag.destroy({
        where: {
          id: productTagsToRemove
        }
      }),
      ProductTag.bulkCreate(newProductTags),
    ]);

    res.status(200).json(updatedProductTags);
  } catch(err) {
      console.log(err);
      res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!productData) {
      res.status(404).json({ message: `No product found with that id` });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
