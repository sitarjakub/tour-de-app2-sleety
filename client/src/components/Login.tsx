import { ChangeEvent, FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleLogin } from '../controllers/LoginController';
import '../css/Login.css'

export default function Login(){
    const [credentials, setCredentials] = useState<{
        username: string,
        password: string
    }>({
        username: '',
        password: ''
    });
    const [error, setError] = useState<string|undefined>();

    const nav = useNavigate();

    function changeCredentials(e:ChangeEvent<HTMLInputElement>){
        setCredentials({...credentials, [e.target.id]: e.target.value});
    }

    async function login(e:FormEvent<HTMLFormElement>){
        e.preventDefault();

        if(credentials.username !== '' && credentials.password !== ''){
            const res = await handleLogin(credentials.username, credentials.password);
            if(res.key){
                if(res.adminkey) sessionStorage.setItem('adminkey', res.adminkey)
                sessionStorage.setItem('key', res.key)
                nav('/');
            }else if(res.error){
                setError(res.error);
            }else{
                setError("Server error");
            }
        }else{
            setError("Fill in the credentials");
        }
    }

    return(
        <div className="Login">
            <form onSubmit={login}>
                <label htmlFor="username">Username</label>
                <input id='username' type="text" placeholder='Username' value={credentials.username} onChange={changeCredentials} />
                <label htmlFor="password">Password</label>
                <input id='password' type="password" placeholder='Password' value={credentials.password} onChange={changeCredentials} />

                <button>Login</button>
                {error && <p className='error'>{error}</p> }
            </form>
        </div>
    )
}