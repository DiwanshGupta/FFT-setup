import React from 'react';
import "./Loader.css";

type Props = {}

export function Loader(props:Props) {
    return (
        <div className=' flex justify-center items-center h-screen'>
            <div className='loader'></div>
        </div>
    );
}
