import { Query, useQuery } from '@tanstack/react-query'
import React from 'react'
import { axiosInstance } from '../lib/axios';
import Sidebar from '../components/Sidebar';
import {UserPlus} from 'lucide-react'
import { connect } from 'mongoose';
import FriendRequest from '../components/FriendRequest'

const NetworkPage = ({user}) => {

    const {data : authUser} = useQuery({ QueryKey : ["authUser"]});
    const { data : connectionRequests} = useQuery({
        queryKey: ["connectionRequests"],
        queryFn: ()=> axiosInstance.get('/connections/requests'),
        
    });
    // console.log("requests of user" , connectionRequests);
    // console.log("length of connections req : " ,connectionRequests?.data?.requests.length)

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='col-span-1 lg:col-span-1'>
        <Sidebar user={user}/>
      </div>
      <div className='col-span-1 lg:col-span-3'>
        <div className='bg-secondary rounded-lg shadow p-6 mb-6'>
            <h1 className='text-2xl font-bold mb-6'>My Network</h1>
            {connectionRequests?.data?.requests.length > 0  ? ( 
                <div className='mb-8'>
                    <h2 className='text-xl font-semibold mb-2'>
                    Connection Request
                    </h2>
                    <div className='space-y-4'>
                        {connectionRequests.data.requests.map((request)=> (
                            <FriendRequest key={request.id} request = {request}/>
                        ))}
                    </div>

                </div>
            ) : (
                <div className='bg-white rounded-lg shadow p-6 text-center mb-6'>
					<UserPlus size={48} className='mx-auto text-gray-400 mb-4' />
						<h3 className='text-xl font-semibold mb-2'>No Connection Requests</h3>
						<p className='text-gray-600'>
							You don&apos;t have any pending connection requests at the moment.
						</p>
						<p className='text-gray-600 mt-2'>
							Explore suggested connections below to expand your network!
						</p>
				</div>)
            }
        </div>
      </div>
    </div>
  )
}

export default NetworkPage;
