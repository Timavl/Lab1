const pool = require('../config/database');

class Item {
  static async getAll() {
    const result = await pool.query('SELECT * FROM items ORDER BY id');
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(itemData) {
    const { name, description, price } = itemData;
    const result = await pool.query(
      'INSERT INTO items (name, description, price) VALUES ($1, $2, $3) RETURNING *',
      [name, description, price]
    );
    return result.rows[0];
  }

  static async update(id, itemData) {
    const { name, description, price } = itemData;
    const result = await pool.query(
      'UPDATE items SET name = $1, description = $2, price = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [name, description, price, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Item;