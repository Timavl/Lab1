const Item = require('../models/Item');

// Получить все записи
const getAllItems = async (req, res) => {
  try {
    const items = await Item.getAll();
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении записей',
      error: error.message
    });
  }
};

// Получить определенную запись
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.getById(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Запись не найдена'
      });
    }
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении записи',
      error: error.message
    });
  }
};

// Добавить запись
const createItem = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    
    // Валидация
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Имя и цена обязательны для заполнения'
      });
    }
    
    const newItem = await Item.create({ name, description, price });
    
    res.status(201).json({
      success: true,
      message: 'Запись успешно создана',
      data: newItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании записи',
      error: error.message
    });
  }
};

// Обновить запись
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    
    // Проверка существования записи
    const existingItem = await Item.getById(id);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Запись не найдена'
      });
    }
    
    const updatedItem = await Item.update(id, { 
      name: name || existingItem.name,
      description: description !== undefined ? description : existingItem.description,
      price: price || existingItem.price
    });
    
    res.json({
      success: true,
      message: 'Запись успешно обновлена',
      data: updatedItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении записи',
      error: error.message
    });
  }
};

// Удалить запись
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Проверка существования записи
    const existingItem = await Item.getById(id);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Запись не найдена'
      });
    }
    
    const deletedItem = await Item.delete(id);
    
    res.json({
      success: true,
      message: 'Запись успешно удалена',
      data: deletedItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении записи',
      error: error.message
    });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};