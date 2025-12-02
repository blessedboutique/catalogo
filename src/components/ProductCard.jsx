import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
    const mainImage = product.images && product.images.length > 0 ? product.images[0] : '';

    return (
        <Link to={`/product/${product.id}`} className={styles.card}>
            <div className={styles.imageContainer}>
                <img src={mainImage} alt={product.name} className={styles.image} />
            </div>
            <div className={styles.info}>
                <h3 className={styles.name}>{product.name}</h3>
                <p className={styles.category}>{product.category}</p>
                <div className={styles.priceRow}>
                    <p className={styles.price}>Bs. {product.price.toFixed(2)}</p>
                    {product.status === 'sold' && <span className={styles.soldBadge}>AGOTADO</span>}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
