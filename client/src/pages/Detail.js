import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
// replaced useStoreContext with useSelector/useDispatch
// action calls replaced by type property on slice reducers
import { useSelector, useDispatch } from 'react-redux'
import { QUERY_PRODUCTS } from '../utils/queries';
import spinner from '../assets/spinner.gif';
import Cart from '../components/Cart';
import { idbPromise } from '../utils/helpers';

function Detail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [currentProduct, setCurrentProduct] = useState({});
  const { loading, data } = useQuery(QUERY_PRODUCTS);
  const products = useSelector(state => state.productsList);
  const cartList = useSelector(state => state.cart.cartList)

  useEffect(() => {
    // already in global store?
    if (products.length) {
      setCurrentProduct(products.find((product) => product._id === id));
    }
    // retrieved from server?
    else if (data) {
      dispatch({
        type: 'products/UPDATE_PRODUCTS',
        payload: data.products,
      });

      data.products.forEach((product) => {
        idbPromise('productsList', 'put', product);
      });
    }
    // if no to previous, get cache from idb
    else if (!loading) {
      idbPromise('productsList', 'get').then((indexedProducts) => {
        dispatch({
          type:'products/UPDATE_PRODUCTS',
          payload: indexedProducts,
        });
      });
    }
  }, [products, data, loading, dispatch, id]);

  const addToCart = () => {
    const itemInCart = cartList.find((cartItem) => cartItem._id === id);
    if (itemInCart) {
      dispatch({
        type: 'cart/UPDATE_CART_QUANTITY',
        payload: {
          _id: id,
          purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
        }
      });
      // if we're updating quantity, use existing item data
      // and increment purchaseQuantity value by one
      idbPromise('cartList', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
    } else {
      dispatch({
        type: 'cart/ADD_TO_CART',
        payload: { ...currentProduct, purchaseQuantity: 1 },
      });
      // if product isn't in the cart yet,
      // add it to the current shopping cart in indexedDB
      idbPromise('cartList', 'put', { ...currentProduct, purchaseQuantity: 1 });
    }
  };

  const removeFromCart = () => {
    console.log(currentProduct._id)
    dispatch({
      type: 'cart/REMOVE_FROM_CART',
      payload: currentProduct._id,
    });

    // upon removal from cart, delete the item from IndexedDB 
    // using the `currentProduct._id` to locate what to remove
    idbPromise('cartList', 'delete', { ...currentProduct });
  };

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={addToCart}>Add to Cart</button>
            <button
              disabled={!cartList.find((p) => p._id === currentProduct._id)}
              onClick={removeFromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
