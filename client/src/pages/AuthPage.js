import React from 'react';
import {useState, useEffect, useContext} from 'react';
import {useHttp} from '../hooks/htttp.hook';
import {useMessage} from '../hooks/message.hook';
import {AuthContext} from "../context/AuthContext";


export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const {loading, error, request, clearError} = useHttp();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    useEffect(() => {
        window.M.updateTextFields();
    } )

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]) //if error exists, then set the message

    const changeHandler = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form});
            message(data.message);
        } catch (err) {

        }
    };

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form});
            auth.login(data.token, data.userId)

        } catch (err) {

        }
    };


    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>ShrinkYoLink</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Authorization</span>
                        <div>
                            <div className="input-field">
                                <input
                                    placeholder="Email"
                                    id="email" type="email"
                                    className="validate yellow-input"
                                    name="email"
                                    onChange={changeHandler}/>

                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-field">
                                <input
                                    placeholder="Password"
                                    id="password"
                                    type="password"
                                    className="validate yellow-input"
                                    name="password"
                                    onChange={changeHandler}
                                    disabled={loading}
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button className="btn yellow darken-4"
                                style={{marginRight: 10}}
                                onClick={loginHandler}
                        >Log In</button>
                        <button className="btn grey lighten-1 black-text"
                                onClick={registerHandler}
                                disabled={loading}
                        >Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}