
    var tl = gsap.timeline();

    gsap.to("#rotate", {
      rotation: 360,
      duration: 2,
      repeat: -1,
      ease: "none"
    });




    tl.from(".navbar .nav-link", {
      y: -40,
      duration: 1,
      stagger: 0.4,
      opacity: 0
    });