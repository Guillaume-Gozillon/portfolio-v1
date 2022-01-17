let controller
let slideScene
let pageScene
let detailScene

const animateSlides = () => {
  // Init controller
  controller = new ScrollMagic.Controller()

  // Loop over each slide
  const sliders = document.querySelectorAll('.slide')
  sliders.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector('.reveal-img')
    const img = slide.querySelector('img')
    const revealText = slide.querySelector('.reveal-text')

    // GSAP
    const slideTl = gsap.timeline({
      defaults: { duration: 1, ease: 'power2.inOut' }
    })
    slideTl.fromTo(revealImg, { x: '0%' }, { x: '100%' })
    slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, '-=1')
    slideTl.fromTo(revealText, { x: '0%' }, { x: '100%' }, '-=0.75')

    // Create scene
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false
    })
      .setTween(slideTl)
      .addTo(controller)

    // New animation
    const pageTl = gsap.timeline()
    let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1]
    pageTl.fromTo(nextSlide, { y: '0%' }, { y: '50%' })
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 })
    pageTl.fromTo(nextSlide, { y: '50%' }, { y: '0%' }, '-=0.5')

    // Create new scene
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: '100%',
      triggerHook: 0
    })
      .setTween(pageTl)
      .setPin(slide, { pushFollowers: false })
      .addTo(controller)
  })
}

// Close menu
const burger = document.querySelector('.burger')
const logo = document.querySelector('.logo')

const navToggle = e => {
  if (!e.target.classList.contains('active')) {
    e.target.classList.add('active')
    gsap.to('.line1', 0.5, { rotate: '45', y: 5, background: 'black' })
    gsap.to('.line2', 0.5, { rotate: '-45', y: -5, background: 'black' })
    gsap.to('#logo', 1, { color: 'black' })
    gsap.to('.nav-bar', 1, { clipPath: 'circle(2500px at 100% -10%)' })
    document.body.classList.add('hide')
  } else {
    e.target.classList.remove('active')
    gsap.to('.line1', 0.5, { rotate: '0', y: 0, background: 'white' })
    gsap.to('.line2', 0.5, { rotate: '0', y: 0, background: 'white' })
    gsap.to('#logo', 1, { color: 'white' })
    gsap.to('.nav-bar', 1, { clipPath: 'circle(50px at 100% -10%)' })
    document.body.classList.remove('hide')
  }
}

const logoToggle = e => {
  if (e.target.classList.contains('logo')) {
    e.target.classList.remove('active')
    gsap.to('.line1', 0.5, { rotate: '0', y: 0, background: 'white' })
    gsap.to('.line2', 0.5, { rotate: '0', y: 0, background: 'white' })
    gsap.to('#logo', 1, { color: 'white' })
    gsap.to('.nav-bar', 1, { clipPath: 'circle(50px at 100% -10%)' })
    document.body.classList.remove('hide')
  }
}

// Barba page transitions
barba.init({
  views: [
    {
      namespace: 'home',
      beforeEnter() {
        animateSlides()
        logo.href = './index.html'
      },
      beforeLeave() {
        slideScene.destroy()
        pageScene.destroy()
        controller.destroy()
      }
    },
    {
      namespace: 'fashion',
      beforeEnter() {
        logo.href = '../index.html'
        detailAnimation()
      },
      beforeLeave() {
        controller.destroy()
        detailScene.destroy()
      }
    }
  ],
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async()

        // Animation
        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 })
        tl.fromTo(
          '.swipe',
          0.75,
          { x: '-100%' },
          { x: '0%', onComplete: done },
          '-=0.5'
        )
      },
      enter({ current, next }) {
        let done = this.async()

        //scroll to the top
        window.scrollTo(0, 0)

        // animation
        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })
        tl.fromTo(
          '.swipe',
          1,
          { x: '0%' },
          { x: '100%', stagger: 0.25, onComplete: done },
          tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 }),
          tl.fromTo(
            '.nav-header',
            1,
            { y: '-100%' },
            { y: '0%', ease: 'power2.inOut' }
          )
        )
      }
    }
  ]
})

const detailAnimation = () => {
  controller = new ScrollMagic.Controller()
  const slides = document.querySelectorAll('.detail-slide')
  slides.forEach((slide, index, slides) => {
    const slidesTl = gsap.timeline({ defaults: { duration: 1 } })
    let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1]
    slidesTl.fromTo(slide, { opacity: 1 }, { opacity: 0 })
    slidesTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, '-=1')

    // Scene
    detailScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: '100%',
      triggerHook: 0
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(slidesTl)
      .addTo(controller)
  })
}

// EventListenner
burger.addEventListener('click', navToggle)
logo.addEventListener('click', logoToggle)
