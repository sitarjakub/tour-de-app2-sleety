import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { handleGetUser } from "../controllers/GetUserController";
import { PersonData } from "./AddPerson";
import "../css/Profile.css";
import { handleUpdateUser } from "../controllers/UpdateUserController";

export default function Profile(){
    const [data, setData] = useState<PersonData>({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        email: ''
    });
    const [error, setError] = useState<string|undefined>();

    function changeData(e:ChangeEvent<HTMLInputElement>){
        setData({...data, [e.target.id]: e.target.value})
    }

    async function updateUser(e:FormEvent){
        e.preventDefault();

        const response = handleUpdateUser(sessionStorage.getItem("key") ?? "",data);
    }

    useEffect(() => {
        async function getData(){
            const response = await handleGetUser(sessionStorage.getItem('key') ?? "");
            setData({
                firstName: response.firstName,
                lastName: response.lastName,
                username: response.username,
                password: response.password,
                email: response.email,
            });
        }

        getData();
    }, [])

    return(
        <div className="Profile">
            <form onSubmit={updateUser}>
                <label htmlFor="firstName">First name</label>
                <input id="firstName" type="text" placeholder="First name"
                    value={data.firstName} onChange={changeData} />
                <label htmlFor="lastName">Last name</label>
                <input id="lastName" type="text" placeholder="Last name"
                    value={data.lastName} onChange={changeData} />
                <label htmlFor="username">Username</label>
                <input id="username" type="text" placeholder="Username"
                    value={data.username} onChange={changeData} disabled />
                <label htmlFor="password">Password</label>
                <input id="password" type="password" placeholder="Password"
                    value={data.password} onChange={changeData} />
                <label htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="Email"
                    value={data.email} onChange={changeData} />

                <button type="submit">Save</button>
            </form>
        </div>
    )
}