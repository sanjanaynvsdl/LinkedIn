import React from "react";
import { axiosInstance } from "../lib/axios";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation.jsx"


const HomePage = ()=> {

    const {data : authUser} = useQuery({ queryKey: ["authUser"]});
    //Suggested-users
    const {data:recommendedUsers} = useQuery({
        queryKey:["recommenderUsers"],
        queryFn:async()=> {
            const res = await axiosInstance.get("/users/suggestion");
            // return res.data;
            return res.data.user;
        }
    });

    //suggested-posts
    const {data:posts} = useQuery({
        queryKey:["posts"],
        queryFn:async()=> {
            const res= await axiosInstance.get("/post/");
            return res.data;
        }
    });

    // console.log("recommenderUsers", recommendedUsers);
    // console.log("feedPosts", posts);
    return(
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="hidden lg:block lg:col-span-1">
                <Sidebar user = {authUser} />
            </div>
            <div className="col-span-1 lg:col-span-2 order-first lg:order-none">
                <PostCreation user = {authUser}/>
            </div>
        </div>
    )
}

export default HomePage;

//In home-page
//1. Imported suggested users
//2. Posts
//3. Left-sidebar for userDeatails.