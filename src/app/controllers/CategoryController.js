const CategoriesRepository = require('../repositories/CategoriesRepository');

class CategoryController{
  async index(request, response){
    // List all categories
    const categories = await CategoriesRepository.findAll();
    response.json(categories);
  }
  show(request, response){
    // Get one category
    response.send('Get one category')
  }
  async store(request, response){
    // Create a new category
    const {name} = request.body;
    if(!name){
      return response.status(400).json({error: 'Name is required'});
    }
    const category = await CategoriesRepository.create({name});
    response.json(category);
  }
  update(request, response){
    // Update category
    response.send('Update category')
  }
  delete(request, response){
    // Delete category
    response.send('Delete category')
  }
}

module.exports = new CategoryController();
