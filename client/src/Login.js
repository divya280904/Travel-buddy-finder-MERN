import React, {useEffect, useState} from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import './App.css';

const Login = () => {
    
    const history = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // posts login username and password details to server side
    async function submit(e){
        e.preventDefault();

        try {
            await axios.post("http://localhost:3000/login", {
                username, password
            })
            .then(res => {
                // takes user to home page if response from server side returns user found
                if (res.data.status === "userfound") {
                    history("/", {state:{id:username}});
                    localStorage.setItem("name", username);
                    const userID = res.data.userID;
                    localStorage.setItem("userID", userID)
                }
                else if (res.data === "usernotfound") {
                    alert("Invalid login credentials")
                }
            })
            .catch (error => {
                alert("Something went wrong")
                console.log(error);
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className='content'>
                <div className='home-login-btn'>
                    <h1 className=""><Link to ="/" className='home-link'>Home</Link></h1>
                </div>
                <div className='loginPage'>
                    <h1>Login</h1>
            
                    <form action="POST">
                        <div className='formItem1'>
                            <input type="username" onChange={(e) =>{setUsername(e.target.value)}} name="" placeholder="Username"/>
                        </div>

                        <div className='formItem2'>
                            <input type="password" onChange={(e) =>{setPassword(e.target.value)}} name="" placeholder="Password"/>
                        </div>

                        <div className='formItem3'>
                            <input type="submit" onClick={submit}/>
                        </div>
                    </form>

                    <br></br>
                    <p>OR</p>
                    <br></br>

                    <Link to= "/register" className='links'>Create Account</Link>
                </div>
            </div>   
            <Outlet/>
        </>
    );
};

export default Login;