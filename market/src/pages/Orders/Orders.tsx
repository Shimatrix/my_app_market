import React, { useState, useEffect } from 'react';
import Pagination from '../../components/Pagination/Pagination';
import styles from './Orders.module.scss';

interface Item {
  name: string;
  price: number;
}

interface Order {
  id: number;
  items: Item[];
  totalAmount: number;
  createdAt: string;
  status: number;
  showDetails: boolean;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [sortByAmount, setSortByAmount] = useState<boolean | null>(null);
  const [filterStatus, setFilterStatus] = useState<number | null>(null);

  // Загрузка данных
  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(`http://localhost:3000/orders?_start=${(currentPage - 1) * limit}&_limit=${limit}`);
      const data = await response.json();
      const totalCount = response.headers.get('X-Total-Count');

      const ordersWithTotalAmount = data.map((order: Order) => ({
        ...order,
        totalAmount: order.items.reduce((acc, item) => acc + item.price, 0),
        showDetails: false,
      }));

      setOrders(ordersWithTotalAmount);
      setFilteredOrders(ordersWithTotalAmount);
      setTotalPages(Math.ceil(Number(totalCount) / limit));
    };

    fetchOrders();
  }, [currentPage, limit]);

  // Фильтрация по статусу
  const handleStatusFilter = (status: number | null) => {
    setFilterStatus(status);
    if (status === null || status === 0) {
      // Если выбран статус "Все", сбрасываем фильтр
      setFilteredOrders(orders);
    } else {
      // Фильтруем по выбранному статусу
      const filtered = orders.filter(order => order.status === status);
      setFilteredOrders(filtered);
    }
  };

  // Сортировка по сумме
  const handleSortByAmount = () => {
    const sorted = [...filteredOrders].sort((a, b) => {
      return sortByAmount ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
    });
    setFilteredOrders(sorted);
    setSortByAmount(!sortByAmount);
  };

  // Обновление статуса заказа
  const handleStatusChange = async (id: number, newStatus: number) => {
    await fetch(`http://localhost:3000/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    const updatedOrders = orders.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    // Обновляем и filteredOrders
    setFilteredOrders(updatedOrders.filter(order => filterStatus === null || order.status === filterStatus));
    setOrders(updatedOrders);
  };

  // Раскрытие содержимого заказа
  const toggleOrderDetails = (id: number) => {
    const updatedOrders = filteredOrders.map(order =>
      order.id === id ? { ...order, showDetails: !order.showDetails } : order
    );
    setFilteredOrders(updatedOrders);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.container}>
      <h1>Мои заказы</h1>

      {/* Фильтр по статусу */}
      <div className={styles.filterContainer}>
        <label>Фильтр по статусу:</label>
        <select onChange={(e) => handleStatusFilter(Number(e.target.value) || null)}>
          <option value="">Все</option> {/* Значение "Все" сбрасывает фильтр */}
          <option value="1">Выполнен</option>
          <option value="2">В процессе</option>
          <option value="3">Отменен</option>
        </select>
      </div>

      {/* Сортировка по сумме */}
      <div className={styles.sortContainer}>
        <button onClick={handleSortByAmount}>
          Сортировать по сумме {sortByAmount ? 'по возрастанию' : 'по убыванию'}
        </button>
      </div>

      <div className={styles.grid}>
        {filteredOrders.map((order) => (
          <div key={order.id} className={styles.orderCard}>
            <h2>Заказ №{order.id}</h2> {/* Номер заказа */}
            <p>Количество товаров: {order.items.length}</p> {/* Количество товаров */}
            <p>Общая стоимость: {order.totalAmount} ₽</p> {/* Общая сумма */}
            <p>Дата создания: {new Date(order.createdAt).toLocaleDateString()}</p>

            {/* Выпадающий список для выбора статуса */}
            <label>Статус: </label>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order.id, Number(e.target.value))}
            >
              <option value="1">Выполнен</option>
              <option value="2">В процессе</option>
              <option value="3">Отменен</option>
            </select>

            {/* Кнопка для раскрытия деталей заказа */}
            <button className={styles.showButton} onClick={() => toggleOrderDetails(order.id)}>
              {order.showDetails ? 'Скрыть товары' : 'Показать все товары'}
            </button>

            {/* Товары в заказе */}
            {order.showDetails && (
              <div className={styles.items}>
                {order.items.map((item, index) => (
                  <p key={index}>{item.name} - {item.price} ₽</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Orders;
