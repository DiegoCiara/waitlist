import Router from 'express';
import CustomerController from '@controllers/CustomerController';

const routes = Router();

routes.post('/', CustomerController.create);
routes.get('/count', CustomerController.countUsers);

export default routes;
