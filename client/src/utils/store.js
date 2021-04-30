import { createStore } from 'redux';
import rootReducer from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
// import { idbPromise } from './helpers';

// let preloadedState
// const idbCategories = idbPromise('categoriesList', 'get') || [];
// const idbProducts = idbPromise('productsList', 'get');
// const idbCart = idbPromise('cartList', 'get') || [];

// if (idbProducts && idbCategories) {
//     preloadedState = {
//         productsList: idbProducts,
//         categories: {categoriesList: idbCategories, currentCategory: '' },
//         cart: {cartList: idbCart, cartOpen: false}
//     }
// }

const composedEnhancer = composeWithDevTools(
    // middleware here if necessary
)

const store = createStore(rootReducer, composedEnhancer);

export default store;