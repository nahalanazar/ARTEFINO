import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector } from 'react-redux';

const Hero = () => {
    const { userInfo } = useSelector( (state) => state.userAuth);
    const PROFILE_IMAGE_DIR_PATH = 'http://localhost:5000/UserProfileImages/'
  return (
      <div className="w-100">
          <head>
        <meta charset="UTF-8" />
        <meta name="description" content="Ogani Template" />
        <meta name="keywords" content="Ogani, unica, creative, html" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>Artefino</title>

        {/* Include your CSS links and Google Font link here */}
            <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;600;900&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="http://localhost:5000/css/bootstrap.min.css" type="text/css"/>
<link rel="stylesheet" href="http://localhost:5000/css/font-awesome.min.css" type="text/css"/>
<link rel="stylesheet" href="http://localhost:5000/css/elegant-icons.css" type="text/css"/>
<link rel="stylesheet" href="http://localhost:5000/css/nice-select.css" type="text/css"/>
<link rel="stylesheet" href="http://localhost:5000/css/jquery-ui.min.css" type="text/css"/>
<link rel="stylesheet" href="http://localhost:5000/css/owl.carousel.min.css" type="text/css"/>
<link rel="stylesheet" href="http://localhost:5000/css/slicknav.min.css" type="text/css"/>
<link rel="stylesheet" href="http://localhost:5000/css/style.css" type="text/css"/>

<link href="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.20/dist/sweetalert2.min.css" rel="stylesheet"/>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css"></link>
        {/* Add other CSS links if necessary */}
      </head>

      {/* Header */}
      <header>
              {/* Your header content here */}
               {/* <!-- Humberger Begin --> */}
    <div className="humberger__menu__overlay"></div>
    <div className="humberger__menu__wrapper">
        <div className="humberger__menu__logo">
            <a href="#"><img src="http://localhost:5000/img/artefino-logo.png" alt=""/></a>
        </div>
        <div className="humberger__menu__cart">
            <ul>
                <li><a href="#"><i className="fa fa-heart"></i> <span>1</span></a></li>
                <li><a href="#"><i className="fa fa-shopping-bag"></i> <span>3</span></a></li>
            </ul>
            <div className="header__cart__price">item: <span>$150.00</span></div>
        </div>
        <div className="humberger__menu__widget">
            <div className="header__top__right__language">
                <img src="http://localhost:5000/img/language.png" alt=""/>
                <div>English</div>
                <span className="arrow_carrot-down"></span>
                <ul>
                    <li><a href="#">Spanis</a></li>
                    <li><a href="#">English</a></li>
                </ul>
            </div>
            {/* <% if (isAuthenticated) {%>
                <div className="header__top__right__auth">
                    <a href="#"><i className="fa fa-user"></i> <%= userName ? userName : "" %> </a>
                </div>
            <%} else {%>
                <div className="header__top__right__auth">
                    <a href="/login"><i className="fa fa-user"></i> Login</a>
                </div>
            <% } %>     */}
        </div>
        <nav className="humberger__menu__nav mobile-menu">
            <ul>
                <li className="active"><a href="./index.html">Home</a></li>
                <li><a href="./shop-grid.html">Shop</a></li>
                <li><a href="#">Pages</a>
                    <ul className="header__menu__dropdown">
                        <li><a href="./shop-details.html">Shop Details</a></li>
                        <li><a href="./shoping-cart.html">Shoping Cart</a></li>
                        <li><a href="./checkout.html">Check Out</a></li>
                        <li><a href="./blog-details.html">Blog Details</a></li>
                    </ul>
                </li>
                <li><a href="./blog.html">Blog</a></li>
                <li><a href="./contact.html">Contact</a></li>
            </ul>
        </nav>
        <div id="mobile-menu-wrap"></div>
        <div className="header__top__right__social">
            <a href="#"><i className="fa fa-facebook"></i></a>
            <a href="#"><i className="fa fa-twitter"></i></a>
            <a href="#"><i className="fa fa-linkedin"></i></a>
            <a href="#"><i className="fa fa-pinterest-p"></i></a>
        </div>
        <div className="humberger__menu__contact">
            <ul>
                <li><i className="fa fa-envelope"></i> hello@colorlib.com</li>
                <li>Free Shipping for all Order of $99</li>
            </ul>
        </div>
    </div>
    {/* <!-- Humberger End --> */}

    {/* <!-- Header Section Begin --> */}
              <header className="header" style={{ backgroundColor: '#f5f5f5' }}>
        <div className="header__top">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-6">
                        <div className="header__top__left">
                            <ul>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="header__top__right">
                            <div className="header__top__right__social">
                                <a href="#"><i className="fa fa-facebook"></i></a>
                                <a href="#"><i className="fa fa-twitter"></i></a>
                                <a href="#"><i className="fa fa-linkedin"></i></a>
                                <a href="#"><i className="fa fa-pinterest-p"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="container ">
            <div className="row" >
                <div className="col-lg-2">
                    <div className="header__logo">
                        <a href="./index.html"><img src="http://localhost:5000/img/artefino-logo.png" alt=""/></a>
                    </div>
                </div>
                <div className="col-lg-7"> 
                    <nav className="header__menu">
                        <ul>
                            <li className="active"><a href="./index.html">Drawings</a></li>
                            <li><a href="./shop-grid.html">Paintings</a></li>
                            <li><a href="#">Calligraphy</a>
                                <ul className="header__menu__dropdown">
                                    <li><a href="./shop-details.html">Shop Details</a></li>
                                    <li><a href="./shoping-cart.html">Shoping Cart</a></li>
                                    <li><a href="./checkout.html">Check Out</a></li>
                                    <li><a href="./blog-details.html">Blog Details</a></li>
                                </ul>
                            </li>
                            <li><a href="./blog.html">Photographs</a></li>
                            <li><a href="./contact.html">Contact</a></li>
                        </ul>
                    </nav>
                </div>
                <div className="col-lg-3">
                    <div className="header__cart header__top__right__auth">
                        {/* <% if (isAuthenticated) {%>
                            <ul>
                                <li><a href="#"><i className="fa fa-shopping-bag "></i> Sell</a></li>
                            </ul>
                            <div className="header__top__right__auth">
                                <a href="#"><i className="fa fa-user"></i>
                                    <%= userName ? userName : "" %>
                                </a>
                            </div>
                            <div className="header__top__right__auth">
                                <a href="/logout">Logout</a>
                            </div>
                        <%} else {%>
                                <div className="header__top__right__auth">
                                    <a href="/login"><i className="fa fa-user"></i> Login</a>
                                </div>
                        <% } %> */}
                    </div>
                </div>
            </div>
            <div className="humberger__open">
                <i className="fa fa-bars"></i>
            </div>
        </div>
    </header>
    {/* <!-- Header Section End --> */}

      </header>

      {/* Hero Section */}
      <section className="hero">
              <div className="container">
                  <div className="row">
                <div className="col-lg-12">
                    <div className="hero__search">
                        <div className="hero__search__form">
                            <form action="#">
                                <div className="hero__search__categories">
                                    All Categories
                                    <span className="arrow_carrot-down"></span>
                                </div>
                                <input type="text" placeholder="What do yo u need?"/>
                                <button type="submit" className="site-btn">SEARCH</button>
                            </form>
                        </div>
                    </div>
                    <div className="hero__item set-bg" data-setbg="http://localhost:5000/img/hero/banner.jpg">
                        <div className="hero__text">
                            <span>ART GALLERY</span>
                            <h2>Paintings</h2>
                            <p>Do It In A Creative Way</p>
                            {/* <!-- <a href="#" className="primary-btn">SHOP NOW</a> --> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
              <div className="container">
                  <div className="row">
                <div className="categories__slider owl-carousel">
                    <div className="col-lg-3">
                        <div className="categories__item set-bg" data-setbg="http://localhost:5000/img/categories/cat-1.jpg">
                            <h5><a href="#">Fresh Fruit</a></h5>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="categories__item set-bg" data-setbg="http://localhost:5000/img/categories/cat-2.jpg">
                            <h5><a href="#">Dried Fruit</a></h5>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="categories__item set-bg" data-setbg="http://localhost:5000/img/categories/cat-3.jpg">
                            <h5><a href="#">Vegetables</a></h5>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="categories__item set-bg" data-setbg="http://localhost:5000/img/categories/cat-4.jpg">
                            <h5><a href="#">drink fruits</a></h5>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="categories__item set-bg" data-setbg="http://localhost:5000/img/categories/cat-5.jpg">
                            <h5><a href="#">drink fruits</a></h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured spad">
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <div className="section-title">
                        <h2>Featured Product</h2>
                    </div>
                    <div className="featured__controls">
                        <ul>
                            <li className="active" data-filter="*">All</li>
                            <li data-filter=".oranges">Oranges</li>
                            <li data-filter=".fresh-meat">Fresh Meat</li>
                            <li data-filter=".vegetables">Vegetables</li>
                            <li data-filter=".fastfood">Fastfood</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="row featured__filter">
                <div className="col-lg-3 col-md-4 col-sm-6 mix oranges fresh-meat">
                    <div className="featured__item">
                        <div className="featured__item__pic set-bg" data-setbg="http://localhost:5000/img/featured/feature-1.jpg">
                            <ul className="featured__item__pic__hover">
                                <li><a href="#"><i className="fa fa-heart"></i></a></li>
                                <li><a href="#"><i className="fa fa-retweet"></i></a></li>
                                <li><a href="#"><i className="fa fa-shopping-cart"></i></a></li>
                            </ul>
                        </div>
                        <div className="featured__item__text">
                            <h6><a href="#">Crab Pool Security</a></h6>
                            <h5>$30.00</h5>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 mix vegetables fastfood">
                    <div className="featured__item">
                        <div className="featured__item__pic set-bg" data-setbg="http://localhost:5000/img/featured/feature-2.jpg">
                            <ul className="featured__item__pic__hover">
                                <li><a href="#"><i className="fa fa-heart"></i></a></li>
                                <li><a href="#"><i className="fa fa-retweet"></i></a></li>
                                <li><a href="#"><i className="fa fa-shopping-cart"></i></a></li>
                            </ul>
                        </div>
                        <div className="featured__item__text">
                            <h6><a href="#">Crab Pool Security</a></h6>
                            <h5>$30.00</h5>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 mix vegetables fresh-meat">
                    <div className="featured__item">
                        <div className="featured__item__pic set-bg" data-setbg="http://localhost:5000/img/featured/feature-3.jpg">
                            <ul className="featured__item__pic__hover">
                                <li><a href="#"><i className="fa fa-heart"></i></a></li>
                                <li><a href="#"><i className="fa fa-retweet"></i></a></li>
                                <li><a href="#"><i className="fa fa-shopping-cart"></i></a></li>
                            </ul>
                        </div>
                        <div className="featured__item__text">
                            <h6><a href="#">Crab Pool Security</a></h6>
                            <h5>$30.00</h5>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 mix fastfood oranges">
                    <div className="featured__item">
                        <div className="featured__item__pic set-bg" data-setbg="http://localhost:5000/img/featured/feature-4.jpg">
                            <ul className="featured__item__pic__hover">
                                <li><a href="#"><i className="fa fa-heart"></i></a></li>
                                <li><a href="#"><i className="fa fa-retweet"></i></a></li>
                                <li><a href="#"><i className="fa fa-shopping-cart"></i></a></li>
                            </ul>
                        </div>
                        <div className="featured__item__text">
                            <h6><a href="#">Crab Pool Security</a></h6>
                            <h5>$30.00</h5>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 mix fresh-meat vegetables">
                    <div className="featured__item">
                        <div className="featured__item__pic set-bg" data-setbg="http://localhost:5000/img/featured/feature-5.jpg">
                            <ul className="featured__item__pic__hover">
                                <li><a href="#"><i className="fa fa-heart"></i></a></li>
                                <li><a href="#"><i className="fa fa-retweet"></i></a></li>
                                <li><a href="#"><i className="fa fa-shopping-cart"></i></a></li>
                            </ul>
                        </div>
                        <div className="featured__item__text">
                            <h6><a href="#">Crab Pool Security</a></h6>
                            <h5>$30.00</h5>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 mix oranges fastfood">
                    <div className="featured__item">
                        <div className="featured__item__pic set-bg" data-setbg="http://localhost:5000/img/featured/feature-6.jpg">
                            <ul className="featured__item__pic__hover">
                                <li><a href="#"><i className="fa fa-heart"></i></a></li>
                                <li><a href="#"><i className="fa fa-retweet"></i></a></li>
                                <li><a href="#"><i className="fa fa-shopping-cart"></i></a></li>
                            </ul>
                        </div>
                        <div className="featured__item__text">
                            <h6><a href="#">Crab Pool Security</a></h6>
                            <h5>$30.00</h5>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 mix fresh-meat vegetables">
                    <div className="featured__item">
                        <div className="featured__item__pic set-bg" data-setbg="http://localhost:5000/img/featured/feature-7.jpg">
                            <ul className="featured__item__pic__hover">
                                <li><a href="#"><i className="fa fa-heart"></i></a></li>
                                <li><a href="#"><i className="fa fa-retweet"></i></a></li>
                                <li><a href="#"><i className="fa fa-shopping-cart"></i></a></li>
                            </ul>
                        </div>
                        <div className="featured__item__text">
                            <h6><a href="#">Crab Pool Security</a></h6>
                            <h5>$30.00</h5>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 mix fastfood vegetables">
                    <div className="featured__item">
                        <div className="featured__item__pic set-bg" data-setbg="http://localhost:5000/img/featured/feature-8.jpg">
                            <ul className="featured__item__pic__hover">
                                <li><a href="#"><i className="fa fa-heart"></i></a></li>
                                <li><a href="#"><i className="fa fa-retweet"></i></a></li>
                                <li><a href="#"><i className="fa fa-shopping-cart"></i></a></li>
                            </ul>
                        </div>
                        <div className="featured__item__text">
                            <h6><a href="#">Crab Pool Security</a></h6>
                            <h5>$30.00</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

      {/* Banner Section */}
      <div className="banner">
              <div className="container">
                  <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="banner__pic">
                        <img src="http://localhost:5000/img/banner/banner-1.jpg" alt=""/>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="banner__pic">
                        <img src="http://localhost:5000/img/banner/banner-2.jpg" alt=""/>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Latest Product Section */}
      <section className="latest-product spad">
              <div className="container">
                  <div className="row">
                <div className="col-lg-4 col-md-6">
                    <div className="latest-product__text">
                        <h4>Latest Products</h4>
                        <div className="latest-product__slider owl-carousel">
                            <div className="latest-prdouct__slider__item">
                                <a href="#" className="latest-product__item">
                                    <div className="latest-product__item__pic">
                                        <img src="http://localhost:5000/img/latest-product/lp-1.jpg" alt=""/>
                                    </div>
                                    <div className="latest-product__item__text">
                                        <h6>Crab Pool Security</h6>
                                        <span>$30.00</span>
                                    </div>
                                </a>
                                <a href="#" className="latest-product__item">
                                    <div className="latest-product__item__pic">
                                        <img src="http://localhost:5000/img/latest-product/lp-2.jpg" alt=""/>
                                    </div>
                                    <div className="latest-product__item__text">
                                        <h6>Crab Pool Security</h6>
                                        <span>$30.00</span>
                                    </div>
                                </a>
                                <a href="#" className="latest-product__item">
                                    <div className="latest-product__item__pic">
                                        <img src="http://localhost:5000/img/latest-product/lp-3.jpg" alt=""/>
                                    </div>
                                    <div className="latest-product__item__text">
                                        <h6>Crab Pool Security</h6>
                                        <span>$30.00</span>
                                    </div>
                                </a>
                            </div>
                            <div className="latest-prdouct__slider__item">
                                <a href="#" className="latest-product__item">
                                    <div className="latest-product__item__pic">
                                        <img src="http://localhost:5000/img/latest-product/lp-1.jpg" alt=""/>
                                    </div>
                                    <div className="latest-product__item__text">
                                        <h6>Crab Pool Security</h6>
                                        <span>$30.00</span>
                                    </div>
                                </a>
                                <a href="#" className="latest-product__item">
                                    <div className="latest-product__item__pic">
                                        <img src="http://localhost:5000/img/latest-product/lp-2.jpg" alt=""/>
                                    </div>
                                    <div className="latest-product__item__text">
                                        <h6>Crab Pool Security</h6>
                                        <span>$30.00</span>
                                    </div>
                                </a>
                                <a href="#" className="latest-product__item">
                                    <div className="latest-product__item__pic">
                                        <img src="http://localhost:5000/img/latest-product/lp-3.jpg" alt=""/>
                                    </div>
                                    <div className="latest-product__item__text">
                                        <h6>Crab Pool Security</h6>
                                        <span>$30.00</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6">
                    <div className="latest-product__text">
                        <h4>Top Rated Products</h4>
                        <div className="latest-product__slider owl-carousel">
                            <div className="latest-prdouct__slider__item">
                                <a href="#" className="latest-product__item">
                                    <div className="latest-product__item__pic">
                                        <img src="http://localhost:5000/img/latest-product/lp-1.jpg" alt=""/>
                                    </div>
                                    <div className="latest-product__item__text">
                                        <h6>Crab Pool Security</h6>
                                        <span>$30.00</span>
                                    </div>
                                </a>
                                <a href="#" className="latest-product__item">
                                    <div className="latest-product__item__pic">
                                        <img src="http://localhost:5000/img/latest-product/lp-2.jpg" alt=""/>
                                    </div>
                                    <div className="latest-product__item__text">
                                        <h6>Crab Pool Security</h6>
                                        <span>$30.00</span>
                                    </div>
                                </a>
                                <a href="#" className="latest-product__item">
                                    <div className="latest-product__item__pic">
                                        <img src="http://localhost:5000/img/latest-product/lp-3.jpg" alt=""/>
                                    </div>
                                    <div className="latest-product__item__text">
                                        <h6>Crab Pool Security</h6>
                                        <span>$30.00</span>
                                    </div>
                                </a>
                            </div>
                            <div className="latest-prdouct__slider__item">
                                <a href="#" className="latest-product__item">
                                    <div className="latest-product__item__pic">
                                        <img src="http://localhost:5000/img/latest-product/lp-1.jpg" alt=""/>
                                    </div>
                                    <div className="latest-product__item__text">
                                        <h6>Crab Pool Security</h6>
                                        <span>$30.00</span>
                                    </div>
                                </a>
                                <a href="#" className="latest-product__item">
                                    <div className="latest-product__item__pic">
                                        <img src="http://localhost:5000/img/latest-product/lp-2.jpg" alt=""/>
                                    </div>
                                    <div className="latest-product__item__text">
                                        <h6>Crab Pool Security</h6>
                                        <span>$30.00</span>
                                    </div>
                                </a>
                                <a href="#" className="latest-product__item">
                                    <div className="latest-product__item__pic">
                                        <img src="http://localhost:5000/img/latest-product/lp-3.jpg" alt=""/>
                                    </div>
                                    <div className="latest-product__item__text">
                                        <h6>Crab Pool Security</h6>
                                        <span>$30.00</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6">
                    <div className="latest-product__text">
                        <h4>Review Products</h4>
                        <div className="latest-product__slider owl-carousel">
                            <div className="latest-prdouct__slider__item">
                                <a href="#" className="latest-product__item">
                                    <div className="latest-product__item__pic">
                                        <img src="http://localhost:5000/img/latest-product/lp-1.jpg" alt=""/>
                                    </div>
                                    <div className="latest-product__item__text">
                                        <h6>Crab Pool Security</h6>
                                        <span>$30.00</span>
                                    </div>
                                </a>
                                <a href="#" className="latest-product__item">
                                    <div className="latest-product__item__pic">
                                        <img src="http://localhost:5000/img/latest-product/lp-2.jpg" alt=""/>
                                    </div>
                                    <div className="latest-product__item__text">
                                        <h6>Crab Pool Security</h6>
                                        <span>$30.00</span>
                                    </div>
                                </a>
                                <a href="#" className="latest-product__item">
                                    <div className="latest-product__item__pic">
                                        <img src="http://localhost:5000/img/latest-product/lp-3.jpg" alt=""/>
                                    </div>
                                    <div className="latest-product__item__text">
                                        <h6>Crab Pool Security</h6>
                                        <span>$30.00</span>
                                    </div>
                                </a>
                            </div>
                            <div className="latest-prdouct__slider__item">
                                <a href="#" className="latest-product__item">
                                    <div className="latest-product__item__pic">
                                        <img src="http://localhost:5000/img/latest-product/lp-1.jpg" alt=""/>
                                    </div>
                                    <div className="latest-product__item__text">
                                        <h6>Crab Pool Security</h6>
                                        <span>$30.00</span>
                                    </div>
                                </a>
                                <a href="#" className="latest-product__item">
                                    <div className="latest-product__item__pic">
                                        <img src="http://localhost:5000/img/latest-product/lp-2.jpg" alt=""/>
                                    </div>
                                    <div className="latest-product__item__text">
                                        <h6>Crab Pool Security</h6>
                                        <span>$30.00</span>
                                    </div>
                                </a>
                                <a href="#" className="latest-product__item">
                                    <div className="latest-product__item__pic">
                                        <img src="http://localhost:5000/img/latest-product/lp-3.jpg" alt=""/>
                                    </div>
                                    <div className="latest-product__item__text">
                                        <h6>Crab Pool Security</h6>
                                        <span>$30.00</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="from-blog spad">
              <div className="container">
                  <div className="row">
                <div className="col-lg-12">
                    <div className="section-title from-blog__title">
                        <h2>From The Blog</h2>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-4 col-md-4 col-sm-6">
                    <div className="blog__item">
                        <div className="blog__item__pic">
                            <img src="http://localhost:5000/img/blog/blog-1.jpg" alt=""/>
                        </div>
                        <div className="blog__item__text">
                            <ul>
                                <li><i className="fa fa-calendar-o"></i> May 4,2019</li>
                                <li><i className="fa fa-comment-o"></i> 5</li>
                            </ul>
                            <h5><a href="#">Cooking tips make cooking simple</a></h5>
                            <p>Sed quia non numquam modi tempora indunt ut labore et dolore magnam aliquam quaerat </p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-6">
                    <div className="blog__item">
                        <div className="blog__item__pic">
                            <img src="http://localhost:5000/img/blog/blog-2.jpg" alt=""/>
                        </div>
                        <div className="blog__item__text">
                            <ul>
                                <li><i className="fa fa-calendar-o"></i> May 4,2019</li>
                                <li><i className="fa fa-comment-o"></i> 5</li>
                            </ul>
                            <h5><a href="#">6 ways to prepare breakfast for 30</a></h5>
                            <p>Sed quia non numquam modi tempora indunt ut labore et dolore magnam aliquam quaerat </p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-6">
                    <div className="blog__item">
                        <div className="blog__item__pic">
                            <img src="http://localhost:5000/img/blog/blog-3.jpg" alt=""/>
                        </div>
                        <div className="blog__item__text">
                            <ul>
                                <li><i className="fa fa-calendar-o"></i> May 4,2019</li>
                                <li><i className="fa fa-comment-o"></i> 5</li>
                            </ul>
                            <h5><a href="#">Visit the clean farm in the US</a></h5>
                            <p>Sed quia non numquam modi tempora indunt ut labore et dolore magnam aliquam quaerat </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

          {/* Include your footer component or content here */}
          
          <footer className="footer spad">
    <div className="container">
        <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="footer__about">
                    <div className="footer__about__logo">
                        <a href="./index.html"><img src="http://localhost:5000/img/logo.png" alt=""/></a>
                    </div>
                    <ul>
                        <li>Address: 60-49 Road 11378 New York</li>
                        <li>Phone: +65 11.188.888</li>
                        <li>Email: hello@colorlib.com</li>
                    </ul>
                </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-6 offset-lg-1">
                <div className="footer__widget">
                    <h6>Useful Links</h6>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">About Our Shop</a></li>
                        <li><a href="#">Secure Shopping</a></li>
                        <li><a href="#">Delivery infomation</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Our Sitemap</a></li>
                    </ul>
                    <ul>
                        <li><a href="#">Who We Are</a></li>
                        <li><a href="#">Our Services</a></li>
                        <li><a href="#">Projects</a></li>
                        <li><a href="#">Contact</a></li>
                        <li><a href="#">Innovation</a></li>
                        <li><a href="#">Testimonials</a></li>
                    </ul>
                </div>
            </div>
            <div className="col-lg-4 col-md-12">
                <div className="footer__widget">
                    <h6>Join Our Newsletter Now</h6>
                    <p>Get E-mail updates about our latest shop and special offers.</p>
                    <form action="#">
                        <input type="text" placeholder="Enter your mail"/>
                        <button type="submit" className="site-btn">Subscribe</button>
                    </form>
                    <div className="footer__widget__social">
                        <a href="#"><i className="fa fa-facebook"></i></a>
                        <a href="#"><i className="fa fa-instagram"></i></a>
                        <a href="#"><i className="fa fa-twitter"></i></a>
                        <a href="#"><i className="fa fa-pinterest"></i></a>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-lg-12">
                <div className="footer__copyright">
                    <div className="footer__copyright__text">
                        <p>
                            Copyright &copy;
                            <script>document.write(new Date().getFullYear());</script> All rights reserved | This
                            template is made with <i className="fa fa-heart" aria-hidden="true"></i> by <a
                                href="https://colorlib.com" target="_blank">Colorlib</a>
                        </p>
                    </div>
                    <div className="footer__copyright__payment"><img src="http://localhost:5000/img/payment-item.png" alt=""/></div>
                </div>
            </div>
        </div>
    </div>
          </footer>
          
<script src="http://localhost:5000/js/jquery-3.3.1.min.js"></script>
<script src="http://localhost:5000/js/bootstrap.min.js"></script>
<script src="http://localhost:5000/js/jquery.nice-select.min.js"></script>
<script src="http://localhost:5000/js/jquery-ui.min.js"></script>
<script src="http://localhost:5000/js/jquery.slicknav.js"></script>
<script src="http://localhost:5000/js/mixitup.min.js"></script>
<script src="http://localhost:5000/js/owl.carousel.min.js"></script>
<script src="http://localhost:5000/js/main.js"></script>

<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.20/dist/sweetalert2.all.min.js"></script>
<script src="https://code.jquery.com/jquery-3.7.0.min.js" integrity="sha256-2Pmvv0kuTBOenSvLm6bvfBSSHrUJ+3A7x6P5Ebd07/g=" crossorigin="anonymous"></script>
    </div>
  );
};

export default Hero;
