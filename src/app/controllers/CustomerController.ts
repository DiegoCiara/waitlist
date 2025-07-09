import { Request, Response } from 'express';
import Customer from '@entities/Customer';
import Product from '@entities/Product';

interface CustomerInterface {
  name: string;
  email: string;
  phone: string;
  product_id: string
  metadata: any
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
      const { name, email, phone, product_id, metadata }: CustomerInterface = req.body;

      if (!name || !product_id|| !phone ) {
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
        email: email || '',
        phone: phone.replace(/\D/g, ''), // Remove tudo que não for número
        product,
        metadata,
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
  public async getUsers(req: Request, res: Response): Promise<void> {
    try {

      const id = req.params.id

      const products = await Product.findOne(id, { relations: ['customers' ]})

      if (!products) {
        res
          .status(401)
          .json({ message: 'Produto não encontrado.' });
        return;
      }

      res.status(200).json(products.customers);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro interno ao buscar usuário, tente novamente.' });
    }
  }
}

export default new CustomerController();
