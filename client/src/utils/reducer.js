import { combineReducers } from 'redux';
import cartReducer from './features/cart/cartSlice';
import categoriesReducer from './features/categories/categoriesSlice';
import productsReducer from './features/products/productsSlice';

// combines my various reducers into the single source of truth for the app

const rootReducer = combineReducers({
    productsList: productsReducer,
    categories: categoriesReducer,
    cart: cartReducer 
})

export default rootReducer;

// rename products to productsList, categories => categoriesList, cart => cartList