const db = require('../../database');

class CategoriesRepository{
  async findAll(){
    const rows = await db.query('SELECT * FROM categories ORDER BY name');
    return rows;
  }
  async listOne(){}
  async create({
    name
  }){
    const [row] = await db.query(`
      INSERT INTO categories(name)
      VALUES($1)
      RETURNING *
    `, [name]
    );
    return row;
  }
  async update(){}
  async delete(){}
}

module.exports = new CategoriesRepository();
