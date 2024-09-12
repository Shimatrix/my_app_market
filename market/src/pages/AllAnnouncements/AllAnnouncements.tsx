import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnnouncementCard from '../../components/AnnouncementCard/AnnouncementCard';
import Pagination from '../../components/Pagination/Pagination';
import CreateAnnouncementModal from '../../components/CreateAnnouncementModal/CreateAnnouncementModal';
import styles from './AllAnnouncements.module.scss';

interface Announcement {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  views?: number;
  likes?: number;
}

const AllAnnouncements: React.FC = () => {
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchAnnouncements = async () => {
    const start = (currentPage - 1) * limit;
    const response = await fetch(
      `http://localhost:3000/advertisements?_start=${start}&_limit=${limit}&name_like=${searchQuery}`
    );
    const data = await response.json();
    setFilteredAnnouncements(data);

    const totalCount = response.headers.get('X-Total-Count');
    
    if (totalCount) {
      setTotalPages(Math.ceil(Number(totalCount) / limit));
    } else {
      const allAnnouncements = await fetch(`http://localhost:3000/advertisements`);
      const allData = await allAnnouncements.json();
      
      const filteredData = allData.filter((announcement: { name: string; }) =>
        announcement.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setFilteredAnnouncements(filteredData.slice(start, start + limit));
      setTotalPages(Math.ceil(filteredData.length / limit));
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [searchQuery, currentPage, limit]);

  // Удаление объявления с сервера и обновление списка
  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.preventDefault(); // Предотвращаем переход по ссылке
    try {
      const response = await fetch(`http://localhost:3000/advertisements/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchAnnouncements(); // Обновляем список после удаления
      } else {
        console.error('Ошибка при удалении объявления');
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
    }
  };

  const handleCreateNewAnnouncement = () => {
    setSelectedAnnouncement({
      id: Date.now(),
      name: '',
      price: 0,
      imageUrl: '',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchAnnouncements();
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      <h1>Все объявления</h1>

      {/* Контейнер для инпута и кнопки */}
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Поиск по названию"
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.search}
        />
        <button onClick={handleCreateNewAnnouncement} className={styles.createButton}>
          Добавить новое объявление
        </button>

        {/* Выбор количества объявлений на странице */}
        <select onChange={handleLimitChange} value={limit} className={styles.limitSelect}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>

      <div className={styles.grid}>
        {filteredAnnouncements.map(announcement => (
          <Link to={`/announcement/${announcement.id}`} key={announcement.id} className={styles['card-link']}>
            <AnnouncementCard
              image={announcement.imageUrl}
              title={announcement.name}
              price={announcement.price}
              description={announcement.description ?? 'Описание отсутствует'}
              views={announcement.views ?? 0}
              likes={announcement.likes ?? 0}
              onDelete={(e) => handleDelete(announcement.id, e)} // Передаем событие удаления
            />
          </Link>
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {isModalOpen && selectedAnnouncement && (
        <CreateAnnouncementModal announcement={selectedAnnouncement} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default AllAnnouncements;
