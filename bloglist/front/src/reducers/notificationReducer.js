const reducer = (state = null, action) => {
    switch(action.type) {
        case 'SET_NOTIFICATION':
            return action.data
        case 'CLEAR_NOTIFICATION':
            return null
        default: 
            return state
    }
}

export const setNotification = (content) => {
    return {
        type: 'SET_NOTIFICATION',
        data: content
    }
}

export const clearNotification = () => {
    return {
        type: 'CLEAR_NOTIFICATION',
        data: null
    }
}


let timeoutID 
export const displayNotification = (notification, delay) => {
    return dispatch => {
        dispatch(setNotification(notification))
        clearTimeout(timeoutID)
        timeoutID = setTimeout(() => dispatch(clearNotification()), delay)
    }
}



export default reducer