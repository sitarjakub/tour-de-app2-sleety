const API_URL = import.meta.env.VITE_API_URL;

export async function handleAddCategory(user: string, name:string){
    const res = await fetch(`${API_URL}/users/${user}/categories`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name
        })
    })

    return res.json();
}