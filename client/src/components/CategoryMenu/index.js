import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { useSelector, useDispatch } from 'react-redux'
// replaced useStoreContext with useSelector/useDispatch
// action calls replaced by type property on slice reducers
import { idbPromise } from '../../utils/helpers';

function CategoryMenu() {
  const dispatch = useDispatch();
  
 
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);
  useEffect(() => {
    // if categoryData exists or has changed from the response of useQuery,
    // then run dispatch()
    if (categoryData) {
      // execute our dispatch function with our action object indicating the type of action
      // and the data to set our state for categories to
      dispatch({
        type: 'categories/UPDATE_CATEGORIES',
        payload: categoryData.categories,
      });
      categoryData.categories.forEach((category) => {
        idbPromise('categoriesList', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categoriesList', 'get').then((idbCategories) => console.log("idbCategories: ", idbCategories))
      idbPromise('categoriesList', 'get').then((idbCategories) => {
        dispatch({
          type: 'categories/UPDATE_CATEGORIES',
          payload: idbCategories,
        });
      });
    }
  }, [categoryData, loading, dispatch]);

  const categoriesList  = useSelector(state => state.categories.categoriesList);

  const handleClick = (id) => {
    dispatch({
      type: 'categories/UPDATE_CURRENT_CATEGORY',
      payload: id,
    });
  };


  return (
    <div>
      <h2>Choose a Category:</h2>
      {categoriesList.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
