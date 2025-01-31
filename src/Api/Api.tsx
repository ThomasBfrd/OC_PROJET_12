export const getAllUserData = async (type: string, userId?: string) => {
    if (type === 'api') {
        try {
            const data = await Promise.all([
                fetch(`http://localhost:3000/user/${userId}`),
                fetch(`http://localhost:3000/user/${userId}/activity`),
                fetch(`http://localhost:3000/user/${userId}/performance`),
                fetch(`http://localhost:3000/user/${userId}/average-sessions`),
            ])

            const statuses = await Promise.all(data.map(response => response.status))
            if (statuses.some((status) => status !== 200)) {
                throw new Error(); 
            }

            const res = await Promise.all(data.map(response => response.json()));

            return res;
        }
        catch {
            throw new Error();
        }
    } else if (type === 'local') {
        try {
            const data = await Promise.all([
                fetch('/users.json'),
                fetch('/user-activity.json'),
                fetch('/user-performance.json'),
                fetch('/user-average-sessions.json'),
            ])

            const statuses = await Promise.all(data.map((response) => response.status));
            if (statuses.some((status) => status !== 200)) {
                throw new Error();
            }

            const res = await Promise.all(data.map(response => response.json()));

            return res;
        }
        catch {
            throw new Error();
        }
    }
}