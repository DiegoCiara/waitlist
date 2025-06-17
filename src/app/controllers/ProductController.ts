import { Request, Response } from 'express';
import Product from '@entities/Product';

interface ProductInterface {
  name: string;
  product_id: string
}

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Operações relativas às declarações
 */

class ProductController {
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
      const { name }: ProductInterface = req.body;

      if (!name ) {
        res.status(400).json({ message: 'Dados inválidos.' });
        return;
      }


      const product = await Product.create({
        name,
      }).save();


      res
        .status(201)
        .json(product);
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
  public async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const data = await Product.find();

      const products = data.map((e) => {
        return {
          id: e.id,
          name: e.name
        }
      })

      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro interno ao buscar usuário, tente novamente.' });
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
  public async delete(req: Request, res: Response): Promise<void> {
    try {

      const id = req.params.id

      const product = await Product.findOne(id);

      if (!product ) {
        res.status(400).json({ message: 'Produto não encontrado' });
        return;
      }

      await Product.softRemove(product)

      res.status(200).json({ id: product.id, message: 'Produto deletado com sucesso.' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro interno ao buscar usuário, tente novamente.' });
    }
  }
}

export default new ProductController();
