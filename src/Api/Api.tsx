export const getUserInfos = async (type: string) => {
    if(type === 'api') {
        return fetch('http://localhost:3000/user/18')
        .then((response: Response) => {
            if (!response.ok) {
                throw (new Error())
            }
            
            
            return response.json()
        })
    } else if (type === 'local') {

        return fetch('/users.json')
        .then((response: Response) => {
            if (!response.ok) {
                throw (new Error())
            }
    
            return response.json()
        })
    }
}

// Get Activity
export const getUserActivity = async (type: string) => {
    if(type === 'api') {
        return fetch('http://localhost:3000/user/18/activity')
        .then((response: Response) => {
            if (!response.ok) {
                throw (new Error())
            }
            
            
            return response.json()
        })
    } else if (type === 'local') {

        return fetch('/user-activity.json')
        .then((response: Response) => {
            if (!response.ok) {
                throw (new Error())
            }
    
            return response.json()
        })
    }
}

// Get Average Sessions
export const getAverageSessions = async (type: string) => {
    if(type === 'api') {
        return fetch('http://localhost:3000/user/18/average-sessions')
        .then((response: Response) => {
            if (!response.ok) {
                throw (new Error())
            }
            
            
            return response.json()
        })
    } else if (type === 'local') {

        return fetch('/user-average-sessions.json')
        .then((response: Response) => {
            if (!response.ok) {
                throw (new Error())
            }
    
            return response.json()
        })
    }
}

// Get Performances
export const getPerformances = async (type: string) => {
    if(type === 'api') {
        return fetch('http://localhost:3000/user/18/performance')
        .then((response: Response) => {
            if (!response.ok) {
                throw (new Error())
            }
            
            
            return response.json()
        })
    } else if (type === 'local') {

        return fetch('/user-performance.json')
        .then((response: Response) => {
            if (!response.ok) {
                throw (new Error())
            }
    
            return response.json()
        })
    }
}