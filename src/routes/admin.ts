import { Router } from "express";
import * as auth from "../controllers/auth";
import * as contact from "../controllers/ContactController";
import * as category from "../controllers/CategoryController";
import * as supplier from "../controllers/SupliersController";
import * as product from "../controllers/ProductController";
import * as transaction from "../controllers/TransactionController";
import * as employee from "../controllers/EmployeeController";
import * as sales from "../controllers/SalesController";
import * as user from "../controllers/UsersController";
import * as soldItem from "../controllers/SoldItemController";
import * as stock from "../controllers/StockController";

const router = Router();

router.post("/login", auth.login);

router.get("/suppliers", auth.validateLogin, supplier.index);
router.get("/suppliers/:id", auth.validateLogin, supplier.show);
router.post("/suppliers", auth.validateLogin, supplier.store);
router.put("/suppliers/:id", auth.validateLogin, supplier.update);
router.delete("/suppliers/:id", auth.validateLogin, supplier.deleteSupplier);

router.get("/products", auth.validateLogin, product.index);
router.get("/products/:id", auth.validateLogin, product.show);
router.post("/products", auth.validateLogin, product.store);
router.put("/products/:id", auth.validateLogin, product.update);
router.delete("/products/:id", auth.validateLogin, product.deleteProduct);

router.get("/sales", auth.validateLogin, sales.index);
router.get("/sales/:id", auth.validateLogin, sales.show);
router.post("/sales", auth.validateLogin, sales.store);
router.put("/sales/:id", auth.validateLogin, sales.update);
router.delete("/sales/:id", auth.validateLogin, sales.deleteSale);

router.get("/transactions", auth.validateLogin, transaction.index);
router.get("/transactions/:id", auth.validateLogin, transaction.show);
router.post("/transactions", auth.validateLogin, transaction.store);
router.put("/transactions/:id", auth.validateLogin, transaction.update);
router.delete(
  "transactions/:id",
  auth.validateLogin,
  transaction.deleteTransaction
);

router.get("/users", auth.validateLogin, user.index);
router.get("/users/:id", auth.validateLogin, user.show);
router.post("/users", auth.validateLogin, user.store);
router.put("/users/:id", auth.validateLogin, user.update);
router.delete("/users/:id", auth.validateLogin, user.deleteUser);

router.get("/employees", auth.validateLogin, employee.index);
router.get("/employees/:id", auth.validateLogin, employee.show);
router.post("/employees", auth.validateLogin, employee.store);
router.put("/employees/:id", auth.validateLogin, employee.update);
router.delete("/employees/:id", auth.validateLogin, employee.deleteEmployee);

router.get("/sold_items", auth.validateLogin, soldItem.index);
router.get("/sold_items/:id", auth.validateLogin, soldItem.show);
router.post("/sold_items", auth.validateLogin, soldItem.store);
router.put("/sold_items/:id", auth.validateLogin, soldItem.update);
router.delete(
  "/products/sold_items/:id",
  auth.validateLogin,
  soldItem.deleteSoldItem
);

router.get("/stocks", auth.validateLogin, stock.index);
router.get("/stocks/:id", auth.validateLogin, stock.show);
router.post("/stocks", auth.validateLogin, stock.store);
router.put("/stocks/:id", auth.validateLogin, stock.update);
router.delete("/stocks/:id", auth.validateLogin, stock.deleteStock);

router.get("/contacts", auth.validateLogin, contact.index);
router.get("/contacts/:id", auth.validateLogin, contact.show);
router.post("/contacts", auth.validateLogin, contact.store);
router.put("/contacts/:id", auth.validateLogin, contact.update);
router.delete("/contacts/:id", auth.validateLogin, contact.deleteContact);

router.get("/categories", category.index);
router.get("/categories/:id", category.show);
router.post("/categories", category.store);
router.put("/categories/:id", category.update);
router.delete("/categories/:id", category.deleteCategory);

export default router;
