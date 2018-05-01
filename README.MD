# RESTful API with Node.js

## Usage
This repository accompanies my YouTube video series on building a RESTful API with Node.js: https://www.youtube.com/playlist?list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q

Check out the branch you're interested in (i.e. which belongs to the video in my series you just watched), ```git clone``` it and thereafter run ```npm install```.

Make sure to also add your Mongo Atlas Admin Username to a nodemon.json file (which you have to create).

```
{
    "env": {
        "MONGO_ATLAS_PW": "YOUR_MONGO_USER_PW"
    }
}
```

## Ссылки:
### Категории
GET `https://test.igorserver.ru/categories` - получение категории с продуктами
```
query `productsLimit` <Number> - для ограничения количества продуктов
```

POST `https://test.igorserver.ru/categories` - создание категории
```
body `name` <String> - название категории
body `info` <Object> - доп. информация
body `products` <Array> - ид продуктов
```

GET `https://test.igorserver.ru/categories/:id` - получение категории

GET `https://test.igorserver.ru/categories/:id/products` - получение категории с продуктами
```
query `offset`
query `limit`
```

POST `https://test.igorserver.ru/categories/:id/products` - добавление продуктов в категорию
```
body `products` <Array> - ид продуктов
```

PATCH `https://test.igorserver.ru/categories/:id` - обновление категории
```
body <Object>
```

DELETE `https://test.igorserver.ru/categories/:id` - удаление категории

### Продукты
GET `https://test.igorserver.ru/products` - получение продуктов
```
query `offset`
query `limit`
```

POST `https://test.igorserver.ru/products` - создание продукта
```
body `name` <String> - название  продукта
body `price` <Array> - цена продукта
body `info` <Object> - доп. информация
body `subtitle` <Object> - доп. текст
body `units` <Object> - юнит
body `images` <Array> - изображения
body `inventory` <Number> - кол-во
body `category` <String> - ссылка на категорию
```

GET `https://test.igorserver.ru/products/:id` - получение продукта

POST `https://test.igorserver.ru/products/:id/products` - добавление изображения
```
body `images` <Array> - ссылка на изображения
```

PATCH `https://test.igorserver.ru/products/:id` - обновление продукта
```
body <Object>
```

DELETE `https://test.igorserver.ru/products/:id` - удаление продукта

### Заказы
GET `https://test.igorserver.ru/orders` - получение заказов
```
query `offset`
query `limit`
```

POST `https://test.igorserver.ru/orders` - создание заказа
```
body `products` <Array> - массив c productId и quantity
```

GET `https://test.igorserver.ru/orders/:id` - получение заказа

PATCH `https://test.igorserver.ru/orders/:id/status` - обновление статуса заказа
```
body `status` <String>
```

DELETE `https://test.igorserver.ru/orders/:id` - удаление заказа
