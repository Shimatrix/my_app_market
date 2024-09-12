import React from 'react';
import styles from './AnnouncementCard.module.scss';

interface AnnouncementCardProps {
  image: string;
  title: string;
  price: number;
  description: string;
  views: number;
  likes: number;
  onDelete: (e: React.MouseEvent) => void; // Обработчик удаления карточки
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ image, title, price, views, likes, onDelete }) => {
  const imageUrl = image.startsWith('http') ? image : `/api${image}`;

  return (
    <div className={styles.card}>
      <img src={imageUrl} alt={title} className={styles.image} />
      <div className={styles.info}>
        <h3>{title}</h3>
        <p>Цена: {price} ₽</p>
        <p>Просмотры: {views}</p>
        <p>Лайки: {likes}</p>
        <button 
          className={styles.deleteButton} 
          onClick={(e) => { 
            e.stopPropagation(); // Останавливаем всплытие события
            onDelete(e); 
          }}
        >
          Удалить
        </button>
      </div>
    </div>
  );
};

export default AnnouncementCard;
