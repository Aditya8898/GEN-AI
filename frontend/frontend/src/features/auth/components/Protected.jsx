import {useAuth} from "../hooks/useAuth";
import {Navigate} from "react-router-dom";
import React from "react";
import NavBar from "./NavBar";

const Protected = ({children}) => {
    const {loading, user} = useAuth()

    if(loading) {
        return (<main>Loading....</main>)
    }

    if(!user){
        return <Navigate to={'/login'}/>
    }

    return (
        <>
            <NavBar />
            {children}
        </>
    )
}

export default Protected