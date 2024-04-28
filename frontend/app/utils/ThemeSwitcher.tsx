"use client";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { BiSun, BiMoon } from "react-icons/bi";


const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true)
    }, []);

    return (
        <>
            <div className=" flex items-center justify-center mx-4">
                { theme === "light" ? (
                    <BiMoon
                        className=" cursor-pointer"
                        fill="blank"
                        size={ 25 }
                        onClick={ () => setTheme("dark") }
                    />
                ) : (
                    <BiSun
                        className=" cursor-pointer"
                        fill="blank"
                        size={ 25 }
                        onClick={ () => setTheme("light") }
                    />
                )}
            </div>
        </>
    )
}

export default ThemeSwitcher;