import React, {useEffect, useState} from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import './App.css';

const Register = () => {

    const history = useNavigate();

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    // posts register details to server
    async function submit(e){
        e.preventDefault();

        try {
            await axios.post("http://localhost:3000/register", {
                username, password
            })
            // server returns response status
            .then(res => {
                if (res.data === "userexists") {
                    alert("User already exists")
                }
                else if (res.data.status === "accountcreated") {
                    localStorage.setItem("name", username);
                    const userID = res.data.userID;
                    localStorage.setItem("userID", userID)
                    history("/", {state:{id:username}});
                }
            })
            .catch (error => {
                alert("Something went wrong")
                console.log(error);
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className='content'>
                <div className='loginPage'>
                    <h1>Register</h1>
            
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

                    <Link to= "/login" className='links'>Login</Link>
            </div>
                </div>
            <Outlet/>
        </>
    )
}

export default Register