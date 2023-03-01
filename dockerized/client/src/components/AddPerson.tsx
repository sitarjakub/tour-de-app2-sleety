import { ChangeEvent, FormEvent, useState } from "react";
import { handleAddPerson } from "../controllers/AddPersonController";
import "../css/Add.css"

export type PersonData = {
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    email: string
}

export default function AddPerson(){
    const [error, setError] = useState<string|undefined>();
    const [data, setData] = useState<PersonData>({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        email: ''
    });

    function changeData(e:ChangeEvent<HTMLInputElement>){
        setData({...data, [e.target.id]: e.target.value})
    }

    async function addPerson(e:FormEvent){
        e.preventDefault();

        const res = await handleAddPerson(data);

        if(!res.error){
            console.log(res);
            setData({
                firstName: '',
                lastName: '',
                username: '',
                password: '',
                email: ''
            })
        }else{
            setError(res.error);
        }
    }

    return(
        <div className="Add">
            <form onSubmit={addPerson}>
                <label htmlFor="firstName">First name</label>
                <input id="firstName" type="text" placeholder="First name"
                    value={data.firstName} onChange={changeData} />
                <label htmlFor="lastName">Last name</label>
                <input id="lastName" type="text" placeholder="Last name"
                    value={data.lastName} onChange={changeData} />
                <label htmlFor="username">Username</label>
                <input id="username" type="text" placeholder="Username"
                    value={data.username} onChange={changeData} />
                <label htmlFor="password">Password</label>
                <input id="password" type="password" placeholder="Password"
                    value={data.password} onChange={changeData} />
                <label htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="Email"
                    value={data.email} onChange={changeData} />
                <button type="submit">Add person</button>

                {error && <p className="error">{error}</p> }
            </form>
        </div>
    );
}