"use client"
import React,{FC,useState} from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Hero";

interface Props {}

const Page: FC<Props> = (props) => {

    const [open,setOpen] = useState(false);
    const [activeItem,setActiveItem] = useState(0);
    const [route,setRoute] = useState("Login");

    return (
        <div>
            <Heading
                title="FFT" 
                description="FFT is a platform for studentsto learn and get help from teachers" 
                keywords="FFT, NOTES, PYQS, MOSTDO, TUTORIALS...."
            />
            <Header
                open={open} 
                setOpen={setOpen} 
                activeItem={activeItem} 
                setRoute={setRoute}
                route={route}
            />
            <Hero />
        </div>
    )
}

export default Page;