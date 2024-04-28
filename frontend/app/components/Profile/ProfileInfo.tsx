import { styles } from '@/app/styles/style';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { useUpdateAvatarMutation } from '@/redux/features/user/userApi';
import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';

type Props = {
    avatar: string | null;
    user:any;
}

const ProfileInfo: FC<Props> = ({avatar, user}) => {
    const [name,setName] = useState(user && user.name);
    const [updateAvatar,{isSuccess, error}] = useUpdateAvatarMutation();
    const [loadUser,setLoadUser] = useState(false);
    const {} = useLoadUserQuery(undefined,{skip:loadUser ? false : true});

    const imageHandler = async (e:any) =>{
        const fileReader = new FileReader();
        fileReader.onload = () =>{
            if(fileReader.readyState === 2){
                const avatar = fileReader.result;
                updateAvatar({
                    avatar,
                })
            }
        };
        fileReader.readAsDataURL(e.target.files[0]);
    };
    useEffect(()=>{
        if(isSuccess){
            setLoadUser(true);
        }
        if(error){
            console.log(error);
        }
    },[isSuccess,error])
    const handleSubmit = async (e:any) => {};

    return (
        <>
            <div className=' w-full flex justify-center'>
                <div className='relative'>
                    <Image 
                        className='w-[120px] h-[120px] cursor-pointer border-[3px] border-[#d6da74] rounded-full'
                        src={user.avatar || avatar ? user.avatar.url || avatar: "/assets/avatar.png"} 
                        alt='avatar'
                        width={120}
                        height={120}
                    />
                    <input 
                        type='file'
                        name=''
                        id='avatar'
                        className=' hidden'
                        onChange={imageHandler}
                        accept='image/png,image/jpg,image/jepg,image/webp'
                    />
                    <label htmlFor='avatar'>
                        <div className='w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer'>
                            <AiOutlineCamera size={20} className='z-1'/>
                        </div>
                    </label>
                </div>
            </div>
            <br /><br />
            <div className=' flex justify-center w-full pl-6 880px:pl-10'>
                <form className='w-1/3' onSubmit={handleSubmit}>
                    <div className='880px:w-[50px] m-auto block pb-4'>
                        <div className='w-[100%]'>
                            <label className='block pb-2'>Full Name</label>
                            <input 
                                type='text'
                                className={`${styles.input} !w-[95%] mb-1 880px:mb-0`}
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className='w-[100%] pt-2'>
                            <label className='block pb-2'>Email Address</label>
                            <input 
                                type='text'
                                className={`${styles.input} !w-[95%] mb-1 880px:mb-0`}
                                required
                                readOnly
                                value={user?.email}
                            />
                        </div>
                        <input 
                            className={` w-full 880px:w-[250px] h-[40px] border border-[#d6da74] dark:text-[#fff] text-black rounded-[3px] mt-8 cursor-pointer`}
                            required
                            value="update"
                            type='submit'
                        />
                    </div>
                </form>
            </div>
        </>
    );
}

export default ProfileInfo