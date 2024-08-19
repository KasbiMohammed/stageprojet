import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div>
    <div class="pre-header">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-sm-8 col-7">
          <ul class="info">
            <li><a href="#"><i class="fa fa-envelope"></i>KasbiMohammed2000@gmail.com</a></li>
            <li><a href="#"><i class="fa fa-phone"></i>0672254960</a></li>
          </ul>
        </div>
        <div class="col-lg-4 col-sm-4 col-5">
         
        </div>
      </div>
    </div>
  </div>
    <header class="header-area header-sticky wow slideInDown" data-wow-duration="0.75s" data-wow-delay="0s">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <nav class="main-nav">
          
            <Link  class="logo">
              <img style={{width: "100px"}} src="MonPHOTO.jpg" alt=""/>
            </Link>
           
            <ul class="nav">
             
              <li class="scroll-to-section"><Link to="/login">login</Link></li> 
              <li class="scroll-to-section"><div class="border-first-button"><Link to="/registre">registre</Link></div></li> 

            </ul>        
            <Link class='menu-trigger'>
                <span>Menu</span>
            </Link>
           
          </nav>
        </div>
      </div>
    </div>
  </header>
  </div>
  );
}

export default Navbar;
