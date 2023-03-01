const API_URL = import.meta.env.VITE_API_URL;

export async function handleGetAllUsers(){
    const res = await fetch(`${API_URL}/users`);
    return res.json();
}