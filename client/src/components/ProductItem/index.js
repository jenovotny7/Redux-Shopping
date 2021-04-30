import React from 'react';
import { Link } from 'react-router-dom';
import { pluralize } from '../../utils/helpers';
// replaced useStoreContext with useSelector/useDispatch
// action calls replaced by type property on slice reducers
import { useSelector, useDispatch } from 'react-redux';
import { idbPromise } from '../../utils/helpers';

function ProductItem(item) {
  const dispatch = useDispatch();
  const cartList = useSelector(state => state.cart.cartList);
  const { image, name, _id, price, quantity } = item;

  const addToCart = () => {
    const itemInCart = cartList.find((cartItem) => cartItem._id === _id);

    if (itemInCart) {
      dispatch({
        type: 'cart/UPDATE_CART_QUANTITY',
        payload: {
            _id: _id,
            purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
        }
      });
      idbPromise('cartList', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
    } else {
      dispatch({
        type: 'cart/ADD_TO_CART',
        payload: { ...item, purchaseQuantity: 1 },
      });
      idbPromise('cartList', 'put', { ...item, purchaseQuantity: 1 });
    }
  };

  return (
    <div className="card px-1 py-1">
      <Link to={`/products/${_id}`}>
        <img alt={name} src={`/images/${image}`} />
        <p>{name}</p>
      </Link>
      <div>
        <div>
          {quantity} {pluralize('item', quantity)} in stock
        </div>
        <span>${price}</span>
      </div>
      <button onClick={addToCart}>Add to cart</button>
    </div>
  );
}

export default ProductItem;
