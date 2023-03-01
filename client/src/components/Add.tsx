import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleAddPosts } from "../controllers/AddPostController";
import { handleGetCategories } from "../controllers/GetCategoriesController";
import "../css/Add.css"

export type NewPostType = {
    date: string,
    timeSpent: number,
    programmers: string[],
    categories: string[],
    programmingLanguage: string,
    rating: number,
    description: string
}

export default function Add(){
    const [newProgrammer, setNewProgrammer] = useState<string>('');
    const [newCategory, setNewCategory] = useState<string>('');

    const [usersCategories, setUsersCategories] = useState<Array<string>>([]);

    const [data, setData] = useState<NewPostType>({
        date: '',
        timeSpent: 0,
        programmers: [],
        categories: [],
        programmingLanguage: '',
        rating: 0,
        description: ''
    });
    const [error, setError] = useState<string|undefined>();
    const nav = useNavigate();

    function changeData(e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>){
        setData({...data, [e.target.id]: e.target.value});
    }

    function addNewProgrammer(){
        if(newProgrammer !== ''){
            const newProgrammers = data.programmers;
            newProgrammers.push(newProgrammer);
            setData({...data, programmers: newProgrammers});
            setNewProgrammer('');
        }else{
            setError("Fill in new programmer");
        }
    }

    function removeProgrammer(index:number){        
        const newProgrammers = data.programmers;
        newProgrammers.splice(index, 1); 
        setData({...data, programmers: newProgrammers});
    }

    function addNewCategory(){
        if(newCategory !== ''){
            const newCategories = data.categories;
            newCategories.push(newCategory);
            setData({...data, categories: newCategories});
            setNewCategory('');
        }else{
            setError("Choose category");
        }
    }

    function removeCategory(index:number){        
        const newCategories = data.categories;
        newCategories.splice(index, 1);
        setData({...data, categories: newCategories});
    }

    async function addPost(e:FormEvent<HTMLFormElement>){
        e.preventDefault();
        
        if(sessionStorage.getItem("key")){
            const res = await handleAddPosts(sessionStorage.getItem("key")??"", data);
            if(!res.error){
                setData({
                    date: '',
                    timeSpent: 0,
                    programmers: [],
                    categories: [],
                    programmingLanguage: '',
                    rating: 0,
                    description: ''
                })
                
                setError(undefined);
            }else{
                setError(res.error);
            }
        }else{
            nav("/login")
        }
    }

    useEffect(() => {
        async function getCategories(){
            const response = await handleGetCategories(sessionStorage.getItem('key') ?? "");
            setUsersCategories(response);
        }

        getCategories();
    }, [])

    return(
        <div className="Add">
            <form onSubmit={addPost}>
                <label htmlFor="date">Date</label>
                <input id="date" type="date" placeholder="Date"
                    value={data.date} onChange={changeData} />

                <label htmlFor="timeSpent">Time spent</label>
                <input id="timeSpent" type="number" placeholder="Time spent"
                    value={data.timeSpent} onChange={changeData} />

                <label htmlFor="programmer">Programmer</label>
                <div className="programmer">
                    <input id="programmer" type="text" placeholder="Programmer"
                        value={newProgrammer} onChange={e => setNewProgrammer(e.target.value)}/>
                    <button type="button" onClick={addNewProgrammer}>+</button>
                </div>
                {data.programmers.length > 0 && <ul className="programmers">
                    {data.programmers.map((programmer, index) => {
                        return <li onClick={() => removeProgrammer(index)} key={index}>{programmer}</li>;
                    })}
                </ul> }

                <label htmlFor="category">Categories</label>
                <div className="programmer">
                    <select id="category" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                        <option value=""></option>
                        {usersCategories.length > 0 && usersCategories.map((category, index) => {
                            return <option key={index} value={category}>{category}</option>
                        })}
                    </select>
                    <button type="button" onClick={addNewCategory}>+</button>
                </div>
                {data.categories.length > 0 && <ul className="programmers">
                    {data.categories.map((category, index) => {
                        return <li onClick={() => removeCategory(index)} key={index}>{category}</li>;
                    })}
                </ul> }

                <label htmlFor="programmingLanguage">Programming language</label>
                <input id="programmingLanguage" type="text" placeholder="Programming language"
                    value={data.programmingLanguage} onChange={changeData} />

                <label htmlFor="rating">Rating</label>
                <input id="rating" type="number" placeholder="Rating"
                    value={data.rating} onChange={changeData} />

                <label htmlFor="description">Description</label>
                <textarea id="description" placeholder="Description"
                    value={data.description} onChange={changeData} ></textarea>

                <button type="submit">Add post</button>

                {error && <p className="error">{error}</p> }
            </form>
        </div>
    );
}