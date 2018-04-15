const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Category = require('../models/category');
const Product = require('../models/product');

// Все продукты
router.get('/', (req, res, next) => {
  Product.find()
    .exec()
    .then(docs => {
      const total = docs.length;
      const offset = req.query.offset || 0;
      const limit = req.query.limit || total;
      const response = {
        total: docs.length,
        result: docs.slice(offset, offset + limit)
          .map(doc => {
            return {
              id: doc._id,
              createdAt: doc.createdAt,
              updatedAt: doc.updatedAt,
              status: doc.status,
              name: doc.name,
              price: doc.price,
              info: doc.info,
              subtitle: doc.subtitle,
              units: doc.units,
              images: doc.images,
              inventory: doc.inventory,
              category: doc.category
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

// Создание продукта
router.post('/', (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    info: req.body.info,
    subtitle: req.body.subtitle,
    units: req.body.units,
    images: req.body.images,
    inventory: req.body.inventory,
    category: req.body.category
  });
  product
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Продукт создан.',
        result: {
          id: result._id,
          name: result.name,
          price: result.price,
          info: result.info,
          subtitle: result.subtitle,
          units: result.units,
          images: result.images,
          inventory: result.inventory,
          category: result.category
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

// Продукт
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Product.findById(id)
    .populate('category', '_id name info')
    .exec()
    .then(doc => {
      if (!doc) {
        return res.status(404).json({
          message: 'Продукт не найден.'
        });
      }
      if (doc.category) {
        doc.category.id = doc.category._id
        delete doc.category._id
      }
      res.status(200).json({
        result: {
          id: doc._id,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
          status: doc.status,
          name: doc.name,
          price: doc.price,
          info: doc.info,
          subtitle: doc.subtitle,
          units: doc.units,
          images: doc.images,
          inventory: doc.inventory,
          category: doc.category
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

// Добавление фото в продукт
router.post('/:id/images', (req, res, next) => {
  const id = req.params.id;
  const images = req.body.images;
  if (!images) {
    return res.status(400).json({
      message: 'Неверный запрос.'
    });
  }
  Product.findById(id)
    .exec()
    .then(doc => {
      if (!doc) {
        return res.status(404).json({
          message: 'Продукт не найдена.'
        });
      }
      Product.update({
          _id: id
        }, {
          $addToSet: { images: { $each: images } }
        })
        .exec()
        .then(result => {
          res.status(200).json({
            message: 'Фотографии добавлены в продукт.'
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

// Обновление фото продукта
router.patch('/:id/images', (req, res, next) => {
  const id = req.params.id;
  const images = req.body.images;
  if (!images) {
    return res.status(400).json({
      message: 'Неверный запрос.'
    });
  }
  Product.findById(id)
    .exec()
    .then(doc => {
      if (!doc) {
        return res.status(404).json({
          message: 'Продукт не найдена.'
        });
      }
      Product.update({
          _id: id
        }, {
          $set: { images }
        })
        .exec()
        .then(result => {
          res.status(200).json({
            message: 'Фото продукта обновлены.'
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

// Обновление продукта
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
  Product.findById(id)
    .exec()
    .then(doc => {
      if (!doc) {
        return res.status(404).json({
          message: 'Продукт не найден.'
        });
      }
      Product.update({
          _id: id
        }, {
          $set: updateOps
        })
        .exec()
        .then(result => {
          res.status(200).json({
            message: 'Продукт обновлен.'
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

// Удаление продукта
// TODO удаление ссылки с категории
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Product.remove({
      _id: id
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Продукт удален.'
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