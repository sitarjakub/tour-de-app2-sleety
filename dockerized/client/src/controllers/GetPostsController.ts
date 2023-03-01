import { PostType } from "../components/App";

const API_URL = import.meta.env.VITE_API_URL;

type RawPost = {
    _id: string,
    date: string,
    programmers?: string[],
    categories?: string[],
    "time-spent": string,
    "programming-language": string,
    rating: number,
    description: string
}

export async function handleGetPosts(id:string){
    const res = await fetch(`${API_URL}/users/${id}/records`);
    const data = await res.json();
    const formatedData:Array<PostType> = [];
    if(data.error) return data;
    data.forEach((post:RawPost) => {
        formatedData.push({
            _id: post._id,
            date: post.date,
            ...(post.programmers) && {programmers: post.programmers},
            ...(post.categories) && {categories: post.categories},
            timeSpent: Number.parseInt(post["time-spent"]),
            programmingLanguage: post["programming-language"],
            rating: post.rating,
            description: post.description
        });
    });    
    return formatedData;
}