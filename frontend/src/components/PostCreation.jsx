import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import {Image, Loader} from 'lucide-react';

const PostCreation = ({user}) => {

    const [content, setContent]= useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const queryClient = useQueryClient();

    const {mutate: createPostMutation, isPending} = useMutation({
        mutationFn: async(postData)=> {
            const res = await axiosInstance.post("/post/create", postData, {
                headers:{"Content-Type": "application/json"}
            });

            return res.data
        },
        onSuccess: ()=> {
            resetForm();
            toast.success("Post created successfully!");
        },
        onError: (error)=> {
            console.log(data);
            toast.error(error.response.data.message || "Failed to create the post");
        }
    });

    //on Submitting post, 
    const handlePostCreation = async()=> {
        try {
            const postData = {content}
            if(image) postData.image= await readFileAsDataURL(image);
            createPostMutation(postData);
        } catch (error) {
            console.error("Error in handlePostCreation", error);
            
        }
    }


    //ON successfully creating the post, call this function
    const resetForm = ()=> {
        setContent("")
        setImage(null)
        setImagePreview(null)
    }

    //Image preview-cases
    const handleImageChange = (e)=> {
        const file = e.target.files[0];
        setImage(file);
        if(file) {
            readFileAsDataURL(file).then(setImagePreview)
        } else {
            setImagePreview(null);
        }
    }

    const readFileAsDataURL = (file)=> {
        return new Promise((res, rej)=> {
            const reader = new FileReader();
            reader.onloadend = ()=> res(reader.result);
            reader.onerror = rej;
            reader.readAsDataURL(file);
        });
    }
  return (
    <div className='bg-secondary rounded-lg shadow mb-4 p-4'>
        <div className='flex space-x-3'>
            <img src = {user.profilePicture || "./avatar.png"} className='size-12 rounded-full'></img>
            <textarea
				placeholder="Share your thoughts.."
				className='w-full p-3 rounded-lg bg-base-100 hover:bg-base-200 focus:bg-base-200 focus:outline-none resize-none transition-colors duration-200 min-h-[100px]'
				value={content}
				onChange={(e) => setContent(e.target.value)}
			/>
        </div>

        {/* Once the image has been uploaded then this will trigger- as imagePreview will be true */}
        {imagePreview && (
            <div className='mt-4'>
                <img src = {imagePreview} alt = 'Selected' className='w-fullh-auto rounded-lg'/>
            </div>
        )}

        <div className='flex justify-between items-center mt-4'>
            <div className='flex space-x-4'>
                <label className='flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer'>
                    <Image size={20} className='mr-2' />
                    <span>Photo</span>
                    <input type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
                </label>
            </div>
            <button 
                onClick={handlePostCreation}
                disabled={isPending}
                className='bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors duration-200'>
                {isPending ? <Loader className='size-5 animate-spin'/> : "Share"}
            </button>
            
        </div>
    </div>
  )
}

export default PostCreation
