const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

// Все заказы
router.get('/', (req, res, next) => {
  Order.find()
    .populate({
      path: 'items.product',
      model: 'Product'
    })
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
              info: doc.info,
              totalAmount: doc.totalAmount,
              items: doc.items.map(item => {
                const product = item.product || {}
                return {
                  quantity: item.quantity,
                  amount: item.amount,
                  product: {
                    id: product._id,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt,
                    name: product.name,
                    price: product.price,
                    info: product.info,
                    subtitle: product.subtitle,
                    units: product.units,
                    images: product.images,
                    inventory: product.inventory
                  }
                }
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

// Создание заказа
router.post('/', (req, res, next) => {
  const customerId = req.body.customerId;
  const products = req.body.products;
  let items = [];
  let totalAmount = 0;
  let ids = []
  products.forEach(el => ids.push(el.productId));
  Product.find({
    '_id': { $in: ids }
  }, (err, results) => {
    products.forEach(el => {
      const quantity = el.quantity;
      const info = el.info;
      const product = results.find(result => result._id == el.productId);
      if (product) {
        const amount = Number(quantity) * Number(product.price);
        totalAmount += amount;
        items.push({
          quantity,
          amount,
          info,
          product
        })
      }
    });
    const order = new Order({
      _id: mongoose.Types.ObjectId(),
      info: req.body.info,
      totalAmount,
      items
    });
    order.save()
      .then(result => {
        res.status(201).json({
          message: 'Заказ создан.',
          result: {
            id: result._id,
            info: result.info,
            totalAmount: result.totalAmount,
            items: result.items
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
});

// Заказ
router.get('/:id', (req, res, next) => {
  Order.findById(req.params.id)
    .populate({
      path: 'items.product',
      model: 'Product'
    })
    .exec()
    .then(doc => {
      if (!doc) {
        return res.status(404).json({
          message: 'Заказ не найден.'
        });
      }
      res.status(200).json({
        result: {
          id: doc._id,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
          status: doc.status,
          info: doc.info,
          totalAmount: doc.totalAmount,
          items: doc.items.map(item => {
            const product = item.product || {}
            return {
              quantity: item.quantity,
              amount: item.amount,
              product: {
                id: product._id,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
                name: product.name,
                price: product.price,
                info: product.info,
                subtitle: product.subtitle,
                units: product.units,
                images: product.images,
                inventory: product.inventory
              }
            }
          })
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

// Обновление статуса
router.patch('/:id/status', (req, res, next) => {
  const id = req.params.id;
  const status = req.body.status;
  if (!status) {
    return res.status(400).json({
      message: 'Неверный запрос.'
    });
  }
  Order.findById(id)
    .exec()
    .then(doc => {
      if (!doc) {
        return res.status(404).json({
          message: 'Заказ не найден.'
        });
      }
      Order.update({
          _id: id
        }, {
          $set: { status }
        })
        .exec()
        .then(result => {
          res.status(200).json({
            message: 'Статус обновлен.'
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

// Удаление заказа
router.delete('/:id', (req, res, next) => {
  Order.remove({
      _id: req.params.id
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Заказ удален.'
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