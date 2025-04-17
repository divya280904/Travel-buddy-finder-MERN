import {Outlet, Link, useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import './App.css';
import Login from './Login';
import Register from './Register';
import Home from './Home';

const Layout = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const username = localStorage.getItem("name")

    return (
        <>
            <header>
                <div className='brand'>
                    <h1 className='title'><Link to ="/">TravelBuddyFinder</Link></h1>
                </div>

                <nav className='pageNav'>
                    <ul>
                        <li><Link to ="/proposetrip">Plan Trip</Link></li>
                        <li><Link to ="/interests">My Interests</Link></li>
                        <li><Link to ="/mytrips">My Trips</Link></li>
                    </ul>
                </nav>

                <div className='userNav'>
                    <ul> 
                        {username ? (
                            <>
                                <li>{username}</li>
                                <li><Link to ="/login">Logout</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to ="/login">Login</Link></li>
                                <li><Link to ="/register">Register</Link></li>
                            </>
                        )} 
                    </ul>
                </div>
            </header>
            
            <Outlet/>
        </>
    )
};

export default Layout;