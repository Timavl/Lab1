const express = require('express');
const router = express.Router();
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/itemController');

// Маршруты для работы с элементами
router.get('/', getAllItems);          // Получить все записи
router.get('/:id', getItemById);       // Получить определенную запись
router.post('/', createItem);          // Добавить запись
router.put('/:id', updateItem);        // Обновить запись
router.delete('/:id', deleteItem);     // Удалить запись

module.exports = router;