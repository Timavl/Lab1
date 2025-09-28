import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = '/api/items';

function App() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [activeView, setActiveView] = useState('list');
  const [loading, setLoading] = useState(false);

  // Загрузка всех элементов
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setItems(response.data.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      alert('Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка элемента по ID
  const fetchItemById = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      setSelectedItem(response.data.data);
      setActiveView('details');
    } catch (error) {
      console.error('Error fetching item:', error);
      alert('Ошибка при загрузке элемента');
    } finally {
      setLoading(false);
    }
  };

  // Создание элемента
  const createItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(API_URL, formData);
      setFormData({ name: '', description: '', price: '' });
      fetchItems();
      setActiveView('list');
      alert('Элемент успешно создан!');
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Ошибка при создании элемента');
    } finally {
      setLoading(false);
    }
  };

  // Обновление элемента
  const updateItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${API_URL}/${selectedItem.id}`, formData);
      setFormData({ name: '', description: '', price: '' });
      setSelectedItem(null);
      setIsEditing(false);
      fetchItems();
      setActiveView('list');
      alert('Элемент успешно обновлен!');
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Ошибка при обновлении элемента');
    } finally {
      setLoading(false);
    }
  };

  // Удаление элемента
  const deleteItem = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот элемент?')) {
      setLoading(true);
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchItems();
        if (selectedItem && selectedItem.id === id) {
          setSelectedItem(null);
          setActiveView('list');
        }
        alert('Элемент успешно удален!');
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Ошибка при удалении элемента');
      } finally {
        setLoading(false);
      }
    }
  };

  // Заполнение формы для редактирования
  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price
    });
    setIsEditing(true);
    setActiveView('form');
  };

  // Сброс формы и возврат к списку
  const handleCancel = () => {
    setFormData({ name: '', description: '', price: '' });
    setSelectedItem(null);
    setIsEditing(false);
    setActiveView('list');
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="App">
      {/* Красивый хедер с градиентом */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">📦</div>
            <div>
              <h1>Inventory Manager</h1>
              <p>Система управления элементами</p>
            </div>
          </div>
          
          {/* Статистика - теперь выше и более заметная */}
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-icon total-icon"></div>
              <div className="stat-info">
                <span className="stat-number">{items.length}</span>
                <span className="stat-label">Всего элементов</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon price-icon"></div>
              <div className="stat-info">
                <span className="stat-number">
                  {items.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2)} ₽
                </span>
                <span className="stat-label">Общая стоимость</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Волновой дизайн */}
        <div className="wave"></div>
      </header>

      {/* Навигация */}
      <nav className="navigation">
        <button 
          className={`nav-btn ${activeView === 'list' ? 'active' : ''}`}
          onClick={() => setActiveView('list')}
        >
          <span className="btn-icon list-icon"></span>
          Список элементов
          {items.length > 0 && <span className="badge">{items.length}</span>}
        </button>
        <button 
          className={`nav-btn ${activeView === 'form' ? 'active' : ''}`}
          onClick={() => {
            setFormData({ name: '', description: '', price: '' });
            setIsEditing(false);
            setActiveView('form');
          }}
        >
          <span className="btn-icon add-icon"></span>
          Добавить элемент
        </button>
        <button 
          className={`nav-btn ${activeView === 'details' ? 'active' : ''}`}
          onClick={() => selectedItem ? setActiveView('details') : setActiveView('list')}
          disabled={!selectedItem}
        >
          <span className="btn-icon details-icon"></span>
          Детали элемента
        </button>
      </nav>

      <main className="main-content">
        {/* Индикатор загрузки */}
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Загрузка...</p>
          </div>
        )}

        {/* Список элементов */}
        {activeView === 'list' && (
          <div className="items-list">
            <div className="section-header">
              <h2>Список элементов</h2>
              <p>Управление вашей коллекцией предметов</p>
            </div>
            
            {items.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"></div>
                <h3>Список пуст</h3>
                <p>Добавьте первый элемент, чтобы начать работу</p>
                <button 
                  className="btn-primary"
                  onClick={() => setActiveView('form')}
                >
                  Добавить элемент
                </button>
              </div>
            ) : (
              <div className="items-grid">
                {items.map(item => (
                  <div key={item.id} className="item-card">
                    <div className="card-header">
                      <h3>{item.name}</h3>
                      <span className="price-tag">{parseFloat(item.price).toFixed(2)} ₽</span>
                    </div>
                    
                    <div className="card-body">
                      <p className="description">
                        {item.description || 'Описание отсутствует'}
                      </p>
                      <div className="item-meta">
                        <span className="meta-item">ID: {item.id}</span>
                        <span className="meta-item">
                          Обновлен: {new Date(item.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="card-actions">
                      <button 
                        onClick={() => fetchItemById(item.id)} 
                        className="btn-action btn-view"
                        title="Просмотреть детали"
                      >
                        <span className="action-icon view-icon"></span>
                        Детали
                      </button>
                      <button 
                        onClick={() => handleEdit(item)} 
                        className="btn-action btn-edit"
                        title="Редактировать"
                      >
                        <span className="action-icon edit-icon"></span>
                        Редактировать
                      </button>
                      <button 
                        onClick={() => deleteItem(item.id)} 
                        className="btn-action btn-delete"
                        title="Удалить"
                      >
                        <span className="action-icon delete-icon"></span>
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Форма создания/редактирования */}
        {activeView === 'form' && (
          <div className="item-form">
            <div className="section-header">
              <h2>{isEditing ? 'Редактировать элемент' : 'Добавить новый элемент'}</h2>
              <p>Заполните информацию о элементе</p>
            </div>
            
            <form onSubmit={isEditing ? updateItem : createItem}>
              <div className="form-group">
                <label>Название элемента</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Введите название элемента"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Добавьте описание элемента (необязательно)"
                  rows="4"
                />
              </div>
              
              <div className="form-group">
                <label>Цена (₽)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Загрузка...' : (isEditing ? 'Сохранить изменения' : 'Создать элемент')}
                </button>
                <button 
                  type="button" 
                  onClick={handleCancel} 
                  className="btn-secondary"
                  disabled={loading}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Детали элемента */}
        {activeView === 'details' && selectedItem && (
          <div className="items-list">
            <div className="section-header">
              <h2>Детали элемента</h2>
              <p>Полная информация о выбранном элементе</p>
            </div>
            
            <div className="detail-card">
              <div className="detail-header">
                <h3>{selectedItem.name}</h3>
                <span className="detail-price">{parseFloat(selectedItem.price).toFixed(2)} ₽</span>
              </div>
              
              <div className="detail-content">
                <div className="detail-section">
                  <h4>Описание</h4>
                  <p>{selectedItem.description || 'Описание отсутствует'}</p>
                </div>
                
                <div className="detail-info">
                  <div className="info-item">
                    <span className="info-label">ID элемента:</span>
                    <span className="info-value">{selectedItem.id}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Создан:</span>
                    <span className="info-value">{new Date(selectedItem.created_at).toLocaleString()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Обновлен:</span>
                    <span className="info-value">{new Date(selectedItem.updated_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-actions">
                <button onClick={() => handleEdit(selectedItem)} className="btn-primary">
                  Редактировать
                </button>
                <button onClick={() => deleteItem(selectedItem.id)} className="btn-danger">
                  Удалить
                </button>
                <button onClick={() => setActiveView('list')} className="btn-secondary">
                  Назад к списку
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>© 2025 Inventory Manager | Система управления элементами</p>
      </footer>
    </div>
  );
}

export default App;
