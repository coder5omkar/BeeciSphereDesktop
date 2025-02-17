import React, { useState } from 'react'
import { loginAPICall, saveLoggedInUser, storeToken } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure this import is present
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Ensure this import is present

const LoginComponent = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('');  // State to hold error message
    const navigator = useNavigate();

    async function handleLoginForm(e){
        e.preventDefault();

        // Check if username or password is empty
        if (!username || !password) {
            setError("Please enter both username and password.");
            return; // Exit the function if fields are empty
        }

        await loginAPICall(username, password)
            .then((response) => {
                console.log(response.data);

                const token = 'Basic ' + window.btoa(username + ":" + password);
                storeToken(token);

                saveLoggedInUser(username);
                navigator("/todos");

                window.location.reload(false);
            })
            .catch((error) => {
                console.error(error);
                setError("Login failed. Please enter valid credentials.");
            });
    }

  return (
    <div className='container'>
        <br /> <br />
        <div className='row'>
            <div className='col-md-6 offset-md-3'>
                <div className='card'>
                    <div className='card-header'>
                        <h2 className='text-center'> Login Form </h2>
                    </div>

                    <div className='card-body'>
                        <form>

                            <div className='row mb-3'>
                                <label className='col-md-3 control-label'> Username</label>
                                <div className='col-md-9'>
                                    <input
                                        type='text'
                                        name='username'
                                        className='form-control'
                                        placeholder='Enter username'
                                        value={username}
                                        onChange={ (e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className='row mb-3'>
                                <label className='col-md-3 control-label'> Password </label>
                                <div className='col-md-9'>
                                    <input
                                        type='password'
                                        name='password'
                                        className='form-control'
                                        placeholder='Enter password'
                                        value={password}
                                        onChange={ (e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Show error message below the input fields */}
                            {error && <div className="text-danger mb-3">{error}</div>}

                            <div className='form-group mb-3'>
                                <button className='btn btn-primary' onClick={ (e) => handleLoginForm(e)}>Submit</button>
                            </div>
                        </form>
                        
                        {/* User Manual Link */}
                        <div className="user-manual">
                            <button className="btn btn-info" data-bs-toggle="modal" data-bs-target="#userManualModal">
                                View User Manual
                            </button>
                        </div>

                        {/* Modal for User Manual */}
                        <div className="modal fade" id="userManualModal" tabIndex="-1" aria-labelledby="userManualModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="userManualModalLabel">Bicee Management Application - User Manual</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                    <ol>
                                            <li>"Create BC" बटण वापरून Bicee तयार करा आणि संबंधित फॉर्म भरा.</li>
                                            <li>"View Member" (action कॉलममध्ये) बटण वापरून Bicee मध्ये सदस्य जोडा. सदस्यांची संख्या Bicee मध्ये असलेल्या चक्रांच्या संख्येशी जुळावी.</li>
                                            <li>"Add Bid" बटण (action कॉलममध्ये) वापरून बोली रक्कम, तारीख आणि विजेता प्रविष्ट करा. बोली रक्कम Bicee च्या एकूण रक्कम पेक्षा जास्त नसावी.</li>
                                            <li>विजेत्या बोलीनंतर, अनुपलब्ध सदस्यांसाठी पुढील हप्ता रक्कम आणि तारीख गणना केली जाईल. तसेच, योगदान दिलेल्या सदस्याच्या नावावर बोनस रक्कम जोडली जाईल.</li>
                                            <li>"Bulk Update" वैशिष्ट्य वापरून बोली विजेत्यांसाठी आणि न-बोली विजेत्यांसाठी एकाच वेळी समान रक्कम प्रविष्ट करा, ज्यामुळे आपले श्रम वाचवू शकतात. नोंदी तपासून नंतर सबमिट करा.</li>
                                            <li>मुख्य टेबलमध्ये, आपल्याला नवीनतम अद्ययावत Bicee वरवर दिसेल, आजचा बकाया Bicee लाल रंगात दाखवले जाईल, आणि पुढील दोन दिवसांतील बकाया Bicee पिवळ्या रंगात दिसेल.</li>
                                            <li>"View Member" विभागात, आपण संपूर्ण डेटा पाहू शकता, डेटा डाउनलोड करू शकता, किंवा WhatsApp द्वारे सदस्यांशी संपर्क साधू शकता, पूर्वनिर्धारित संदेशासह.</li>
                                            <li>हे अनुप्रयोग Bicee व्यवस्थापित करण्यासाठी आवश्यक असलेली मेहनत कमी करण्यासाठी डिझाइन केले आहे आणि डिझाइन पूर्णपणे कॉपीराइट केले आहे आणि डेव्हलपर्सच्या पूर्वपरवानगी शिवाय वितरणास प्रतिबंधित आहे.</li>
                                        </ol>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    </div>
  )
}

export default LoginComponent;
