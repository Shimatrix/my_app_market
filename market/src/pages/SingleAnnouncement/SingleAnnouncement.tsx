import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './SingleAnnouncement.module.scss';

const SingleAnnouncement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    imageUrl: '',
    description: ''
  });

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`http://localhost:3000/advertisements/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        } else {
          console.error('Ошибка при загрузке объявления');
        }
      } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
      }
    };

    fetchAnnouncement();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/advertisements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/announcements'); // Перенаправляем на страницу со списком объявлений
      } else {
        console.error('Ошибка при сохранении данных');
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <input name="name" value={formData.name} onChange={handleChange} />
        <input name="price" value={formData.price} onChange={handleChange} type="number" />
        <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
        <textarea name="description" value={formData.description} onChange={handleChange} />
        <button type="button" onClick={handleSubmit}>Сохранить изменения</button>
      </form>
    </div>
  );
};

export default SingleAnnouncement;
