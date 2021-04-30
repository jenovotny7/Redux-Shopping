import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { useSelector, useDispatch } from 'react-redux';
// replaced useStoreContext with useSelector/useDispatch
// action calls replaced by type property on slice reducers
import ProductItem from '../ProductItem';
import { QUERY_PRODUCTS } from '../../utils/queries';
import spinner from '../../assets/spinner.gif';
import { idbPromise } from '../../utils/helpers';

function ProductList() {
  const dispatch = useDispatch();
  // replaced the original state call with redux use selector hook
  const currentCategory = useSelector(state => state.categories.currentCategory);
  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    if (data) {
      dispatch({
        type: 'products/UPDATE_PRODUCTS',
        payload: data.products,
      });

      data.products.forEach((product) => {
        idbPromise('productsList', 'put', product);
      });
    } else if (!loading) {
      // since we're offline, get all of the data from the `products` store
      idbPromise('productsList', 'get').then((indexedProducts) => {
        console.log("idbProducts: ", indexedProducts)
        // use retrieved data to set global state for offline browsing
        dispatch({
          type: 'products/UPDATE_PRODUCTS',
          payload: indexedProducts,
        });
      });
    }
  }, [data, loading, dispatch]);

  const products = useSelector(state => state.productsList);

  function filterProducts() {
    if (!currentCategory) {
      return products;
    }
    return products.filter(
      (product) => product.category._id === currentCategory
    );
  }
  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
