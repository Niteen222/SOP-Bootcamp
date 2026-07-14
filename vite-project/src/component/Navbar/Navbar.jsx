import React from 'react';
import '../Navbar/Navbar.css';
import logo from "../Navbar/logo.png";
import { useMediaQuery } from 'react-responsive';
// import { NavLink } from 'react-router-dom';

function Navbar() {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });

    return (
        <>
            <nav className="navbar navbar-expand-lg sticky-top " style={{ background: "var(--GLASS, #FFFFFF99)" }}>
                <div className="container border-bottom">
                    <a className="navbar-brand d-lg-none d-flex align-items-center gap-2" href="#">
                        <img src={logo} height="50" alt="Logo" />
                        <span style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#00A3C4',
                            textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                            margin: '0',
                            letterSpacing: '0.05em'
                        }}>LogicTree</span>
                    </a>
                    <button className="navbar-toggler border-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvas" aria-controls="offcanvas" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvas" aria-labelledby="offcanvasLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="offcanvasLabel" style={{ display: isMobile ? 'none' : isTablet ? 'none' : 'block' }}>
                                <a className="navbar-brand d-lg-none d-flex align-items-center gap-2">
                                    <img src={logo} height="50" alt="Logo" />
                                    <span style={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '20px',
                                        fontWeight: '600',
                                        color: '#00A3C4',
                                        textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                                        margin: '0',
                                        letterSpacing: '0.05em'
                                    }}>LogicTree</span>
                                </a>
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <ul className="navbar-nav flex-grow-1 justify-content-between" style={{ alignItems: isMobile ? 'flex-start' : isTablet ? 'flex-start' : 'center' }}>
                                <li className="nav-item mb-4 mt-3" >
                                    <a className="nav-link d-flex align-items-center gap-2 " href="#" style={{ display: isMobile ? 'none' : isTablet ? 'none' : 'block', alignItems: 'center' }}>
                                        <img src={logo} height="50" alt="Logo" />
                                        <span
                                            style={{
                                                fontFamily: 'Poppins, sans-serif',
                                                fontSize: '25px',
                                                fontWeight: '600',
                                                color: '#00A3C4',
                                                textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                                                margin: '0',
                                                letterSpacing: '0.05em'
                                            }}
                                        >LogicTree</span>
                                    </a>
                                </li>
                                <li className="nav-item mb-4 mt-3"><a className="nav-link " href="#" style={{ fontSize: '18px', fontWeight: '500', display: 'flex', gap: '18px', flexDirection: isMobile ? 'column' : isTablet ? 'column' : '' }}>
                                    <span >
                                        <div
                                            to="/"
                                            className={({ isActive }) =>
                                                `nav-item nav-link  ${isActive ? "active" : ""
                                                }`
                                            }
                                        >
                                            Learn
                                        </div>
                                    </span>
                                    <span>
                                        <div
                                            to="doctor"
                                            className={({ isActive }) =>
                                                `nav-item nav-link  ${isActive ? "active" : ""
                                                }`
                                            }
                                        >
                                            Quiz
                                        </div>
                                    </span>
                                    <span>
                                        <div
                                            to="about"
                                            className={({ isActive }) =>
                                                `nav-item nav-link  ${isActive ? "active" : ""
                                                }`
                                            }
                                        >
                                            AI Interview
                                        </div>
                                    </span>
                                    <span>
                                        <div
                                            to="contact"
                                            className={({ isActive }) =>
                                                `nav-item nav-link  ${isActive ? "active" : ""
                                                }`
                                            }
                                        >
                                            Leaderboard
                                        </div>
                                    </span>
                                </a></li>
                                <li className="nav-item mb-4 mt-3">
                                    <div style={{ background: '#00A3C4', gap: '8px', height: isMobile ? '38px' : '54px', borderRadius: '30px', display: 'flex', alignItems: 'center', cursor: 'pointer', width: isMobile ? '180px' : '200px', justifyContent: 'center' }}>
                                        <span data-bs-toggle="modal" data-bs-target="#signupModal" style={{ fontWeight: '500', fontSize: isMobile ? '15px' : '18px', color: 'rgba(255, 255, 255, 1)' }}>Create account</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Login Modal */}
            <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title " id="loginModalLabel" style={{color:'rgba(75, 85, 99, 1)',fontWeight:'600',fontSize:'22px'}}>Login to LogicTree</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="container my-2 d-flex flex-column justify-content-center align-items-center">
                                <div className="col-12">
                                    <label htmlFor="loginEmail" className="form-label" style={{color:'rgba(75, 85, 99, 1)',fontWeight:'600',fontSize:'18px'}}>Email</label>
                                    <input type="email" className="form-control" id="loginEmail" placeholder="Enter Your Email" />
                                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                </div>
                                <div className="col-12">
                                    <br />
                                    <label htmlFor="loginPassword" className="form-label" style={{color:'rgba(75, 85, 99, 1)',fontWeight:'600',fontSize:'18px'}}>Password</label>
                                    <input type="password" className="form-control" id="loginPassword" placeholder="Enter Your Password" />
                                    <small id="passwordHelp" className="form-text text-muted">We'll never share your password with anyone else.</small>
                                </div>
                                <br />
                                <div className="col-12">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="loginCheck" />
                                        <label className="form-check-label" htmlFor="loginCheck">
                                            I accept all terms $ consitions
                                        </label>
                                    </div>
                                    <br />
                                </div>
                                <div className="col-12">
                                    <button type="submit" className="btn " style={{ background: '#00A3C4', color: 'rgba(255, 255, 255, 1)', width: '100%',fontSize:'18px' }}>Login</button>
                                </div>
                                <br />
                                <div className="col-12 text-center">
                                    <span>Don't have an account? </span>
                                    <span data-bs-toggle="modal" data-bs-target="#signupModal" style={{ color: 'blue', cursor: 'pointer',fontSize:'18px',textDecoration:'underline' }}>Signup</span>
                                </div>

                            </div>
                        </div>
                        {/* <div className="modal-footer">
                            <button type="button" className="btn " style={{ background: 'rgba(95, 111, 255, 1)', color: 'rgba(255, 255, 255, 1)',fontSize:'18px' }} data-bs-dismiss="modal">Close</button>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Signup Modal */}
            <div className="modal fade" id="signupModal" tabIndex="-1" aria-labelledby="signupModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title" id="signupModalLabel" style={{color:'rgba(75, 85, 99, 1)',fontWeight:'600',fontSize:'22px'}}>Create your LogicTree Account</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="container my-2 d-flex flex-column justify-content-center align-items-center">
                                <div className="col-12">
                                    <label htmlFor="signupName" className="form-label" style={{color:'rgba(75, 85, 99, 1)',fontWeight:'600',fontSize:'18px'}}>Name</label>
                                    <input type="text" className="form-control" id="signupName" placeholder="Enter Your Name" />
                                </div>
                                <div className="col-12">
                                    <br />
                                    <label htmlFor="signupPhone" className="form-label" style={{color:'rgba(75, 85, 99, 1)',fontWeight:'600',fontSize:'18px'}}>Phone Number</label>
                                    <input type="number" className="form-control" id="signupPhone" placeholder="Enter Your Mobile Number" />
                                </div>
                                <div className="col-12">
                                    <br />
                                    <label htmlFor="signupEmail" className="form-label" style={{color:'rgba(75, 85, 99, 1)',fontWeight:'600',fontSize:'18px'}}>Email</label>
                                    <input type="email" className="form-control" id="signupEmail" placeholder="Enter Your Email" />
                                </div>
                                <div className="col-12">
                                    <br />
                                    <label htmlFor="signupPassword" className="form-label" style={{color:'rgba(75, 85, 99, 1)',fontWeight:'600',fontSize:'18px'}}>Password</label>
                                    <input type="password" className="form-control" id="signupPassword" placeholder="Enter Your Password" />
                                </div>
                                <div className="col-12">
                                    <br />
                                    <label htmlFor="signupConfirmPassword" className="form-label" style={{color:'rgba(75, 85, 99, 1)',fontWeight:'600',fontSize:'18px'}}>Confirm Password</label>
                                    <input type="password" className="form-control" id="signupConfirmPassword" placeholder="Enter Your Confirm Password" />
                                </div>
                                <br />
                                <div className="col-12">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="loginCheck" />
                                        <label className="form-check-label" htmlFor="loginCheck">
                                            I accept all terms $ consitions
                                        </label>
                                    </div>
                                    <br />
                                </div>
                                <br />
                                <div className="col-12 ">
                                    <button type="submit" className="btn" style={{ background: '#00A3C4', color: 'rgba(255, 255, 255, 1)', width: '100%',fontSize:'18px' }}>Create Account</button>
                                </div>
                                <br />
                                <div className="col-12 text-center">
                                    <span>Already have an account? </span>
                                    <span data-bs-toggle="modal" data-bs-target="#loginModal" style={{ color: 'blue', cursor: 'pointer',fontSize:'18px',textDecoration:'underline' }}>Login</span>
                                </div>
                            </div>
                        </div>
                        {/* <div className="modal-footer">
                            <button type="button" className="btn" style={{ background: 'rgba(95, 111, 255, 1)', color: 'rgba(255, 255, 255, 1)',fontSize:'18px' }} data-bs-dismiss="modal">Close</button>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;