import React from 'react'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import {toast} from 'react-hot-toast';
import {Link} from 'react-router-dom';
import {Clock, Check, X, UserCheck, UserPlus} from 'lucide-react';

const RecommendedUser = ({user}) => {

  const queryClient = useQueryClient();

  //Connection-status
  const {data:connectionStatus, isLoading}= useQuery({
    queryKey:["connectionStatus", user._id],
    queryFn: async()=> (
      await axiosInstance.get(`/connections/status/${user._id}`)
    )
  });


  //ConnectionRequest
  const {mutate: sendConnectionRequest, isPending: isConnectionRequest} = useMutation({
    mutationFn: async(userId)=> (
      await axiosInstance.post(`/connections/request/${userId}`)
    ),
    onSuccess: ()=> {
      toast.success("Connection request sent successfully!");
      queryClient.invalidateQueries({queryKey: ["connectionStatus", user._id]});
    },
    onError:(err)=> {
      toast.error(err.response?.data?.error || 'An error occurred!')
    },

  });


  //Accpet Request,
  const {mutate: acceptRequest} = useMutation({
    mutationFn: async (requestId)=> (
      await axiosInstance.put(`/connections/accept/${requestId}`)
    ),
    onSuccess:()=> {
      toast.success("Connection request accepted")
      queryClient.invalidateQueries({queryKey:["connectionStatus", user._id]})
      //todo: check if we need to add other invalidate queries,
    },
    onError:(err)=> {
      toast.error(err.response?.data?.error || 'An error occurred!')
    }
  });


  //Reject Request,
  const {mutate: rejectRequest} = useMutation({
    mutationFn: async(requestId)=> (
      await axiosInstance.put(`/connections/reject/${user._id}`)
    ),
    onSuccess:()=> {
      toast.success("Connection request rejected")
      queryClient.invalidateQueries({queryKey:["connectionStatus", user._id]})
      //todo: check if we need to add other invalidate queries,
    },
    onError:(err)=> {
      toast.error(err.response?.data?.error || 'An error occurred!')
    }
  });


  const renderButton = ()=> {
    console.log("connection-status", connectionStatus);
    if(isLoading) {
      <button 
        disabled
        className='px-3 py-4 rounded-full text-sm bg-gray-200 text-gray-500'>
        Loading ...
      </button>
    }
    switch(connectionStatus?.data?.status) {
      case "pending" : 
      return (
        <button 
          disabled
          className='px-3 py-1 rounded-full text-sm bg-yellow-500 text-white flex items-center'
        >
          <Clock size={16} className='mr-1'/>
          Pending
        </button>
      );
    case "received" :
      return (
        <div className='flex gap-2 justify-center'>
          <button
            onClick={() => acceptRequest(connectionStatus.data.requestId)}
            className={`rounded-full p-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white`}
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => rejectRequest(connectionStatus.data.requestId)}
            className={`rounded-full p-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white`}
          >
            <X size={16} />
          </button>
        </div>
      );

      case "connected" :
        return (
					<button
						className='px-3 py-1 rounded-full text-sm bg-green-500 text-white flex items-center'
						disabled
					>
						<UserCheck size={16} className='mr-1' />
						Connected
					</button>
				);
      
      default :
        return (
          <button
            className='px-3 py-1 rounded-full text-sm border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200 flex items-center'
            onClick={handleConnect}
          >
            <UserPlus size={16} className='mr-1' />
            Connect
          </button>
        );
    }
  };

  const handleConnect=()=> {
    if(connectionStatus?.data?.status==='not_connected') {
      sendConnectionRequest(user._id);
    }
    
  }
 
  return (
    <div className='flex items-center justify-between mb-4'>
      <Link to={`/profile/${user.username}`} className='flex items-center flex-grow'>
				<img
					src={user.profilePicture || "/avatar.png"}
					alt={user.name}
					className='w-12 h-12 rounded-full mr-3'
				/>
				<div>
					<h3 className='font-semibold text-sm'>{user.name}</h3>
					<p className='text-xs text-info'>{user.headline}</p>
				</div>
			</Link>
      {renderButton()}
    </div>
  )
}

export default RecommendedUser
