const initialState = {
  cartList: [],
  cartOpen: false,
};

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case 'cart/ADD_TO_CART': {
      return {
        cartList: [...state.cartList, action.payload],
        cartOpen: true,
      };
    }
    case 'cart/ADD_MULTIPLE_TO_CART': {
      return {
        ...state,
        cartList: [...state.cartList, ...action.payload],
      };
    }
    case 'cart/REMOVE_FROM_CART': {
        let newCartList = state.cartList.filter((product) => {
            return product._id !== action.payload;
          });
      return {
        cartList: newCartList,
        cartOpen: newCartList.length > 0,
      };
    }
    case 'cart/UPDATE_CART_QUANTITY': {
      return {
        cartOpen: true,
        cartList: state.cartList.map((product) => {
          if (action.payload._id === product._id) {
            product.purchaseQuantity = action.payload.purchaseQuantity;
          }
          return product;
        }),
      };
    }
    case 'cart/CLEAR_CART': {
      return {
        cartOpen: false,
        cartList: [],
      };
    }
    case 'cart/TOGGLE_CART': {
      return {
        ...state,
        cartOpen: !state.cartOpen,
      };
    }
    default:
      return state;
  }
}
