const reducer = (state = [], action) => {
    switch(action.type) {
        case 'INIT_BLOGS':
            return action.data
        case 'ADD_BLOG':
            return state.concat(action.data)
        default:
            return state
    }
}


export default reducer