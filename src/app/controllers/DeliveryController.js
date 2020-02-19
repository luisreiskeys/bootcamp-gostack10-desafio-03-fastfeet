import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

import NewDelivery from '../jobs/NewDelivery';
import Queue from '../../lib/Queue';

class DeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const deliveries = await Delivery.findAll({
      attributes: ['id', 'product', 'start_date', 'end_date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'cep',
            'rua',
            'numero',
            'complemento',
            'estado',
            'cidade'
          ]
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validade failure' });
    }

    const { id, recipient_id, deliveryman_id, product } = await Delivery.create(
      req.body
    );

    const delivery = await Delivery.findByPk(id, {
      attributes: ['id', 'product', 'start_date', 'end_date', 'createdAt'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'cep',
            'rua',
            'numero',
            'complemento',
            'estado',
            'cidade'
          ]
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    await Queue.add(NewDelivery.key, { delivery });

    return res.json({ id, recipient_id, deliveryman_id, product });
  }

  async update(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);

    return res.json(delivery);
  }

  async delete(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(401).json({ error: 'This delivery does not exists' });
    }

    delivery.destroy();
    return res.json({ msg: 'This delivery was deleted' });
  }
}

export default new DeliveryController();
