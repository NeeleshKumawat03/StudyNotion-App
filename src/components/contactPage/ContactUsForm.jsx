import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import CountryCode from "../../data/countrycode.json"
import { apiConnector } from "../../services/apiConnector"
import { contactusEndpoint } from "../../services/apis"

const ContactUsForm = () => {
    const [loading, setLoading] = useState(false)
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitSuccessful}
    } = useForm();

    const submitContactForm = async(data) => {
        try {
            setLoading(true);
            const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data);
            setLoading(false);
        }
        catch(error) {
            console.log("Error", error.message);
            setLoading(false);
        }
    }

    useEffect(() => {
        if(isSubmitSuccessful) {
            reset({
                email: "",
                firstName: "",
                lastName: "",
                message: "",
                phoneNo: ""
            })
        }
    }, [isSubmitSuccessful, reset])

  return (
    <form className="flex flex-col gap-7" onSubmit={handleSubmit(submitContactForm)}>
        <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
                <label htmlFor='firstname' className="lable-style" >First Name</label>
                <input 
                    type="text"
                    name="firstname"
                    id='firstname'
                    className="form-style"
                    placeholder='Enter first name'
                    {...register("firstname", {required: true})}
                />
                {
                    errors.firstname && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Please enter your name
                        </span>
                    )
                }
            </div>
            <div className="flex flex-col gap-2 lg:w-[48%]">
                <label className="lable-style" htmlFor='lastname' >Last Name</label>
                <input 
                    type="text"
                    name="lastname"
                    id='lastname'
                    className="form-style"
                    placeholder='Enter last name'
                    {...register("lastname")}
                />
            </div>
        </div>
            
        <div className="flex flex-col gap-2">
            <label className="lable-style" htmlFor='email'>Email Address</label>
                <input 
                    type='email'
                    name='email'
                    id='email'
                    className="form-style"
                    placeholder='Enter Email Address'
                    {...register("email", {required: true})}
                />
                {
                    errors.email && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Please Enter Your Email Address
                        </span>
                    )
                }
        </div>
        
        <div className="flex flex-col gap-2">
            <label className="lable-style" htmlFor='phoneNumber'>Phone Number</label>
            <div className="flex gap-5">
                <div className="flex w-[81px] flex-col gap-2">
                    <select
                        name='dropdown'
                        id='dropdown'
                        className="form-style"
                        {...register("countrycode", {required: true})}
                    >
                        {
                            CountryCode.map((element, index) => (
                                <option key={index} value={element.code}>
                                    {element.code} - {element.country}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                    <input 
                        type='number'
                        name='phonenumber'
                        id='phonenumber'
                        className="form-style"
                        placeholder='0123456789'
                        {...register("phoneNo", 
                        {
                            required: {value: true, message: "Please enter Phone Number"},
                            maxLength: {value: 10, message: "Invalid Phone Number"},
                            minLength: {value: 8, message: "Invalid Phone Number"} 
                        })}
                    />
                </div>
            </div>
            {
                errors.phoneNo && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                        {errors.phoneNo.message}
                    </span>
                )
            }
        </div>

        <div className="flex flex-col gap-2">
            <label className="lable-style" htmlFor='message'>Message</label>
            <textarea
                name='message'
                id='message'
                cols="30"
                rows="7"
                className="form-style"
                placeholder='Enter Your Message Here'
                {...register("message", {required: true})}
            />
            {
                errors.message && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                        Please enter your message here
                    </span>
                )
            }
        </div>

        <button 
            type='submit'
            disabled={loading}
            className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
            ${
            !loading &&
            "transition-all duration-200 hover:scale-95 hover:shadow-none"
            }  disabled:bg-richblack-500 sm:text-[16px] `}
        >
            Send Message
        </button>
    </form>
  )
}

export default ContactUsForm