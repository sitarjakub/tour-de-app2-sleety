import { ChangeEvent, Dispatch, SetStateAction, useState } from "react"
import { handleDeletePost } from "../controllers/DeletePostController";
import { handleUpdatePost } from "../controllers/UpdatePostController";
import { PostType } from "./App"

export default function Post(data:PostType&{refresh:() => Promise<void>,usersCategories?:Array<string>}){
    const [editing, setEditing] = useState<boolean>(false);
    const [editedData, setEditedData] = useState<PostType>(data);

    const [newProgrammer, setNewProgrammer] = useState<string>('');
    const [newCategory, setNewCategory] = useState<string>('');

    function changeData(e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>){
        setEditedData({...editedData, [e.target.id]: e.target.value});
    }

    async function deletePost() {
        const res = await handleDeletePost(sessionStorage.getItem("key") ?? "", data._id);
        if(res){
            data.refresh();
        }
    }

    async function editPost() {
        const res = await handleUpdatePost(sessionStorage.getItem("key") ?? "", data._id, editedData);
        setEditing(false);
        if(res){
            data.refresh();
        }
    }

    function addNewProgrammer(){
        if(newProgrammer !== ''){
            const newProgrammers = editedData.programmers ?? [];
            newProgrammers.push(newProgrammer);
            setEditedData({...editedData, programmers: newProgrammers});
            setNewProgrammer('');
        }
    }

    function addNewCategory(){
        if(newCategory !== ''){
            const newCategories = editedData.categories ?? [];
            newCategories.push(newCategory);
            setEditedData({...editedData, categories: newCategories});
            setNewCategory('');
        }
    }

    return(
        <div className="post">
            {editing === false ? <>
                <button className='post-edit'
                    onClick={() => setEditing(true)}>✏️</button>

                <p className='post-date'>{data.date}</p>
                {data.programmers && data.programmers.length > 0 &&
                    <p>Programmers: {data.programmers.map(programmer => {
                        return `${programmer}, `
                    })}</p>
                }
                {data.categories && data.categories.length > 0 &&
                    <p>Categories: {data.categories.map(category => {
                        return `${category}, `
                    })}</p>
                }
                <p>Time spent: {data.timeSpent}</p>
                <p>Programming language: {data.programmingLanguage}</p>
                <p>Rating: {data.rating}</p>
                <p>{data.description}</p>
            </> : <>
                <button className='post-edit'
                    onClick={editPost}>✅</button>
                <button className='post-delete'
                    onClick={deletePost}>🗑️</button>
                <form>
                    <label htmlFor="date">Date</label>
                    <input id="date" type="date" placeholder="Date"
                        value={editedData.date} onChange={changeData} />
                    
                    <label htmlFor="programmer">Programmers</label>
                    <div className="programmer">
                        <input id="programmer" type="text" placeholder="Add programmer"
                            value={newProgrammer} onChange={(e) => setNewProgrammer(e.target.value)} />
                        <button type="button" onClick={addNewProgrammer}>+</button>
                    </div>

                    {editedData.programmers && editedData.programmers.length > 0 && <ul className="programmers">
                        {editedData.programmers.map((programmer, index) => {
                            return <li key={index}>{programmer}</li>
                        })}
                    </ul> }

                    <label htmlFor="category">Categories</label>
                    <div className="programmer">
                    <select id="category" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                        <option value=""></option>
                        {data.usersCategories && data.usersCategories.length > 0 && data.usersCategories.map((category, index) => {
                            return <option key={index} value={category}>{category}</option>
                        })}
                    </select>
                        <button type="button" onClick={addNewCategory}>+</button>
                    </div>

                    {editedData.categories && editedData.categories.length > 0 && <ul className="programmers">
                        {editedData.categories.map((category, index) => {
                            return <li key={index}>{category}</li>
                        })}
                    </ul> }

                    <label htmlFor="timeSpent">Time spent</label>
                    <input id="timeSpent" type="number" placeholder="Time spent"
                        value={editedData.timeSpent} onChange={changeData} />
                    <label htmlFor="programmingLanguage">Programming language</label>
                    <input id="programmingLanguage" type="text" placeholder="Programming language"
                        value={editedData.programmingLanguage} onChange={changeData} />
                    <label htmlFor="rating">Rating</label>
                    <input id="rating" type="number" placeholder="Rating"
                        value={editedData.rating} onChange={changeData} />
                    <label htmlFor="description">Description</label>
                    <textarea id="description" placeholder="Description"
                        value={editedData.description} onChange={changeData} ></textarea>
                </form>
            </>
            }
        </div>
    )
}