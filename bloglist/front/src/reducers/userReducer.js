const reducer = (state = [], action) => {
    switch(action.type) {
        case 'USER_INIT':
            return action.data
        default:
            return state
    }
}

export default reducer