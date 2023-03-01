import { ChangeEvent, FormEvent, useState } from "react";


export default function AddCategory(){
    async function addCategory(e:FormEvent<HTMLFormElement>){
        const categoryFied = document.getElementById('category') as HTMLInputElement;
const submitButton = document.getElementById('submit');
const outputElement = document.getElementById('output');
submitButton?.addEventListener('click', () => {
});
    }

    return (
        <div className="Add">
            <form onSubmit={addCategory}>
            <label htmlFor="category">Category</label>
                <input id="caregory" type="text" placeholder="Category"/>
                <button type="submit">Add category</button>
                <p id="output"></p>
            </form>

            
            
        </div>
    )
}