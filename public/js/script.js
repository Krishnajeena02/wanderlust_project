// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })();


var tl = gsap.timeline()
gsap.to("#rotate",{
  rotation: 360,
    duration: 2,
    repeat: -1,     // infinite loop
    ease: "none" 
})

  tl.from(".navbar .nav-link",{
    y:-40,
    duration:1,
    stagger:0.4,
    // scrub:4,
    opacity:0
})

