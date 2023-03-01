import { useState, useEffect, ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { handleGetCategories } from '../controllers/GetCategoriesController'
import { handleGetPosts } from '../controllers/GetPostsController'
import '../css/App.css'
import Post from './Post'

const API_URL = import.meta.env.VITE_API_URL;

export type PostType = {
  _id: string,
  date: string,
  programmers?: string[],
  categories?: string[],
  timeSpent: number,
  programmingLanguage: string,
  rating: number,
  description: string
}
type FiltersType = {
  dateFrom?: string,
  dateTo?: string,
  timeSpent?: number,
  programmingLanguage?: string,
  ratingFrom?: number,
  ratingTo?: number
}

export default function App() {
  const [posts, setPosts] = useState<Array<PostType>>([]);
  const [visiblePosts, setVisiblePosts] = useState<Array<PostType>>([]);

  const [usersCategories, setUsersCategories] = useState<Array<string>>([]);

  const [filtersHidden, setFiltersHidden] = useState<boolean>(false);
  const [filters, setFilters] = useState<FiltersType>();
  const [sortBy, setSortBy] = useState<"date"|"timeSpent"|"programmingLanguage"|"rating">("date");

  const nav = useNavigate();

  function changeFilters(e:ChangeEvent<HTMLInputElement>){
    if(e.target.id === "timeSpent" || e.target.id === "ratingFrom" || e.target.id === "ratingTo"){
      setFilters({...filters, [e.target.id]: Number.parseInt(e.target.value)})
    }else{
      setFilters({...filters, [e.target.id]: e.target.value})
    }
  }

  function changeSort(e:ChangeEvent<HTMLSelectElement>){
    switch(e.target.value){
      case "date": setSortBy("date"); break;
      case "timeSpent": setSortBy("timeSpent"); break;
      case "programmingLanguage": setSortBy("programmingLanguage"); break;
      case "rating": setSortBy("rating"); break;
      default: setSortBy("date"); break;
    }
  }

  async function getPosts(){
    if(sessionStorage.getItem("key")){
      const res = await handleGetPosts(sessionStorage.getItem("key") ?? "");      
      if(!res.error){
        setPosts(res);
      }
    }else{
      nav('/login')
    }
  }

  useEffect(() => {
    async function getCategories(){
      const response = await handleGetCategories(sessionStorage.getItem('key') ?? "");
      setUsersCategories(response);
    }

    getCategories();
    getPosts();
  }, [])

  useEffect(() => {
    function compare(a:PostType,b:PostType){      
      if (a[sortBy] < b[sortBy]){
        return -1;
      }
      if (a[sortBy] > b[sortBy]){
        return 1;
      }
      return 0;
    }

    const newPosts:Array<PostType> = [];
    posts.map(x => {
      if((filters?.dateFrom === undefined || x.date > filters?.dateFrom) &&
        (filters?.dateTo === undefined || x.date < filters?.dateTo) &&
        (filters?.timeSpent === undefined || x.timeSpent === filters?.timeSpent) &&
        (filters?.programmingLanguage === undefined || x.programmingLanguage === filters?.programmingLanguage) &&
        (filters?.ratingFrom === undefined || x.rating > filters?.ratingFrom) &&
        (filters?.ratingTo === undefined || x.rating < filters?.ratingTo)){
          newPosts.push(x);
        }
    })
    newPosts.sort(compare);    
    setVisiblePosts(newPosts);
  }, [filters, posts, sortBy])

  return (
    <div className="App">
      <div className="add-post">
        <a href={`${API_URL}/users/${sessionStorage.getItem("key") ?? ""}/export`} download="exported_post.csv" >Export to CSV</a>
      </div>
      {posts.length > 0
        ? <>

          <div className="posts">
            <button className='posts-filters-button' onClick={() => {setFiltersHidden(prev => !prev)}}>Filters: {filtersHidden ? <>🙈</> : <>🙉</>}</button>
            {!filtersHidden &&
              <form className="filters">
                <h3>Filters</h3>

                <label htmlFor="dateFrom">Date</label>
                <div className="filters-flex">
                  <input id='dateFrom' type="date" onChange={changeFilters} />
                  <p>-</p>
                  <input id='dateTo' type="date" onChange={changeFilters} />
                </div>

                <label htmlFor="timeSpent">Time spent</label>
                <input id='timeSpent' type="number" onChange={changeFilters} />

                <label htmlFor="programmingLanguage">Programming language</label>
                <input id='programmingLanguage' type="text" onChange={changeFilters} />

                <label htmlFor="ratingFrom">Rating</label>
                <div className="filters-flex">
                  <input id='ratingFrom' type="number" onChange={changeFilters} />
                  <p>-</p>
                  <input id='ratingTo' type="number" onChange={changeFilters} />
                </div>

                <label htmlFor="sort">Sort by</label>
                <select id="sort" onChange={changeSort} value={sortBy}>
                  <option value="date">Date</option>
                  <option value="timeSpent">Spent time</option>
                  <option value="programmingLanguage">Programming language</option>
                  <option value="rating">Rating</option>
                </select>
              </form>
            }
            <div className="posts-list">
              {
                visiblePosts.map(post => {
                  return(
                    <Post
                      _id={post._id}
                      date={post.date}
                      programmers={post.programmers ?? undefined}
                      categories={post.categories ?? undefined}
                      timeSpent={post.timeSpent}
                      programmingLanguage={post.programmingLanguage}
                      rating={post.rating}
                      description={post.description}
                      refresh={getPosts}
                      usersCategories={usersCategories}
                      key={post._id} />
                  )
                })
              }
            </div>
          </div>
        </> : <p className='no-data'>No data...</p>
      }
    </div>
  )
}