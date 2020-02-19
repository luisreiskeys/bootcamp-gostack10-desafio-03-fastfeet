import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      rua: Yup.string().required(),
      numero: Yup.number().required(),
      complemento: Yup.string(),
      estado: Yup.string().required(),
      cidade: Yup.string().required(),
      cep: Yup.string()
        .required()
        .length(8)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validade failure' });
    }
    const {
      id,
      name,
      numero,
      rua,
      complemento,
      estado,
      cidade,
      cep
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      rua,
      numero,
      complemento,
      estado,
      cidade,
      cep
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      rua: Yup.string(),
      numero: Yup.number(),
      complemento: Yup.string(),
      estado: Yup.string(),
      cidade: Yup.string(),
      cep: Yup.string().length(8)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validade failure' });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists.' });
    }
    const {
      id,
      name,
      rua,
      numero,
      complemento,
      estado,
      cidade,
      cep
    } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      rua,
      numero,
      complemento,
      estado,
      cidade,
      cep
    });
  }
}

export default new RecipientController();
