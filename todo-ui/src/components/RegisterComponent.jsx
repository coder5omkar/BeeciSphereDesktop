import React, { useState } from 'react'
import { registerAPICall } from '../services/AuthService'
import { useNavigate } from 'react-router-dom';  // for navigation

const RegisterComponent = () => {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})  // To store error messages
    const [successMessage, setSuccessMessage] = useState('')  // To show success message
    const navigate = useNavigate();  // Hook to navigate to the login page

    function handleRegistrationForm(e) {
        e.preventDefault();

        // Validation
        let formErrors = {};
        if (!name) formErrors.name = "Name is required.";
        if (!username) formErrors.username = "Username is required.";
        if (!email) formErrors.email = "Email is required.";
        if (!password) formErrors.password = "Password is required.";

        // Check if there are errors
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;  // Prevent form submission if validation fails
        }

        const register = { name, username, email, password }

        // Call API to register
        registerAPICall(register).then((response) => {
            console.log(response.data);
            setSuccessMessage("Registration successful!");  // Set success message
            setErrors({});  // Clear any previous errors

            // After 2 seconds, navigate to login page
            setTimeout(() => {
                navigate('/login');
            }, 4000);
        }).catch(error => {
            console.error(error);
            setSuccessMessage("");  // Clear success message in case of error
            setErrors({ api: "Registration failed. Please try again." });  // Set API error message
        })
    }

    return (
        <div className='container'>
            <br /> <br />
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                    <div className='card'>
                        <div className='card-header'>
                            <h2 className='text-center'> User Registration Form </h2>
                        </div>

                        <div className='card-body'>
                            <form>
                                {/* Name */}
                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'> Name </label>
                                    <div className='col-md-9'>
                                        <input
                                            type='text'
                                            name='name'
                                            className='form-control'
                                            placeholder='Enter name'
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        {errors.name && <small className="text-danger">{errors.name}</small>}
                                    </div>
                                </div>

                                {/* Username */}
                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'> Username </label>
                                    <div className='col-md-9'>
                                        <input
                                            type='text'
                                            name='username'
                                            className='form-control'
                                            placeholder='Enter username'
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                        {errors.username && <small className="text-danger">{errors.username}</small>}
                                    </div>
                                </div>

                                {/* Email */}
                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'> Email </label>
                                    <div className='col-md-9'>
                                        <input
                                            type='text'
                                            name='email'
                                            className='form-control'
                                            placeholder='Enter email address'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        {errors.email && <small className="text-danger">{errors.email}</small>}
                                    </div>
                                </div>

                                {/* Password */}
                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'> Password </label>
                                    <div className='col-md-9'>
                                        <input
                                            type='password'
                                            name='password'
                                            className='form-control'
                                            placeholder='Enter password'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        {errors.password && <small className="text-danger">{errors.password}</small>}
                                    </div>
                                </div>

                                {/* Display API error */}
                                {errors.api && <div className="text-danger">{errors.api}</div>}

                                {/* Success message */}
                                {successMessage && <div className="text-success">{successMessage}</div>}

                                {/* Submit Button */}
                                <div className='form-group mb-3'>
                                    <button className='btn btn-primary' onClick={(e) => handleRegistrationForm(e)}>Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterComponent
