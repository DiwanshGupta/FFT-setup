"use client"
import React, { FC, useState } from 'react';
import SideBarProfile from "./SideBarProfile"
import { useLogOutQuery } from '@/redux/features/auth/authApi';
import { signOut } from 'next-auth/react';
import ProfileInfo from "./ProfileInfo"

type Props = {
    user: any
}

const Profile: FC<Props> = ({ user }) => {
    const [scroll, setScroll] = useState(false);
    const [avatar, setAvarar] = useState(null);
    const [active, setActive] = useState(1);
    const [logout, setLogout] = useState(false);
    const { } = useLogOutQuery(undefined, { skip: !logout ? true : false });

    const logoutHandler = async () => {
        setLogout(true);
        try {
            await signOut();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    if (typeof window !== "undefined") {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 85) {
                setScroll(true);
            } else {
                setScroll(false);
            }
        });
    }
    return (
        <div className='w-[85%] flex mx-auto'>
            <div className={ `w-[20%] 880px:w-[310px] h-[450px] dark:bg-slate-900 bg-white bg-opacity-90 dark:border-[#ffffff1d] border-[#0000000b] rounded-[5px] shadow-xl dark:shadow-sm mt-[80px] mb-[80px] sticky ${scroll ? "top-[120px]" : "top-[30px]"
                } left-[30px]` }>
                <SideBarProfile
                    user={ user }
                    active={ active }
                    avatar={ avatar }
                    setActive={ setActive }
                    logoutHandler={ logoutHandler }
                />
            </div>
            {
                active == 1 && (
                    <div className='w-full h-full bg-transparent mt-[80px]'>
                        <ProfileInfo
                            avatar={ avatar }
                            user={ user }
                        />
                    </div>
                )
            }
        </div>
    );
}

export default Profile;