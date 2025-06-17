import Router from 'express';
import ProductController from '@controllers/ProductController';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';

const routes = Router();

routes.post('/', ensureAuthenticated, ProductController.create);
routes.get('/', ensureAuthenticated, ProductController.getProducts);
routes.delete('/:id', ensureAuthenticated, ProductController.delete);

export default routes;
