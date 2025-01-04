export const getUserInfos = async (type: string) => {
    if(type === 'api') {
        return fetch('http://localhost:3000/user/12')
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