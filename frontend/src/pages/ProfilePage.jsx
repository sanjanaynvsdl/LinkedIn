import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient , useMutation} from '@tanstack/react-query'
import { axiosInstance } from '../lib/axios'
import ProfileHeader from '../components/ProfilePageComp/ProfileHeader';
import AboutSection from '../components/ProfilePageComp/AboutSection';
import EducationSection from '../components/ProfilePageComp/EducationSection';
import ExperienceSection from '../components/ProfilePageComp/ExperienceSection';
import SkillSection from '../components/ProfilePageComp/SkillSection'
import toast from 'react-hot-toast';

const ProfilePage = () => {

    const { username } = useParams()
    const queryClient=  useQueryClient();
    const {data: authUser, isLoading} = useQuery({
        queryKey:["authUser"],
    }) 

    const {data:userProfile, isLoading:isUserProfileLoading } = useQuery({
        queryKey : ["userProfile", username],
        queryFn: ()=> axiosInstance.get(`/users/${username}`)
    })

    const {mutate:updateProfile} = useMutation({
        mutationFn: async (updateData)=> {
            await axiosInstance.put("/users/profile", updateData);
        },
        onSuccess: ()=> {
            toast.success("Profile updated successfully!")
            queryClient.invalidateQueries(["userProfile", username]);
        },
        onError: (error) => {
            if (error.response && error.response.status === 413) {
              toast.error('File is too large. Please upload a smaller file.');
            } else {
              toast.error(error.response?.data?.message || 'Something went wrong!');
            }
        },

    })

    if(isLoading || isUserProfileLoading) return null;
    //todo: check if it is being properly accessed!
    const isOwnProfile = authUser.username ===userProfile.data.user.username
    const userData = isOwnProfile ? authUser : userProfile.data.user;

    const handleSave= (updateData)=> {
        updateProfile(updateData)

    }
  return (
    <div className='max-w-4xl mx-auto p-4'>
        <ProfileHeader userData ={userData} isOwnProfile = {isOwnProfile} onSave = {handleSave}/>
        <AboutSection userData ={userData} isOwnProfile = {isOwnProfile} onSave = {handleSave}/>
        <EducationSection userData ={userData} isOwnProfile = {isOwnProfile} onSave = {handleSave}/>
        <ExperienceSection userData ={userData} isOwnProfile = {isOwnProfile} onSave = {handleSave}/>
        <SkillSection userData ={userData} isOwnProfile = {isOwnProfile} onSave = {handleSave}/>
    </div>
  )
}

export default ProfilePage
