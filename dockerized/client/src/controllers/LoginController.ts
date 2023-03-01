const API_URL = import.meta.env.VITE_API_URL;

export async function handleLogin(username:string, password:string){
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    return res.json();
}