import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { formatPrice } from '../../util/format';
import { ProductList } from './styles';
import api from '../../services/api';
import * as CartActions from '../../store/modules/cart/actions';

const Home = () => {
  const [products, setProducts] = useState([]);
  const amount = useSelector(state =>
    state.cart.reduce((totalAmount, product) => {
      totalAmount[product.id] = product.amount;
      return totalAmount;
    }, {})
  );

  const dispatch = useDispatch();

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('products');
      const data = response.data.map(product => ({
        ...product,
        priceFormatted: formatPrice(product.price),
      }));

      setProducts(data);
    }
    loadProducts();
  }, []);

  const handleAddProduct = id => {
    dispatch(CartActions.addToCartRequest(id));
  };

  return (
    <ProductList>
      {products.map(product => (
        <li key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.priceFormatted}</span>
          <button type="button" onClick={() => handleAddProduct(product.id)}>
            <div>
              <MdAddShoppingCart color="#FFF" size={16} />
              {amount[product.id] || 0}
            </div>
            <span>Adicionar ao carrinho</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
};

export default Home;
