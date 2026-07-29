const initialState = {
    products: null,
    categories: null,
    pagination: {},
};

export const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_PRODUCTS":
            return {
                ...state,
                products: action.payload,
                pagination: {
                    ...state.pagination,
                    pageNumber: action.pageNumber,
                    pageSize: action.pageSize,
                    totalElements: action.totalElements,
                    totalPages: action.totalPages,
                    lastPage: action.lastPage,
                },
            };

        case "FETCH_CATEGORIES":
            return {
                ...state,
                categories: action.payload,
                pagination: {
                    ...state.pagination,
                    pageNumber: action.pageNumber,
                    pageSize: action.pageSize,
                    totalElements: action.totalElements,
                    totalPages: action.totalPages,
                    lastPage: action.lastPage,
                },
            };

        case "DELETE_PRODUCT":
            return {
                ...state,
                products: state.products?.filter(
                    (product) => product.productId !== action.payload
                ),
                pagination: {
                    ...state.pagination,
                    totalElements: Math.max(
                        (state.pagination?.totalElements || 1) - 1,
                        0
                    ),
                },
            };
        
    
        default:
            return state;
    }
};
