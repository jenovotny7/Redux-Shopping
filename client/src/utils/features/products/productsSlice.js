const initialState = [];

export default function productsReducer(state = initialState, action) {
    switch (action.type) {
        case 'products/UPDATE_PRODUCTS': {
            return [...action.payload]
        }
        default:
      // if this reducer doesn't recognize the action type, or doesn't
      // care about this specific action, return the existing state unchanged
      return state
  }
}