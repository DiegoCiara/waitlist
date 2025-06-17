import Router from 'express';
import ProductController from '@controllers/ProductController';

const routes = Router();

routes.post('/', ProductController.create);
routes.get('/', ProductController.getProducts);

export default routes;
