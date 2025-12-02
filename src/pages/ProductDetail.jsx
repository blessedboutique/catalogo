import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productsData from '../data/products.json';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [currentImage, setCurrentImage] = useState('');

    useEffect(() => {
        const foundProduct = productsData.find(p => p.id === id);
        setProduct(foundProduct);
        if (foundProduct) {
            if (foundProduct.sizes.length > 0) {
                setSelectedSize(foundProduct.sizes[0]);
            }
            if (foundProduct.images && foundProduct.images.length > 0) {
                setCurrentImage(foundProduct.images[0]);
            }
        }
    }, [id]);

    if (!product) {
        return (
            <div className="container">
                <div className={styles.notFound}>
                    <h2>Producto no encontrado</h2>
                    <Link to="/" className="btn btn-primary">Volver al Catálogo</Link>
                </div>
            </div>
        );
    }

    const whatsappNumber = "59172730173"; // Número actualizado
    // Mensaje genérico ya que no se selecciona talla específica
    const message = `Hola, me interesa el vestido ${product.name}.`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Función para corregir rutas de imágenes
    const getImageUrl = (img) => {
        if (!img) return '';
        if (img.startsWith('http') || img.startsWith('data:')) {
            return img;
        }
        // Si es ruta relativa local, asegurar que empiece con /catalogo/ si estamos en producción
        // O simplemente usar la ruta relativa correcta desde la raíz
        return img.startsWith('/') ? `/catalogo${img}` : img;
    };

    return (
        <div className="container">
            <Link to="/" className={styles.backLink}>&larr; Volver</Link>

            <div className={styles.grid}>
                <div className={styles.galleryContainer}>
                    <div className={styles.imageContainer}>
                        <img src={currentImage} alt={product.name} className={styles.image} />
                    </div>
                    {product.images && product.images.length > 1 && (
                        <div className={styles.thumbnails}>
                            {product.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`${product.name} ${index + 1}`}
                                    className={`${styles.thumbnail} ${currentImage === img ? styles.activeThumbnail : ''}`}
                                    onClick={() => setCurrentImage(img)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.info}>
                    <h1 className={styles.title}>{product.name}</h1>
                    <p className={styles.category}>{product.category}</p>
                    <p className={styles.price}>Bs. {product.price.toFixed(2)}</p>

                    <p className={styles.description}>{product.description}</p>

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Tallas Disponibles</h3>
                        <div className={styles.sizes}>
                            {product.sizes.map(size => (
                                <span
                                    key={size}
                                    className={styles.sizeBadge}
                                >
                                    {size}
                                </span>
                            ))}
                        </div>
                    </div>

                    {product.measurements && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Medidas (Aprox.)</h3>
                            <ul className={styles.measurements}>
                                {product.measurements.bust && (
                                    <li>
                                        <strong>Busto:</strong> {product.measurements.bust}
                                    </li>
                                )}
                                {product.measurements.waist && (
                                    <li>
                                        <strong>Cintura:</strong> {product.measurements.waist}
                                    </li>
                                )}
                                {product.measurements.length && (
                                    <li>
                                        <strong>Largo:</strong> {product.measurements.length}
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    {product.status === 'sold' ? (
                        <button className={`btn ${styles.soldBtn}`} disabled>
                            Producto Agotado
                        </button>
                    ) : (
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`btn btn-primary ${styles.whatsappBtn}`}
                        >
                            Comprar por WhatsApp
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
