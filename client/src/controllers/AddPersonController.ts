import { PersonData } from "../components/AddPerson";
const API_URL = import.meta.env.VITE_API_URL;

export async function handleAddPerson(data:PersonData){
    const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    return res.json();
}