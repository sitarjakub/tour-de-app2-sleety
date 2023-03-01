const API_URL = import.meta.env.VITE_API_URL;

export async function handleUpdateCategory(user:string, cat_id:string, name: string){
    const res = await fetch(`${API_URL}/users/${user}/categories/${cat_id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "name": name
        })
    });
    return res.json();
}