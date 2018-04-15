const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Category = require('../models/category');
const Product = require('../models/product');

// Весь каталог с продуктами, с лимитом продуктов
router.get('/', (req, res, next) => {
  const limit = req.query.productsLimit;
  Category.find()
    .populate('products')
    .exec()
    .then(docs => {
      const response = {
        result: docs.map(doc => {
          return {
            id: doc._id,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            status: doc.status,
            name: doc.name,
            info: doc.info,
            productsTotal: doc.products.length,
            products: doc.products.slice(0, limit).map(product => {
              return {
                id: product._id,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
                status: product.status,
                name: product.name,
                price: product.price,
                info: product.info,
                subtitle: product.subtitle,
                units: product.units,
                images: product.images,
                inventory: product.inventory
              };
            })
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Создание категории
router.post('/', (req, res, next) => {
  const category = new Category({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    info: req.body.info,
    products: req.body.products
  });
  category
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Категория создана.',
        result: {
          id: result._id,
          name: result.name,
          price: result.info,
          products: result.products
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Категория
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Category.findById(id)
    .exec()
    .then(doc => {
      if (!doc) {
        return res.status(404).json({
          message: 'Категория не найдена.'
        });
      }
      res.status(200).json({
        result: {
          id: doc._id,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
          status: doc.status,
          name: doc.name,
          info: doc.info
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Продукты категории
router.get('/:id/products', (req, res, next) => {
  const id = req.params.id;
  Category.findById(id)
    .populate('products')
    .exec()
    .then(doc => {
      if (!doc) {
        return res.status(404).json({
          message: 'Категория не найдена.'
        });
      }
      const total = doc.products.length;
      const offset = req.query.offset || 0;
      const limit = req.query.limit || total;
      const products = doc.products
        .slice(offset, offset + limit)
        .map(product => {
          return {
            id: product._id,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            status: product.status,
            name: product.name,
            price: product.price,
            info: product.info,
            subtitle: product.subtitle,
            units: product.units,
            images: product.images,
            inventory: product.inventory
          };
        })
      res.status(200).json({
        total,
        result: products,
        category: {
          id: doc._id,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
          status: doc.status,
          name: doc.name,
          info: doc.info
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Добавление продуктов в категорию
router.post('/:id/products', (req, res, next) => {
  const id = req.params.id;
  const products = req.body.products;
  if (!products) {
    return res.status(400).json({
      message: 'Неверный запрос.'
    });
  }
  Category.findById(id)
    .exec()
    .then(doc => {
      if (!doc) {
        return res.status(404).json({
          message: 'Категория не найдена.'
        });
      }
      Category.update({
          _id: id
        }, {
          $addToSet: { products: { $each: products } }
        })
        .exec()
        .then(result => {
          res.status(200).json({
            message: 'Продукты добавлены в категорию.'
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
    }).catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Обновление продуктов категории
router.patch('/:id/products', (req, res, next) => {
  const id = req.params.id;
  const products = req.body.products;
  if (!products) {
    return res.status(400).json({
      message: 'Неверный запрос.'
    });
  }
  Category.findById(id)
    .exec()
    .then(doc => {
      if (!doc) {
        return res.status(404).json({
          message: 'Категория не найдена.'
        });
      }
      Category.update({
          _id: id
        }, {
          $set: { products }
        })
        .exec()
        .then(result => {
          res.status(200).json({
            message: 'Продукты категории обновлены.'
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
    }).catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Обновление категории
router.patch('/:id', (req, res, next) => {
  const id = req.params.id;
  const updateOps = {};
  for (const key in req.body) {
    const value = req.body[key];
    if (value && typeof value === 'object' && value.constructor === Object) {
      for (const okey in value) {
        updateOps[`${key}.${okey}`] = value[okey];
      }
    } else {
      updateOps[key] = req.body[key];
    }
  }
  Category.findById(id)
    .exec()
    .then(doc => {
      if (!doc) {
        return res.status(404).json({
          message: 'Категория не найдена.'
        });
      }
      Category.update({
          _id: id
        }, {
          $set: updateOps
        })
        .exec()
        .then(result => {
          res.status(200).json({
            message: 'Категория обновлена.'
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
    }).catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Удаление категории
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Category.remove({
      _id: id
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Категория удалена.'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;