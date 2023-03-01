const API_URL = import.meta.env.VITE_API_URL;

type UpdateUserType = {
    firstName?: string,
    lastName?: string,
    username?: string,
    password?: string,
    email?: string
}

export async function handleUpdateUser(id:string, data:UpdateUserType){
    if(data.firstName || data.lastName || data.username || data.password || data.email){
        const res = await fetch(`${API_URL}/users/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...(data.firstName) && {"firstName": data.firstName},
                ...(data.lastName) && {"lastName": data.lastName},
                ...(data.username) && {"username": data.username},
                ...(data.password) && {"password": data.password},
                ...(data.email) && {"email": data.email},
            })
        });
        return res.json();
    }
}