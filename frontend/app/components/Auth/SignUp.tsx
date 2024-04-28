"use client"
import React, { FC, useEffect, useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { styles } from '@/app/styles/style';
import { userRegistration } from '@/redux/features/auth/authSlice';
import { useRegisterMutation } from '@/redux/features/auth/authApi';
import toast from 'react-hot-toast';

type Props = {
    setRoute: (route: string) => void;
}
const schema = Yup.object().shape({
    name: Yup.string().required("please enter your name!"),
    email: Yup.string().email("Invalid email!").required("Please Enter Your Email!"),
    password: Yup.string().required("Please  Enter your Password!").min(6),
})

const SignUp: FC<Props> = ({ setRoute }) => {
    const [show, setShow] = useState(false);
    const [register, {isSuccess, data, error}]:any = useRegisterMutation();

    useEffect(()=>{
        if(isSuccess){
            const message = data?.message || "Registration Successful";
            toast.success(message);
            setRoute("Verification");
        }
        if(error){
            if("data" in error){
                const errorData = error as any;
                toast.error(errorData?.data.message);
            }
        }
    },[isSuccess,error]);

    // console.log('Login')
    const formik = useFormik({
        initialValues: { name:"", email: "", password: "" },
        validationSchema: schema,
        onSubmit: async ({ name,email, password }) => {
            const data = {
                name, email, password,
            };
            await register(data);
        }
    });
    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <div className=' w-full h-screen'>
            <div className={ `${styles.title}` }>
                Join to FFT
            </div>
            <form onSubmit={ handleSubmit }>
                <div className='mb-3'>
                    <label
                        className={ `${styles.label}` }
                        htmlFor='name'
                    >Enter your Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder='John the Don'
                        value={ values.name }
                        onChange={ handleChange }
                        className={ `${errors.name && touched.name && " border-red-500"} ${styles.input}` }
                    />
                    { errors.name && touched.name && (
                        <span className=" border-red-500 text-red-500 pt-2 block">{ errors.name }</span>
                    ) }
                </div>
                <label
                    className={ `${styles.label}` }
                    htmlFor='email'
                >Enter your Email
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder='example@gmail.com'
                    value={ values.email }
                    onChange={ handleChange }
                    className={ `${errors.email && touched.email && " border-red-500"} ${styles.input}` }
                />
                { errors.email && touched.email && (
                    <span className=" border-red-500 text-red-500 pt-2 block">{ errors.email }</span>
                ) }
                <div className=' w-full mt-5 relative mb-1'>
                    <label
                        className={ `${styles.label}` }
                        htmlFor='password'
                    >Enter your Password
                    </label>
                    <input
                        type={ !show ? "password" : "text" }
                        name="password"
                        id="password"
                        placeholder="abc#@!123..."
                        value={ values.password }
                        onChange={ handleChange }
                        className={ `${errors.password && touched.password && " border-red-500"} ${styles.input}` }
                    />
                    { !show ? (
                        <AiOutlineEyeInvisible
                            className=' absolute bottom-3 right-2 z-1 cursor-pointer'
                            size={ 20 }
                            onClick={ () => setShow(true) }
                        />
                    ) : (
                        <AiOutlineEye
                            className=' absolute bottom-3 right-2 z-1 cursor-pointer'
                            size={ 20 }
                            onClick={ () => setShow(false) }
                        />
                    ) }
                </div>
                { errors.password && touched.password &&
                    <span className=" border-red-500 text-red-500 p-2 block">{ errors.password }</span> 
                }
                <div className=' w-full mt-8'>
                    <input
                        type='submit'
                        value="Sign Up"
                        className={ `${styles.button}` }
                    />
                </div>
                <h5 className='text-center pt-4 font-Poppins text-[14px] text-black dark:text-white'>
                    Or join with
                </h5>
                <div className='flex items-center justify-center my-3'>
                    <FcGoogle size={30} className=' cursor-pointer mr-2'/>
                    <AiFillGithub size={30} className=' cursor-pointer ml-2 text-black dark:text-white'/>
                </div>
                <h5 className=' text-center pt-4 font-Poppins text-[14px]'>
                    Already have an account?{""}
                    <span 
                        className='text-[#2190ff] pl-1 cursor-pointer'
                        onClick={() => setRoute("Login")}
                    >Sign in
                    </span>
                </h5><br />
            </form>
        </div>
    )
}

export default SignUp
