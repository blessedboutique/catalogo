import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.container}`}>
                <Link to="/" className={styles.logo}>
                    Blessed Boutique
                    <span className={styles.subtitle}>Tienda Virtual</span>
                </Link>
                <div className={styles.links}>
                    <Link to="/" className={styles.link}>Catálogo</Link>
                    <Link to="/admin" className={styles.link}>Admin</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
