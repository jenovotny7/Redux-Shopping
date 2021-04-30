import React, { useEffect } from 'react';
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import './style.css';
// replaced useStoreContext with useSelector/useDispatch
// action calls replaced by type property on slice reducers
import { useSelector, useDispatch } from 'react-redux'
import { idbPromise } from '../../utils/helpers';
import { QUERY_CHECKOUT } from '../../utils/queries';
import { loadStripe } from '@stripe/stripe-js';
import { useLazyQuery } from '@apollo/react-hooks';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Cart = () => {
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);
  const cartList = useSelector(state => state.cart.cartList);
  const cartOpen = useSelector(state => state.cart.cartOpen);

  useEffect(() => {
    if (data) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data.checkout.session });
      });
    }
  }, [data]);

  const dispatch = useDispatch();
  useEffect(() => {
    async function getCart() {
      const idbCartList = await idbPromise('cartList', 'get');
      dispatch({ type: 'cart/ADD_MULTIPLE_TO_CART', payload: [...idbCartList] });
    }
    if (!cartList.length) {
      getCart();
    }
  }, [cartList.length, dispatch]);

  function toggleCart() {
    dispatch({ type: 'cart/TOGGLE_CART' });
  }

  function calculateTotal() {
    let sum = 0;
    cartList.forEach((item) => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  }
  if (!cartOpen) {
    return (
      <div className="cart-closed" onClick={toggleCart}>
        <span role="img" aria-label="cart">
          🛒
        </span>
      </div>
    );
  }

  function submitCheckout() {
    const productIds = [];
    cartList.forEach((item) => {
      for (let i = 0; i < item.purchaseQuantity; ++i) {
        productIds.push(item._id);
      }
      getCheckout({
        variables: { products: productIds },
      });
    });
  }

  return (
    <div className="cart">
      <div className="close" onClick={toggleCart}>
        [close]
      </div>
      <h2>Shopping Cart</h2>
      {cartList.length ? (
        <div>
          {cartList.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
          <div className="flex-row space-between">
            <strong>Total: ${calculateTotal()}</strong>
            {Auth.loggedIn() ? (
              <button onClick={submitCheckout}>Checkout</button>
            ) : (
              <span>(log in to check out)</span>
            )}
          </div>
        </div>
      ) : (
        <h3>
          <span role="img" aria-label="shocked">
            😱
          </span>
          You haven't added anything to your cart yet!
        </h3>
      )}
    </div>
  );
};

export default Cart;
