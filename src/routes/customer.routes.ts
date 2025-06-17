import Router from 'express';
import CustomerController from '@controllers/CustomerController';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';

const routes = Router();

routes.post('/', CustomerController.create);
routes.get('/count/', ensureAuthenticated, CustomerController.countUsers);

export default routes;
