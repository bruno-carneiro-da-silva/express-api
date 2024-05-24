const { v4: uuid } = require('uuid');

let contacts = [
  {
    id: uuid(),
    name: 'John Doe',
    email: 'bruno@gmail.com',
    phone: '123456789',
    category_id: uuid(),
  },
  {
    id: uuid(),
    name: 'bruno Doe',
    email: 'brunodoe@gmail.com',
    phone: '12345677789',
    category_id: uuid(),
  }
]

class ContactsRepository{
  findAll(){
    return new Promise((resolve) => {
      resolve(contacts)
    });
  };

  findById(id){
    return new Promise((resolve) => {
      const contact = contacts.find(contact => contact.id === id);
      resolve(contact);
    });
  };

  findByEmail(email){
    return new Promise((resolve) => {
      const contact = contacts.find(contact => contact.email === email);
      resolve(contact);
    });
  };

  create({name, email, phone, category_id}){
    return new Promise((resolve) => {
      const newContact = {
        id: uuid(),
        name,
        email,
        phone,
        category_id
      };
      contacts.push(newContact);
      resolve(newContact);
    });
  };

  update(id, {name, email, phone, category_id}){
    return new Promise((resolve) => {
     const updatedContact = {
        id,
        name,
        email,
        phone,
        category_id
      };
      contacts = contacts.map(contact => contact.id === id ? updatedContact : contact);
      resolve(updatedContact);
    });
  }

  delete(id){
    return new Promise((resolve) => {
      contacts = contacts.filter(contact => contact.id !== id);
      resolve();
    })
  }

}

module.exports = new ContactsRepository();
