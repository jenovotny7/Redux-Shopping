import React from 'react';
import { useDispatch } from 'react-redux';
// replaced useStoreContext with useSelector/useDispatch
// action calls replaced by type property on slice reducers
import { idbPromise } from '../../utils/helpers';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const removeFromCart = (item) => {
    dispatch({
      type: 'cart/REMOVE_FROM_CART',
      payload: item._id,
    });
    idbPromise('cartList', 'delete', { ...item });
  };

  const onChange = (e) => {
    const value = e.target.value;

    if (value === '0') {
      dispatch({
        type: 'cart/REMOVE_FROM_CART',
        payload: item._id,
      });

      idbPromise('cartList', 'delete', { ...item });
    } else {
      dispatch({
        type: 'cart/UPDATE_CART_QUANTITY',
        payload: {
          _id: item._id,
          purchaseQuantity: parseInt(value),
        },
      });

      idbPromise('cartList', 'put', {
        ...item,
        purchaseQuantity: parseInt(value),
      });
    }
  };
  return (
    <div className="flex-row">
      <div>
        <img src={`/images/${item.image}`} alt="" />
      </div>
      <div>
        <div>
          {item.name}, ${item.price}
        </div>
        <div>
          <span>Qty:</span>
          <input
            type="number"
            placeholder="1"
            value={item.purchaseQuantity}
            onChange={onChange}
          />
          <span
            role="img"
            aria-label="trash"
            onClick={() => removeFromCart(item)}
          >
            🗑️
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
