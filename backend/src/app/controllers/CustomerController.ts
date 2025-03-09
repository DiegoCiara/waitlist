import { Request, Response } from 'express';
import Customer from '@entities/Customer';
import User from '@entities/User';

interface CustomerInterface {
  name: string;
  email: string;
  phone: string;
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
      const userId = req.header('userId');

      if (!userId) {
        res.status(400).json({ message: 'ID não informado.' });
        return;
      }

      const user = await User.findOne(userId);

      if (!user) {
        res
          .status(401)
          .json({ message: 'Usuário responsável não encontrado.' });
        return;
      }

      const { name, email, phone }: CustomerInterface = req.body;

      if (!name || !email || !phone) {
        res.status(400).json({ message: 'Dados inválidos.' });
        return;
      }

      const customer_finded = await Customer.findOne({
        where: [
          { email },
          { phone: phone.replace(/\D/g, '') }, // Normalizando o telefone
        ],
      });

      console.log(customer_finded, phone);
      if (customer_finded) {
        res.status(401).json({ message: 'Você já se cadastrou na lista' });
        return;
      }

      const customer = await Customer.create({
        name,
        email,
        phone: phone.replace(/\D/g, ''), // Remove tudo que não for número
        user,
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
      const userId = req.header('userId');

      console.log('aaaaaaaaaaaaaaa', userId);
      if (!userId) {
        res.status(400).json({ message: 'ID não informado.' });
        return;
      }

      const user = await User.findOne(userId);

      if (!user) {
        res
          .status(401)
          .json({ message: 'Usuário responsável não encontrado.' });
        return;
      }

      const customers = await Customer.count({
        where: { user: { id: userId } },
      });

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
