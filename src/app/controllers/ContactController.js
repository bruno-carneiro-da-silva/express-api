const ContactsRepository = require('../repositories/ContactsRepository');

class ContactController{
  async index(request, response){
    const { orderBy } = request.query;
    const contacts = await ContactsRepository.findAll(orderBy);
    return response.json(contacts);
  }
  async show(request, response){
    const {id} = request.params;
    const contact = await ContactsRepository.findById(id);

    if(!contact){
      return response.status(404).json({error: 'Contact not found'});
    }
    response.json(contact);

  }
  async store(request, response){
    const {name, email, phone, category_id} = request.body;

    if(!name){
      return response.status(400).json({error: 'Name is required'});
    }
    const contactExists = await ContactsRepository.findByEmail(email);
    if(contactExists){
      return response.status(400).json({error: 'This email is already in use'});
    }

    const contact = await ContactsRepository.create({name, email, phone, category_id});
    response.json(contact);

  }
  async update(request, response){
    const {name, email, phone, category_id} = request.body;
    const {id} = request.params;
    const contactExists = await ContactsRepository.findById(id);

    if(!contactExists){
      return response.status(404).json({error: 'Contact not found'});
    }

    if(!name){
      return response.status(400).json({error: 'Name is required'});
    }

    if(!email){
      return response.status(400).json({error: 'Email is required'});
    }

    const emailExists = await ContactsRepository.findByEmail(email);

    if(emailExists && emailExists.id !== id){
      return response.status(400).json({error: 'This email is already in use'});
    }
    const contact = await ContactsRepository.update(id, {name, email, phone, category_id});
    response.json(contact);

  }
  async delete(request, response){
    const {id} = request.params;

    await ContactsRepository.delete(id);
    response.sendStatus(204);
  }
}

//singleton
module.exports = new ContactController();
