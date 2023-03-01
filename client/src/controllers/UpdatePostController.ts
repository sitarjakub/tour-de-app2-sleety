import { PostType } from "../components/App";

const API_URL = import.meta.env.VITE_API_URL;

export async function handleUpdatePost(user:string, post:string, data:PostType){
    const res = await fetch(`${API_URL}/users/${user}/records/${post}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "date": data.date,
            ...(data.categories) && {"categories": data.categories},
            ...(data.programmers) && {"programmers": data.programmers},
            "time-spent": data.timeSpent.toString(),
            "programming-language": data.programmingLanguage,
            "rating": data.rating,
            "description": data.description
        })
    });
    return res.json();
}