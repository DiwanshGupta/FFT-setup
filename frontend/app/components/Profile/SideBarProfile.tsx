import Image from "next/image";
import React, { FC } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { GiBookshelf } from "react-icons/gi";
import { RiLockPasswordLine } from "react-icons/ri";

type Props = {
  user: any;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logoutHandler: any;
};

const SideBarProfile: FC<Props> = ({
  user,
  active,
  avatar,
  setActive,
  logoutHandler,
}) => {
  return (
    <div className="w-full">
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 1 ? "dark:bg-slate-800 bg-white" : " bg-transparent "
        }`}
        onClick={() => setActive(1)}
      >
        <Image
          src={
            user.avatar || avatar
              ? user.avatar.url || avatar
              : "/assets/avatar.png"
          }
          alt="avatar"
          className=" w-[30px] h-[30px] 880px:w-[40px] 880px:h-[40px] cursor-pointer rounded-full"
          width={30}
          height={30}
        />
        <h5 className="pl-2 880px:block font-Poppins dark:text-white text-black">
          My Account
        </h5>
      </div>
      {/* <div className={ `w-full flex items-center px-3 py-4 cursor-pointer ${active === 2 ? "dark:bg-slate-800 bg-white" : " bg-transparent "
                }` }
                onClick={ () => setActive(2) }
            >
                <RiLockPasswordLine size={20} fill='#fff' />
                <h5 className='pl-2 880px:block font-Poppins dark:text-white text-black'>
                    Change Password
                </h5>
            </div> */}
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 3 ? "dark:bg-slate-800 bg-white" : " bg-transparent "
        }`}
        onClick={() => setActive(3)}
      >
        <GiBookshelf size={20} fill="#fff" />
        <h5 className="pl-2 880px:block font-Poppins dark:text-white text-black">
          Enroll courses
        </h5>
      </div>
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 4 ? "dark:bg-slate-800 bg-white" : " bg-transparent "
        }`}
        onClick={() => logoutHandler()}
      >
        <AiOutlineLogout size={20} fill="#fff" />
        <h5 className="pl-2 880px:block font-Poppins dark:text-white text-black">
          Log Out
        </h5>
      </div>
    </div>
  );
};

export default SideBarProfile;
