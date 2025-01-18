export const getAllUserData = async (type: string) => {
    if (type === 'api') {
        try {
            const data = await Promise.all([
                fetch('http://localhost:3000/user/18'),
                fetch('http://localhost:3000/user/18/activity'),
                fetch('http://localhost:3000/user/18/performance'),
                fetch('http://localhost:3000/user/18/average-sessions'),
            ])

            const res = await Promise.all(data.map(response => response.json()));
            console.log(res);
            return res;
        }
        catch {
            console.error('Récupération impossible')
            return null;
        }
    } else if (type === 'local') {
        try {
            const data = await Promise.all([
                fetch('/users.json'),
                fetch('/user-activity.json'),
                fetch('/user-performance.json'),
                fetch('/user-average-sessions.json'),
            ])

            const res = await Promise.all(data.map(response => response.json()));
            console.log(res);
            return res;
        }
        catch {
            console.error('Récupération impossible')
            return null;
        }
    }
}