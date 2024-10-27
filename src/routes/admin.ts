import { Router } from "express";
import * as auth from "../controllers/auth";
import * as contact from "../controllers/ContactController";
import * as category from "../controllers/CategoryController";
import * as supplier from "../controllers/SupliersController";
import * as product from "../controllers/ProductController";
import * as transaction from "../controllers/TransactionController";
import * as employee from "../controllers/EmployeeController";
import * as sales from "../controllers/SalesController";
import * as company from "../controllers/CompanyController";
import * as soldItem from "../controllers/SoldItemController";
import * as stock from "../controllers/StockController";
import * as role from "../controllers/RoleController";
import { sanitizeBody, validateId, validateUser } from "../middlewares";

const router = Router();

router.post("/login", auth.login);
router.post("/refresh-token", auth.refreshToken);

router.get("/roles", auth.validate, auth.validate, role.index);
router.get("/roles/:id", auth.validate, role.show);
router.post("/roles", auth.validate, role.store);
router.put("/roles/:id", auth.validate, role.update);
router.delete("/roles/:id", auth.validate, role.deleteRole);

router.post("/send_code", auth.sendVerificationCode);
router.post("/verify_password", auth.verifyCodeAndResetPassword);

router.get("/suppliers", auth.validate, supplier.index);
router.get("/suppliers/:id", auth.validate, supplier.show);
router.get("/suppliers/:cnpj", auth.validate, supplier.showByCnpj);
router.post("/suppliers", auth.validate, supplier.store);
router.put("/suppliers/:id", auth.validate, supplier.update);
router.delete("/suppliers/:id", auth.validate, supplier.deleteSupplier);

router.get("/products", auth.validate, product.index);
router.get("/products/:id", auth.validate, product.show);
router.post("/products", auth.validate, product.store);
router.put("/products/:id", auth.validate, product.update);
router.delete("/products/:id", auth.validate, product.deleteProduct);

router.get("/sales", auth.validate, sales.index);
router.get("/sales/:id", auth.validate, sales.show);
router.post("/sales", auth.validate, sales.store);
router.put("/sales/:id", auth.validate, sales.update);
router.delete("/sales/:id", auth.validate, sales.deleteSale);

router.get("/transactions", auth.validate, transaction.index);
router.get("/transactions/:id", auth.validate, transaction.show);
router.post("/transactions", auth.validate, transaction.store);
router.put("/transactions/:id", auth.validate, transaction.update);
router.delete(
  "/transactions/:id",
  auth.validate,
  transaction.deleteTransaction
);

router.get("/companies", auth.validate, company.index);
router.get("/companies/:id", validateId, auth.validate, company.show);
router.post(
  "/companies",
  sanitizeBody([
    "firstName",
    "lastName",
    "emailAdmin",
    "phoneNumberAdmin",
    "password",
    "nameCompany",
    "emailCompany",
    "phoneNumberCompany",
    "addressCompany",
    "role",
  ]),
  validateUser,
  company.store
);
router.put(
  "/companies/:id",
  validateId,
  sanitizeBody([
    "username",
    "firstName",
    "lastName",
    "emailAdmin",
    "phoneNumberAdmin",
    "password",
    "nameCompany",
    "emailCompany",
    "phoneNumberCompany",
    "addressCompany",
    "role",
  ]),
  validateUser,
  auth.validate,
  company.update
);
router.delete("/companies/:id", validateId, auth.validate, company.deleteUser);

router.get("/employees", auth.validate, employee.index);
router.get("/employees/:id", auth.validate, employee.show);
router.post("/employees", auth.validate, employee.store);
router.put("/employees/:id", auth.validate, employee.update);
router.delete("/employees/:id", auth.validate, employee.deleteEmployee);

router.get("/sold_items", auth.validate, soldItem.index);
router.get("/sold_items/:id", auth.validate, soldItem.show);
router.post("/sold_items", auth.validate, soldItem.store);
router.put("/sold_items/:id", auth.validate, soldItem.update);
router.delete(
  "/products/sold_items/:id",
  auth.validate,
  soldItem.deleteSoldItem
);

router.get("/stocks", auth.validate, stock.index);
router.get("/stocks/:id", auth.validate, stock.show);
router.post("/stocks", auth.validate, stock.store);
router.put("/stocks/:id", auth.validate, stock.update);
router.delete("/stocks/:id", auth.validate, stock.deleteStock);

router.get("/contacts", auth.validate, contact.index);
router.get("/contacts/:id", auth.validate, contact.show);
router.post("/contacts", auth.validate, contact.store);
router.put("/contacts/:id", auth.validate, contact.update);
router.delete("/contacts/:id", auth.validate, contact.deleteContact);

router.get("/categories", category.index);
router.get("/categories/:id", category.show);
router.post("/categories", category.store);
router.put("/categories/:id", category.update);
router.delete("/categories/:id", category.deleteCategory);

export default router;
