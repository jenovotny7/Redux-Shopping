const initialState = {
  categoriesList: [],
  currentCategory: '',
};

export default function categoriesReducer(state = initialState, action) {
  switch (action.type) {
    case 'categories/UPDATE_CATEGORIES': {
      // state spread has to go first !!!
      return {
        ...state,
        categoriesList: [...action.payload],
        
      };
    }
    case 'categories/UPDATE_CURRENT_CATEGORY': {
      return {
        ...state,
        currentCategory: action.payload,
      };
    }
    default:
      return state;
  }
}
