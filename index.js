const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");

app.get("/", (req, res) => {
  res.send("hellow");
});

//Dummy Data
const products = [
  {
    id: "1",
    name: "Orange",
    price: 20,
  },
  {
    id: "2",
    name: "Apple",
    price: 30,
  },
];

// Show list of products
app.get("/api/products", (req, res) => {
  res.json(products);
});

//show specific products
app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const product = products.find((prod) => prod.id === id);
  if (!product) {
    return res.send("Product Not Found");
  }
  return res.json(product);
});

//Add New Product

app.use(express.json());
function validation(body) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    price: Joi.number().required(),
  });

  return schema.validate(body);
}

app.post("/api/addItem", (req, res) => {
  const { error } = validation(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  const product = {
    id: uuidv4(),
    name: req.body.name,
    price: req.body.price,
  };

  products.push(product);
  return res.json(product);
});

//Update
app.put("/api/updated/:id", (req, res) => {
  const { error } = validation(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  const index = products.findIndex((prod) => prod.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      message: "product is not found with this id",
    });
  }

  products[index].name = req.body.name;
  products[index].price = req.body.price;

  return res.json({
    product: products[index],
  });
});

app.patch("/api/productsPatch/:id", (req, res) => {
  const index = products.findIndex((prod) => prod.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      message: "product is not found with this id",
    });
  }

  let updateProduct = {
    ...products[index],
    ...req.body,
  };

  products[index] = updateProduct;

  return res.json(updateProduct);
});

//delete Specific
app.delete("/api/deleteSpecific/:id", (req, res) => {
  const product = products.find((prod) => prod.id === req.params.id);
  if (!product) {
    return res.status(404).json({
      message: "product is not found with this id",
    });
  }

  const index = products.findIndex((prod) => prod.id === req.params.id);
  products.splice(index, 1);
  return res.json(product);
});

//deleteAll
app.delete("/api/deleteAll/", (req, res) => {
  products.splice(0);
  return res.json(products);
});

app.listen(3000, () => {
  console.log("Server Started");
});
