const reducer = (state = [], action) => {
    switch(action.type) {
        case 'USER_INIT':
            return action.data
        default:
            return state
    }
}

export const userInit = (user) => {
    return {
        type: 'USER_INIT',
        data: user
    }
}

export default reducer