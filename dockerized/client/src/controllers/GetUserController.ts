const API_URL = import.meta.env.VITE_API_URL;

export async function handleGetUser(id:string){
    const res = await fetch(`${API_URL}/users/${id}`);
    return res.json();
}