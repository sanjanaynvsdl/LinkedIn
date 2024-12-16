import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { Loader, MessageCircle, Send, Share2, ThumbsUp, Trash2 } from 'lucide-react'; 
import PostAction from '../components/PostAction.jsx'
import {formatDistanceToNow} from 'date-fns'

const Post = ({post}) => {

    // const {postId} = useParams()

    
    const {data:authUser} = useQuery({ queryKey:["authUser" ]});
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments]= useState(post.comments || []);
    // const isOwner= authUser._id === post.author._id;
    // const isLiked = post.likes.includes(authUser._id);

    console.log('post:', post);
    console.log('authUser', authUser);
    const isOwner = authUser && authUser._id === post.author._id;
    const isLiked = authUser && post.likes.includes(authUser._id);
    


    const queryClient = useQueryClient();


    //Delete-post
    const {mutate: deletePost, isPending: isDeletingPost} = useMutation({
        mutationFn: async()=> {
            await axiosInstance.delete(`/post/delete/${post._id}`)
        },
        onSuccess:()=> {
            queryClient.invalidateQueries({queryKey:['posts']});
            toast.success("Post deleted successfully!");
        },
        onError:(err)=> {
            toast.error(err.response.data.message || "Something went wrong!");
        },
    });


    //Create comment for a post
    const {mutate: createComment , isPending:isCreatingComment} = useMutation({
        mutationFn: async(newComment)=> {
            await axiosInstance.post(`/post/${post._id}/comment`, {content: newComment});
        },
        onSuccess:()=> {
            queryClient.invalidateQueries({queryKey:['posts']});
            // toast.success("Comment created successfully!");
            
        },
        onError:(error)=> {
            toast.error(error.response.data.message || "Faied to add comment");

        }
    });

    //Like the post,
    const {mutate: likePost, isPending:isLikingpost} = useMutation({
        mutationFn:async(isLiked)=> {
            await axiosInstance.post(`/post/${post._id}/like`);
        },
        onSuccess: ()=> {
            queryClient.invalidateQueries({queryKey:["posts"]});
            // queryClient.invalidateQueries({queryKey:['post', postId]});

            // toast.success("Liked the post");
        },
    });


    const handleDeletePost=()=> {
        if(!window.confirm("Are your sure you want to delete this post")) return;
        deletePost();
    } 

    const handleLikePost= async()=> {
        if(isLikingpost) return;
        likePost();
    }

    const handleAddComment= async(e)=> {
        e.preventDefault();
        //Handling empty, comment -> 
        if(newComment.trim()) {
            createComment(newComment);
            setNewComment("");
            setComments([
                ...comments,
                {
                    content:newComment,
                    user : {
                        _id : authUser._id,
                        name:authUser.name,
                        profilePicture:authUser.profilePicture,
                    },
                    createdAt:new Date(),
                },
            ]);

        }

    }

  return (
    <div className='bg-secondary rounded-lg shadow mb-4'>
        <div className='p-4'>
            <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center'>

                    <Link to = {`/profile/${post?.author?.username}`}>
                        <img 
                            src={post.author.profilePicture || "/avatar.png"}
                            alt={post.author.name}
                            className='size-10 rounded-full mr-3'
                        />
                    </Link>
                    <div>
                        <Link to={`/profile/${post?.author?.username}`}>
                            <h3 className='font-semibold'>{post.author.username}</h3>
                        </Link>
                        <p className='text-xs text-info'>{post.author.headline}</p>
                        <p className='text-xs text-info'>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true})}</p>
                    </div>
                </div>
                {isOwner && (
                    <button onClick={handleDeletePost} className='text-red-500 hover:text-red-700'>
                        {isDeletingPost ? <Loader size={18} className='animate-spin' /> : <Trash2 size={18}/> }
                    </button>
                )}
            </div>
            <p className='mb-4 '>{post.content}</p>
            {post.image && <img src={post.image} alt='Post content' className='rounded-lg w-full mb-4'/>}
            
            <div className='flex justify-between text-info'>
                <PostAction
                 icon= {<ThumbsUp size={18} className={isLiked ?  "text-blue-500 fill-blue-300" : " " } />}
                 text={`Like (${post.likes.length})`}
                 onClick={handleLikePost}
                />

                <PostAction
                 icon = {<MessageCircle size={18}/>}
                 text = {`comment (${comments.length})`}
                 onClick = { ()=> setShowComments(!showComments)}
                />

                <PostAction 
                 icon = {<Share2 size={18}/> }
                 text = 'Share'
                />
            </div>
        </div>
        {showComments && (
            <div className='px-4 pb-4'>
                <div className='mb-4 max-h-60 overflow-y-auto'>
                    {comments.map((comment) => (
                        <div key={comment._id} className='mb-2 bg-base-100 p-2 rounded flex items-start'>
                            <img
                                src={comment.user.profilePicture || "/avatar.png"}
                                alt={comment.user.name}
                                className='w-8 h-8 rounded-full mr-2 flex-shrink-0'
                            />
                            <div className='flex-grow'>
                                <div className='flex items-center mb-1'>
                                    <span className='font-semibold mr-2'>{comment.user.name}</span>
                                    <span className='text-xs text-info'>
                                        {formatDistanceToNow(new Date(comment.createdAt))}
                                    </span>
                                </div>
                                <p>{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleAddComment} className='flex items-center'>
                    <input
                        type='text'
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder='Add a comment...'
                        className='flex-grow p-2 rounded-l-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary'
                    />

                    <button
                        type='submit'
                        className='bg-primary text-white p-2 rounded-r-full hover:bg-primary-dark transition duration-300'
                        disabled={isCreatingComment}
                    >
                        {isCreatingComment ? <Loader size={18} className='animate-spin' /> : <Send size={18} />}
                    </button>
                </form>
            </div>
        )}
    </div>
  )
}

export default Post
