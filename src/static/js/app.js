// imports
import SplitType from 'split-type'
import LocomotiveScroll from 'locomotive-scroll';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

//  locomotive
function pocoLoco() {
    gsap.registerPlugin(ScrollTrigger);

    // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

    const locoScroll = new LocomotiveScroll({
        el: document.querySelector("#main"),
        smooth: true,
        smoothMobile: true,
        // multiplier: 2,
        touchMultiplier: 3.3,
        smartphone: {
            smooth: true,
        }
    });
    // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
    locoScroll.on("scroll", ScrollTrigger.update);

    // tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
    ScrollTrigger.scrollerProxy("#main", {
        scrollTop(value) {
            return arguments.length
                ? locoScroll.scrollTo(value, 0, 0)
                : locoScroll.scroll.instance.scroll.y;
        }, // we don't have to define a scrollLeft because we're only scrolling vertically.
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight,
            };
        },
        // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
        pinType: document.querySelector("#main").style.transform
            ? "transform"
            : "fixed",
    });

    // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

    // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
    ScrollTrigger.refresh();
}

function videoPlayButton() {
    let videoCon = document.querySelector("#video-container");
    let video = Array.from(document.querySelectorAll(".video-box video"));
    let playButton = document.querySelector("#play-button");
    let playButton1 = document.querySelector("#play-button1");
    let playButton2 = document.querySelector("#play-button2");

    // button for both the video
    video.forEach(function (rocks) {
        // button appears
        rocks.addEventListener("mouseenter", function () {
            gsap.to(playButton, {
                opacity: 1,
                duration: 0.3,
                transform: "translate(-50%, -50%) scale(1)",
            });

            // for video 1 button gets red
            if (rocks.id == "red-button") {
                gsap.to(playButton, {
                    backgroundColor: "#f40e81",
                    duration: 1,
                });
            } else {
                gsap.to(playButton, {
                    backgroundColor: "black",
                    duration: 1,
                });
            }

            gsap.to(video, {
                cursor: "none",
            });
        });

        // button disappears
        rocks.addEventListener("mouseleave", function () {
            gsap.to(playButton, {
                opacity: 0,
                duration: 0.3,
                transform: "translate(-50%, -50%) scale(0)",
            });

            if (rocks.id == "red-button") {
                gsap.to(playButton, {
                    backgroundColor: "black",
                });
            }
        });

        // follow inside the box
        rocks.addEventListener("mousemove", function (rocks) {
            gsap.to(playButton, {
                left: rocks.x,
                top: rocks.y,
            });
            // console.log(rocks.x, rocks.y);
        });

        // video play and pause
        rocks.addEventListener("click", function () {
            rocks.classList.toggle("not-play");

            if (rocks.classList.contains("not-play")) {
                rocks.play();
                playButton.innerHTML = "<span>Pause</span>";
                playButton1.innerHTML = "<span>Pause</span>";
                playButton2.innerHTML = "<span>Pause</span>";
            } else {
                rocks.pause();
                playButton.innerHTML = "<span>Play</span>";
                playButton1.innerHTML = "<span>Play</span>";
                playButton2.innerHTML = "<span>Play</span>";
            }
        });
    });
}

function mouseFollower() {
    // main mouse follower
    let mouseFollow = document.querySelector("#mouse-follower");
    document.addEventListener("mousemove", function (rocks) {
        gsap.to("#mouse-follower, #mouse-follower-bg", {
            top: rocks.y,
            left: rocks.x,
            transform: "translate(-50%, -50%)",
            ease: "power4.out",
            duration: 2,
        });
    });

    // mouse follower to image in footer
    let footLists = Array.from(document.querySelectorAll(".footer .list"));

    footLists.forEach(function (rocks) {
        let image = rocks.getAttribute("data-image");
        let mm = gsap.matchMedia();
        console.log(image);
        rocks.addEventListener("mouseenter", function () {
            mm.add("(min-width: 800px)", () => {
                // this setup code only runs when viewport is at least 800px wide
                gsap.to("#mouse-follower", {
                    duration: 0,
                    width: "300px",
                    height: "250px",
                    borderRadius: "0",
                    backgroundImage: `url("${image}")`,
                    border: "0",
                });
            });

            mm.add("(max-width: 800px)", () => {
                // this setup code only runs when viewport is at least 800px wide
                gsap.to("#mouse-follower", {
                    scale: 1,
                    opacity: 1,
                    duration: 0,
                    width: "169px",
                    height: "157px",
                    borderRadius: "0",
                    backgroundImage: `url("${image}")`,
                    border: "0",
                });
            });

            // mouseFollow.style.width = "300px";
            // mouseFollow.style.height = "250px";
            // mouseFollow.style.borderRadius = "0";
            // mouseFollow.style.border = "0";
            // mouseFollow.style.backgroundImage = `url("${image}")`;
        });

        rocks.addEventListener("mouseleave", function () {
            gsap.to("#mouse-follower", {
                duration: 0,
                width: "17px",
                height: "17px",
                borderRadius: "50%",
                backgroundImage: `none`,
                border: "1px solid white",
            });

            mm.add("(max-width: 800px)", () => {
                // this setup code only runs when viewport is at least 800px wide
                gsap.to("#mouse-follower", {
                    scale: 0,
                    opacity: 0,
                    duration: 0,
                    width: "17px",
                    height: "17px",
                    borderRadius: "0",
                    backgroundImage: `none`,
                    border: "0",
                });
            });

            // mouseFollow.style.width = "17px";
            // mouseFollow.style.height = "17px";
            // mouseFollow.style.borderRadius = "50%";
            // mouseFollow.style.border = "1px solid white";
            // mouseFollow.style.backgroundImage = `none`;
        });
    });
}

function productBox() {
    let productCircle = document.querySelector("#product-circle");
    let productBoxes = Array.from(
        document.querySelectorAll(".products .product")
    );

    productBoxes.forEach(function (element) {
        // circle viisble when whter the boxes
        element.addEventListener("mousemove", function (rocks) {
            gsap.to(productCircle, {
                left: rocks.x,
                top: rocks.y,
                transform: "translate(-50%, -50%) scale(1)",
                opacity: 0.5,
                ease: "power4.out",
                duration: 2,
            });

            if (element.id == "product1") {
                gsap.to(productCircle, {
                    backgroundColor: "rgb(237, 230, 230)",
                    ease: "power4.out",
                    duration: 2,
                });
            } else if (element.id == "product2") {
                gsap.to(productCircle, {
                    backgroundColor: "rgb(236, 236, 236)",
                    ease: "power4.out",
                    duration: 2,
                });
            } else if (element.id == "product3") {
                gsap.to(productCircle, {
                    backgroundColor: "rgb(237, 230, 230)",
                    ease: "power4.out",
                    duration: 2,
                });
            } else if (element.id == "product4") {
                gsap.to(productCircle, {
                    backgroundColor: "rgb(214, 224, 224)",
                    ease: "power4.out",
                    duration: 2,
                });
            }

            // make mouse that black one disappear
            gsap.to("#mouse-follower, #mouse-follower-bg", {
                left: rocks.x,
                top: rocks.y,
                transform: "translate(-50%, -50%) scale(1)",
                opacity: 0,
                scale: 0,
                ease: "power4.out",
                duration: 2,
            });
        });

        // circle disapper when mouse leaves
        element.addEventListener("mouseleave", function (rocks) {
            gsap.to(productCircle, {
                left: rocks.x,
                top: rocks.y,
                transform: "translate(-50%, -50%) scale(0)",
                opacity: 0,
                ease: "power4.out",
                duration: 2,
            });
            let mm = gsap.matchMedia();

            mm.add("(min-width: 800px)", () => {
                // this setup code only runs when viewport is at least 800px wide
                gsap.to("#mouse-follower, #mouse-follower-bg", {
                    left: rocks.x,
                    top: rocks.y,
                    transform: "translate(-50%, -50%) scale(1)",
                    opacity: 1,
                    scale: 1,
                    ease: "power4.out",
                    duration: 2,
                });
            });
        });
    });
}

function navToggler() {
    let togglerIcon = document.querySelector("#nav-toggler");

    togglerIcon.addEventListener("click", function () {
        togglerIcon.classList.toggle("nav-open");

        if (togglerIcon.classList.contains("nav-open")) {
            gsap.to(".navbar-list-box", {
                transform: "translateX(0)",
                duration: 0.5,
            });
            gsap.to("#nav-toggler .open", {
                transform: "rotateY(90deg)",
                opacity: "0",
                duration: 0.5,
            });
            gsap.to("#nav-toggler .close", {
                transform: "rotateY(0deg)",
                opacity: "1",
                duration: 0.5,
            });
        } else if (!togglerIcon.classList.contains("nav-open")) {
            gsap.to(".navbar-list-box", {
                transform: "translateX(100%)",
                duration: 0.5,
            });
            gsap.to("#nav-toggler .open", {
                transform: "rotateY(0deg)",
                opacity: "1",
                duration: 0.5,
            });
            gsap.to("#nav-toggler .close", {
                transform: "rotateY(180deg)",
                opacity: "0",
                duration: 0.5,
            });
        }
    });
}

function navBar() {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 800px)", () => {
        // this setup code only runs when viewport is at least 800px wide
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".heroz",
                scroller: "#main",
                // markers: true,
                start: "10% 10%",
                end: "7% 0%",
                scrub: 1,
            },
        });
        tl.to(
            ".navigation-bar .nav-box .svg-1, .navigation-bar .nav-box .svg-2",
            {
                transform: "translateY(-125%)",
            },
            "border"
        );

        tl.to(
            ".navigation-bar",
            {
                borderBottom: "1px solid white",
                duration: 0.5,
            },
            "border"
        );

        let tl2 = gsap.timeline({
            scrollTrigger: {
                trigger: ".heroz .heading-box",
                scroller: "#main",
                //   markers: true,
                scrub: 4,
                start: "top -65%",
                end: "top -105%",
            },
            duration: 0.5,
        });

        tl2.to(".navigation-bar", {
            borderColor: "black",
        });

        gsap.to(".navigation-bar", {
            borderColor: "white",
            scrollTrigger: {
                trigger: ".iesba",
                scroller: "#main",
                scrub: 4,
                start: "top -65%",
                end: "top -105%",
            },
            duration: 0.5,
        });
        return () => {
            // optional
            // custom cleanup code here (runs when it STOPS matching)
        };
    });

    mm.add("(max-width: 800px)", () => {
        // this setup code only runs when viewport is at least 800px wide
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".heroz",
                scroller: "#main",
                // markers: true,
                start: "20% 10%",
                end: "15% 0%",
                scrub: 1,
            },
        });
        tl.to(
            ".navigation-bar .nav-box .svg-1, .navigation-bar .nav-box .svg-2",
            {
                transform: "translateY(-360%)",
            },
            "border"
        );

        tl.to(
            ".navigation-bar",
            {
                borderBottom: "1px solid white",
                duration: 0.5,
            },
            "border"
        );

        let tl2 = gsap.timeline({
            scrollTrigger: {
                trigger: ".heroz .heading-box",
                scroller: "#main",
                // markers: true,
                scrub: 4,
                start: "top -5%",
                end: "top -25%",
            },
            duration: 1,
        });

        tl2.to(".navigation-bar", {
            borderColor: "black",
        });

        gsap.to(".navigation-bar", {
            borderColor: "white",
            scrollTrigger: {
                trigger: ".iesba",
                scroller: "#main",
                scrub: 4,
                start: "top -65%",
                end: "top -105%",
                // markers: true,
            },
            duration: 0.5,
        });
        return () => {
            // optional
            // custom cleanup code here (runs when it STOPS matching)
        };
    });
}

function loadingAnimation() {
    // starting animation of hero with trigger
    // upper text
    let mm = gsap.matchMedia();

    mm.add("(min-width: 800px)", () => {
        // this setup code only runs when viewport is at least 800px wide
        let tl = gsap.timeline();

        tl.to(".heroz .heading-box .heading.text-start", {
            duration: 1,
            transform: "translateX(0)",
            scrollTrigger: {
                trigger: ".heroz .heading-box",
                scroller: "#main",
                scrub: 3,
                start: "top 0%",
                end: "top -10%",
            },
        });
        // lower text
        tl.to(".heroz .heading-box .heading.text-end", {
            duration: 1,
            transform: "translateX(0)",
            scrollTrigger: {
                trigger: ".heroz .heading-box",
                scroller: "#main",
                scrub: 3,
                start: "top 0%",
                end: "top -10%",
            },
        });

        // video
        tl.to(".heroz .video-box video", {
            duration: 1,
            width: "100%",
            height: "100%",
            scrollTrigger: {
                trigger: ".heroz .heading-box",
                scroller: "#main",
                scrub: 3,
                start: "top 0%",
                end: "top -10%",
            },
        });

        // hero section bewlo animation

        tl.from(".hero .heading-box .heading", {
            y: 500,
            x: -500,
            duration: 1,
            delay: 0.5,
            scale: 0,
            opacity: 0,
            stagger: 0.3,
            scrollTrigger: {
                trigger: ".hero .heading-box",
                scroller: "#main",
                // markers: true,
                scrub: 4,
                start: "top 80%",
                end: "top 50%",
            },
        });

        // second video
        tl.from("#video-container", {
            opacity: 0,
            scale: 0.5,
            duration: 2,
            scrollTrigger: {
                trigger: "#video-container",
                scroller: "#main",
                // markers: true,
                scrub: 4,
                start: "top 90%",
                end: "top 80%",
            },
        });
        // background when in about section
        tl.to("#main", {
            backgroundColor: "white",
            duration: 2,
            scrollTrigger: {
                trigger: ".heroz .heading-box",
                scroller: "#main",
                //   markers: true,
                scrub: 4,
                start: "top -65%",
                end: "top -105%",
            },
        });
        tl.to("svg, .navbar-nav .link", {
            scrollTrigger: {
                trigger: ".heroz .heading-box",
                scroller: "#main",
                //   markers: true,
                scrub: 4,
                start: "top -65%",
                end: "top -105%",
                onEnter: () =>
                    gsap.to("svg, .navbar-nav .link", {
                        duration: 2,
                        color: "black",
                    }),
                onLeaveBack: () =>
                    gsap.to("svg, .navbar-nav .link", {
                        duration: 2,
                        color: "white",
                    }),
            },
        });

        // background when in footer section
        tl.to("#main", {
            scrollTrigger: {
                trigger: ".iesba",
                scroller: "#main",
                // markers: true,
                scrub: 4,
                start: "top -15%",
                end: "top -70%",
                onEnter: () => {
                    gsap.to("#main", {
                        duration: 2,
                        backgroundColor: "black",
                    }),
                        gsap.to(".scroll-reveals", {
                            duration: 0.4,
                            color: "white",
                        });
                },

                onLeaveBack: () => {
                    gsap.to("#main", {
                        duration: 2,
                        backgroundColor: "white",
                    }),
                        gsap.to(".scroll-reveals", {
                            duration: 0.4,
                            color: "black",
                        });
                },
            },
        });

        tl.to("svg, .navbar-nav .link", {
            scrollTrigger: {
                trigger: ".iesba",
                scroller: "#main",
                // markers: true,
                scrub: 4,
                start: "top -15%",
                end: "top -70%",
                onEnter: () =>
                    gsap.to("svg, .navbar-nav .link", {
                        duration: 2,
                        color: "white",
                    }),
                onLeaveBack: () =>
                    gsap.to("svg, .navbar-nav .link", {
                        duration: 2,
                        color: "black",
                    }),
            },
        });
    });

    mm.add("(max-width: 800px)", () => {
        // this setup code only runs when viewport is at least 800px wide
        let tl = gsap.timeline();

        tl.to(".heroz .heading-box .heading.text-start", {
            duration: 1,
            transform: "translateX(15%)",
            scrollTrigger: {
                trigger: ".heroz .heading-box",
                scroller: "#main",
                scrub: 3,
                start: "top 5%",
                end: "top -5%",
                // markers: true,
            },
        });
        // lower text
        tl.to(".heroz .heading-box .heading.text-end", {
            duration: 1,
            transform: "translateX(-12%)",
            scrollTrigger: {
                trigger: ".heroz .heading-box",
                scroller: "#main",
                scrub: 3,
                start: "top 0%",
                end: "top -10%",
            },
        });

        // video
        tl.to(".heroz .video-box video", {
            duration: 1,
            width: "100%",
            height: "100%",
            scrollTrigger: {
                trigger: ".heroz .heading-box",
                scroller: "#main",
                scrub: 3,
                start: "top 0%",
                end: "top -10%",
            },
        });

        // hero section bewlo animation

        tl.from(".hero .heading-box .heading", {
            y: 500,
            x: -500,
            duration: 1,
            delay: 0.5,
            scale: 0,
            opacity: 0,
            stagger: 0.3,
            scrollTrigger: {
                trigger: ".hero .heading-box",
                scroller: "#main",
                // markers: true,
                scrub: 4,
                start: "top 80%",
                end: "top 50%",
            },
        });

        // second video
        tl.from("#video-container", {
            opacity: 0,
            duration: 2,
            scale: 0.5,
            scrollTrigger: {
                trigger: "#video-container",
                scroller: "#main",
                // markers: true,
                scrub: 4,
                start: "top 90%",
                end: "top 80%",
            },
        });
        // background when in about section
        tl.to("#main", {
            backgroundColor: "white",
            duration: 2,
            scrollTrigger: {
                trigger: ".heroz .heading-box",
                scroller: "#main",
                // markers: true,
                scrub: 4,
                start: "top 0%",
                end: "top -50%",
            },
        });
        tl.to("svg, .navbar-nav .link", {
            scrollTrigger: {
                trigger: ".heroz .heading-box",
                scroller: "#main",
                // markers: true,
                scrub: 4,
                start: "top -0%",
                end: "top -50%",
                onEnter: () =>
                    gsap.to("svg, .navbar-nav .link", {
                        duration: 2,
                        color: "black",
                    }),
                onLeaveBack: () =>
                    gsap.to("svg, .navbar-nav .link", {
                        duration: 2,
                        color: "white",
                    }),
            },
        });

        // background when in footer section
        tl.to("#main", {
            scrollTrigger: {
                trigger: ".iesba",
                scroller: "#main",
                // markers: true,
                scrub: 4,
                start: "top -15%",
                end: "top -70%",
                onEnter: () => {
                    gsap.to("#main", {
                        duration: 2,
                        backgroundColor: "black",
                    }),
                        gsap.to(".scroll-reveals", {
                            duration: 0.4,
                            color: "white",
                        }),
                        gsap.to(".navigation-bar", {
                            borderColor: "white",
                        });
                },

                onLeaveBack: () => {
                    gsap.to("#main", {
                        duration: 2,
                        backgroundColor: "white",
                    }),
                        gsap.to(".scroll-reveals", {
                            duration: 0.4,
                            color: "black",
                        }),
                        gsap.to(".navigation-bar", {
                            borderColor: "black",
                        });
                },
            },
        });

        tl.to("svg, .navbar-nav .link", {
            scrollTrigger: {
                trigger: ".iesba",
                scroller: "#main",
                // markers: true,
                scrub: 4,
                start: "top -15%",
                end: "top -70%",
                onEnter: () =>
                    gsap.to("svg, .navbar-nav .link", {
                        duration: 2,
                        color: "white",
                    }),
                onLeaveBack: () =>
                    gsap.to("svg, .navbar-nav .link", {
                        duration: 2,
                        color: "black",
                    }),
            },
        });
    });
}

function scrollText() {
    const slitTypes = document.querySelector(".scroll-reveals");
    const splitTypes = Array.from(
        document.querySelectorAll(".about .scroll-reveal")
    );

    // dumb section
    function botScroll() {
        const text = new SplitType(slitTypes);
        let mm = gsap.matchMedia();

        mm.add("(min-width: 800px)", () => {
            // this setup code only runs when viewport is at least 800px wide
            gsap.from(text.chars, {
                x: -20,
                y: 20,
                opacity: 0.1,
                duration: 1,
                stagger: 1,
                scrollTrigger: {
                    trigger: ".text-scroll .text-container",
                    scroller: "#main",
                    scrub: 3,
                    start: "top 0%",
                    end: "top -100%",
                    pin: true,
                    // markers: true,
                },
            });
        });

        mm.add("(max-width: 800px)", () => {
            // this setup code only runs when viewport is at least 800px wide
            gsap.from(text.chars, {
                x: -20,
                y: 20,
                opacity: 0.1,
                duration: 1,
                stagger: 1,
                scrollTrigger: {
                    trigger: ".text-scroll .text-container",
                    scroller: "#main",
                    scrub: 3,
                    start: "top 0%",
                    end: "top -100%",
                    pin: true,
                    // markers: true,
                },
            });
        });
    }

    // about section
    function aboutScroll() {
        const splitedText = new SplitType(splitTypes);
        let mm = gsap.matchMedia();
        mm.add("(min-width: 800px)", () => {
            // this setup code only runs when viewport is at least 800px wide
            gsap.from(splitedText.chars, {
                x: -20,
                y: 20,
                opacity: 0.1,
                duration: 1,
                stagger: 1,
                scrollTrigger: {
                    trigger: ".about .text",
                    scroller: "#main",
                    scrub: 3,
                    start: "top 60%",
                    end: "top -10%",
                    // pin: true,
                    //   markers: true,
                },
            });
        });
        mm.add("(max-width: 800px)", () => {
            // this setup code only runs when viewport is at least 800px wide
            gsap.from(splitedText.chars, {
                x: -20,
                y: 20,
                opacity: 0.1,
                duration: 1,
                stagger: 1,
                scrollTrigger: {
                    trigger: ".about .text",
                    scroller: "#main",
                    scrub: 3,
                    start: "top 70%",
                    end: "bottom -20%",
                    // pin: true,
                    // markers: true,
                },
            });
        });
    }
    aboutScroll();
    botScroll();
}


// AOS.init();
pocoLoco();
videoPlayButton();
loadingAnimation();
mouseFollower();
productBox();
scrollText();
navBar();
navToggler();