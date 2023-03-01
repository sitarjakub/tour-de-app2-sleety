import { NewPostType } from "../components/Add";

const API_URL = import.meta.env.VITE_API_URL;

export async function handleAddPosts(id:string, data:NewPostType){
    const res = await fetch(`${API_URL}/users/${id}/records`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    return res.json();
}