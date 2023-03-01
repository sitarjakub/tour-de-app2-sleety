const API_URL = import.meta.env.VITE_API_URL;

export async function handleGetCategories(user: string){
    const res = await fetch(`${API_URL}/users/${user}/categories`);
    return res.json();
}