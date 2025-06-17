import { Request, Response } from 'express';
import Customer from '@entities/Customer';
import Product from '@entities/Product';

interface CustomerInterface {
  name: string;
  email: string;
  phone: string;
  product_id: string
}

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Operações relativas às declarações
 */

class CustomerController {
  /**
   * @swagger
   * /customer:
   *   post:
   *     summary: Cria um novo cliente na lista de espera
   *     tags: [Clientes]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               phone:
   *                 type: string
   *     responses:
   *       201:
   *         description: Cliente criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *       400:
   *         description: Dados inválidos para criação do cliente
   *       401:
   *         description: Usuário não autorizado
   *       500:
   *         description: Erro ao registrar cliente
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, product_id }: CustomerInterface = req.body;

      if (!name || !product_id ) {
        res.status(400).json({ message: 'Dados inválidos.' });
        return;
      }

      const product = await Product.findOne(product_id);

      if (!product) {
        res
          .status(401)
          .json({ message: 'Produto não encontrado.' });
        return;
      }

      const customer_finded = await Customer.findOne({
        where: [
          { email, product },
          { phone: phone.replace(/\D/g, ''), product }, // Normalizando o telefone
        ],
      });

      if (customer_finded) {
        res.status(401).json({ message: 'Você já se cadastrou na lista' });
        return;
      }

      const customer = await Customer.create({
        name,
        email,
        phone: phone.replace(/\D/g, ''), // Remove tudo que não for número
        product,
      }).save();

      console.log(`Cliente ${customer.name} criado com sucesso`);

      res
        .status(201)
        .json({ id: customer.id, message: 'Cadastro realizado com sucesso' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro ao registrar a declaração, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /customers/count/}:
   *   get:
   *     summary: Quantidade de clientes por usuário
   *     tags: [Usuários]
   *     responses:
   *       200:
   *         description: Usuário encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 name:
   *                   type: string
   *                 email:
   *                   type: string
   *       404:
   *         description: Usuário não encontrado
   *       500:
   *         description: Erro interno
   */
  public async countUsers(req: Request, res: Response): Promise<void> {
    try {

      const products = await Product.find()

      if (!products) {
        res
          .status(401)
          .json({ message: 'Produto não encontrado.' });
        return;
      }

      const customers = await Promise.all(
        products.map(async (product) => {
          const count = await Customer.count({ where: { product } });
          return {
            product: product.name,
            customers_count: count
          };
        })
      );

      res.status(200).json(customers);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro interno ao buscar usuário, tente novamente.' });
    }
  }
}

export default new CustomerController();
