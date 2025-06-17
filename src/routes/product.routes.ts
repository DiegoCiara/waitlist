import Router from 'express';
import ProductController from '@controllers/ProductController';

const routes = Router();

routes.post('/', ProductController.create);
routes.get('/', ProductController.getProducts);
routes.get('/:id', ProductController.delete);

export default routes;
