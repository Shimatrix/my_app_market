import React, { useState } from 'react';
import styles from './ OrderCard.module.scss';

interface OrderCardProps {
  items: any[];
  totalAmount: number;
  date: string;
  status: string;
}

const OrderCard: React.FC<OrderCardProps> = ({ items, totalAmount, date, status }) => {
  const [showItems, setShowItems] = useState(false);

  const toggleItems = () => {
    setShowItems(!showItems);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.details}>
          <p>Дата: {new Date(date).toLocaleDateString()}</p>
          <p>Статус: {status}</p>
        </div>
        <div className={styles.amount}>
          <p>Сумма заказа: {totalAmount} ₽</p>
        </div>
      </div>
      <button onClick={toggleItems} className={styles.toggleButton}>
        {showItems ? 'Скрыть товары' : 'Показать товары'}
      </button>
      {showItems && (
        <div className={styles.items}>
          {items.map((item, index) => (
            <div key={index} className={styles.item}>
              <img src={item.imageUrl} alt={item.name} />
              <div>
                <p>{item.name}</p>
                <p>Количество: {item.quantity}</p>
                <p>Цена: {item.price} ₽</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
