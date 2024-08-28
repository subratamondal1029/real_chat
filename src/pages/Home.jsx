import { Search } from "lucide-react"
import "../Css/home.css"

const Home = () => {
  const displayElm = {

  }
  
  return (
    <div id="contactSection">
      <form id="searchField">
        <input type="text" placeholder="Search" />
        <button><Search size={20} /></button>
      </form>
      <div className="contactList">
      <div className="contact">
        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="test" />
        <div>
        <p>Subrata</p>
        <p className="recentMessage">Recent Message sdfjhdgfjdfjhdgfgdjh</p>
        </div>
        <p>10/2/2024</p>
      </div>
      </div>
    </div>
  )
}

export default Home
