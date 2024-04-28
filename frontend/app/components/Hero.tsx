import React,{FC} from 'react'

type Props = {}

const Hero:FC<Props> = (props) => {
    return (
        <div className='h-[650px] flex text-black dark:text-white items-center justify-center'>
            Hero
        </div>
    )
}

export default Hero;
