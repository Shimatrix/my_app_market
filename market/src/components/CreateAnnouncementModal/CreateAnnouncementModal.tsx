import React, { useState } from 'react';
import styles from './CreateAnnouncementModal.module.scss';

interface CreateAnnouncementModalProps {
  onClose: () => void;
  announcement: { id: number; name: string; price: number; imageUrl: string; description: string };
}

const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({ onClose, announcement }) => {
  const [formData, setFormData] = useState({
    name: announcement.name,
    price: announcement.price,
    imageUrl: announcement.imageUrl,
    description: announcement.description,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const method = announcement.name ? 'PUT' : 'POST'; // Если имя пустое, значит это создание, иначе редактирование
      const url = method === 'POST' ? 'http://localhost:3000/advertisements' : `http://localhost:3000/advertisements/${announcement.id}`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onClose(); 
      } else {
        console.error('Ошибка при сохранении данных');
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
    }
  };

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        <div className={styles['modal-header']}>
          <h2>{announcement.name ? 'Редактировать объявление' : 'Создать новое объявление'}</h2>
          <button onClick={onClose} className={styles['close-button']}>
            Закрыть
          </button>
        </div>

        <div className={styles['modal-body']}>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Название"
          />
          <input
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Цена"
            type="number"
          />
          <input
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="URL изображения"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Описание"
          />
        </div>

        <div className={styles['modal-footer']}>
          <button onClick={handleSubmit}>Сохранить изменения</button>
        </div>
      </div>
    </div>
  );
};

export default CreateAnnouncementModal;
