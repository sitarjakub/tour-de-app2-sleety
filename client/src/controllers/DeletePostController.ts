const API_URL = import.meta.env.VITE_API_URL;

export async function handleDeletePost(user:string, post:string){
    const res = await fetch(`${API_URL}/users/${user}/records/${post}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return res.json();
}