import { NavLink, useLocation } from "react-router-dom";
import styles from "./Navigation.module.scss";
import welcomeImage from "/src/images/welcome.webp";

const Navigation = () => {
  const location = useLocation();

  return (
    <>
      <nav className={styles.navbar}>
        <NavLink
          to="/announcements"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Объявления
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Заказы
        </NavLink>
      </nav>

      {/* Если путь равен '/', отображаем картинку на весь экран */}
      {location.pathname === "/" && (
        <div>
          <div className={styles.fullscreenImageContainer}>
            <img
              src={welcomeImage}
              alt="Главное изображение"
              className={styles.fullscreenImage}
            />
          </div>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>Личный кабинет продавца</h1>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
