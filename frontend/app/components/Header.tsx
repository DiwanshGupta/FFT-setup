"use client";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import NavItems from "../utils/NavItems";
import ThemeSwitcher from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { HiOutlineUserCircle } from "react-icons/hi2";
import CustomModal from "../utils/CustomModal";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import { Verification } from "./Auth/Verification";
import { useSelector } from "react-redux";
import avatar from "../../public/assets/avatar.png";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  useLogOutQuery,
  useSocialAuthMutation,
} from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, open, setOpen, route, setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const { data } = useSession();
  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();
  const [logout, setLogout] = useState(false);
  const {} = useLogOutQuery(undefined, { skip: !logout ? true : false });

  useEffect(() => {
    if (!user) {
      if (data) {
        socialAuth({
          email: data?.user?.email,
          name: data?.user?.name,
          avatar: data?.user?.image,
        });
      }
    }
  }, [data, user]);
  useEffect(() => {
    // console.log("Data from Header*******************",data?.user?.image);
    if (data !== null || isSuccess) {
      // toast.success("Login Successfully");
    }
    if (data === null) {
      setLogout(true);
    }
    // console.log(data);
  }, []);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      setOpenSidebar(false);
    }
  };

  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[88] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[88] dark:shadow"
        }`}
      >
        <div className=" w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className=" w-full h-[80px] flex items-center justify-between p-3">
            <div className=" w-full h-[80px] flex items-center justify-between p-3">
              <Link
                href={"/"}
                className="text-[25px] font-Poppins font-[500] text-black dark:text-white"
              >
                FFT
              </Link>
            </div>
            <div className=" flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />
              {/* For Mobile */}
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  className=" cursor-pointer dark:text-white text-black"
                  size={25}
                  onClick={() => setOpenSidebar(true)}
                />
              </div>
              {user ? (
                <Link href={"/profile"} className="hidden 800px:block">
                  <span className="pl-12">
                    <Image
                      src={user.avatar ? user.avatar.url : avatar}
                      alt="Avatar"
                      className="  w-[35px] h-[35px] rounded-full cursor-pointer"
                      width={35}
                      height={35}
                      style={{
                        border: activeItem === 5 ? "2px solid #ffc107" : "none",
                      }}
                    />
                  </span>
                </Link>
              ) : (
                <HiOutlineUserCircle
                  className=" hidden 800px:block cursor-pointer dark:text-white text-black"
                  size={25}
                  onClick={() => {
                    setOpen(true);
                    // console.log(open);
                  }}
                />
              )}
            </div>
          </div>
        </div>
        {/* mobile sidebar */}
        {openSidebar && (
          <div
            className=" fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
              <div className=" w-full h-[80px] flex items-center justify-center p-3">
                <Link
                  href={"/"}
                  className="text-[25px] font-Poppins font-[500] text-black dark:text-white"
                >
                  FFT
                </Link>
              </div>
              <NavItems activeItem={activeItem} isMobile={true} />
              <HiOutlineUserCircle
                className="pl-5 pt-4 cursor-pointer dark:text-white text-black"
                size={50}
                onClick={() => setOpen(true)}
              />
              <br />
              <br />
              <p className=" text-[16px] px-2 pl-5 text-black dark:text-white">
                Copyright © 2024 FFT
              </p>
            </div>
          </div>
        )}
      </div>
      <div>
        {route === "Login" && (
          <>
            {open && (
              <CustomModal
                open={open}
                route={route}
                setOpen={setOpen}
                setRoute={setRoute}
                activeItem={activeItem}
                component={Login}
              />
            )}
          </>
        )}
        {route === "SignUp" && (
          <>
            {open && (
              <CustomModal
                open={open}
                setOpen={setOpen}
                route={route}
                setRoute={setRoute}
                activeItem={activeItem}
                component={SignUp}
              />
            )}
          </>
        )}
        {route === "Verification" && (
          <>
            {open && (
              <CustomModal
                open={open}
                setOpen={setOpen}
                route={route}
                setRoute={setRoute}
                activeItem={activeItem}
                component={Verification}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
