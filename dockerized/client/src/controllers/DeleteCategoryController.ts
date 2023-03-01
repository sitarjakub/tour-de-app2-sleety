const API_URL = import.meta.env.VITE_API_URL;

export async function handleDeleteCategory(user:string, cat_id:string){
    const res = await fetch(`${API_URL}/users/${user}/categories/${cat_id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return res.json();
}