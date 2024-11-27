import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import {Link} from 'react-router-dom'

const FriendRequest = ({request}) => {
    const queryClient = useQueryClient();

    const {mutate:acceptConnectionRequest } = useMutation({
        mutationFn: (requestId)=> axiosInstance.put(`/connections/accept/${requestId}`),
        onSuccess : ()=> {
            toast.success("Connection request accpeted!");
            queryClient.invalidateQueries({ queryKey: ['connectionRequests']})
        },
        onError : (error)=> {
            toast.error(error.response.data.error);
        }
    });

    const { mutate:rejectConnectionRequest } = useMutation({
        mutationFn: (requestId)=> axiosInstance.put(`/connections/reject/${requestId}`),
        onSuccess : ()=> {
            toast.success("Connection request rejected!");
            queryClient.invalidateQueries({ queryKey: ['connectionRequests']})
        },
        onError : (error)=> {
            toast.error(error.response.data.error);
        },
    });

  return (
    <div className='bg-white rounded-lg shadow p-4 flex items-center justify-between transition-all  hover:shadow-md'>
        <div className='flex items-center gap-4'>
            <Link to={`/profile/${request.sender.username}`}>
                <img
                    src ={request.sender.profilePicture || './avatar.png'} 
                    alt = {request.name}
                    className='w-16 h-16 rounded-full object-cover'
                />
            </Link>
            <div>
                <Link to={`/profile/${request.sender.username}`} className='font-semibold text-lg'>
                    {request.sender.name}
                </Link>
                <p className='text-gray-600'>{request.sender.headline}</p>
            </div>
        </div>

        <div className='space-x-2'>
            <button 
            onClick={()=> acceptConnectionRequest(request._id)}
            className='bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors'>
            Accept
            </button>

            <button
            onClick={()=> rejectConnectionRequest(request._id)}
            className='bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors'>
                Reject
            </button>
        </div>
    </div>
  )
}

export default FriendRequest
