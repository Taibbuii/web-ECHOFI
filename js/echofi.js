const script = () => {
    gsap.registerPlugin(ScrollTrigger,SplitText)
    ScrollTrigger.defaults({
        invalidateOnRefresh: true,
        // scroller: '.main-inner',
    });
    const parseRem = (input) => {
        return input / 10 * parseFloat($('html').css('font-size'))
    }

    function getMostInViewSection(allSections) {
        if (allSections) {
            const mostInViewSection = Array.from(allSections).reduce((mostInView, section) => {
                const rect = section.getBoundingClientRect();
                const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
                const visibleWidth = Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0);
                const visibleArea = Math.max(0, visibleHeight) * Math.max(0, visibleWidth);

                if (!mostInView || visibleArea > mostInView.visibleArea) {
                    return { section, visibleArea };
                }
                return mostInView;
            }, null);

            return mostInViewSection;
        }
    }
    const lenis = new Lenis({
        // wrapper: document.querySelector('.main-inner'),
        // smoothTouch: false,
    })
    gsap.ticker.add((time) => {
        if (lenis) {
            lenis.raf(time * 1000);
        }
    });
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', ScrollTrigger.update)
    lenis.on('scroll', () => {
        if (pageName === 'home') {
            document.querySelector('.prog-wrap').update();
        }
        document.querySelector('header-inner').update();
    })
    const pageName = $('.main-inner').attr('data-barba-namespace');
    class Header extends HTMLElement {
        constructor() {
            super();
            this.el = this;
            this.stickyEls = this.el.querySelectorAll('.header-grid, .header-links, .header-logo, .header-link');
            this.allItem = this.el.querySelectorAll('.header-link');
            this.currentIndex = 0;
            this.allSections = document.querySelectorAll('[data-sc-name]');
            this.mostInViewSection = getMostInViewSection(this.allSections);
        }
        connectedCallback() {
            if (window.innerWidth > 991) {
                this.setupDesktop();
                // this.active(0);
            this.update();
    
            } else {
                this.setupMobile();
            }
            
        }
        setupMobile() {
            console.log('mobile')
            this.el.querySelector('.header-menu-toggle').addEventListener('click', (e) => {
                console.log('click')
                e.preventDefault();
                this.toggleMenu();
            })
        }
        setupDesktop() {
            this.allItem.forEach((item, i) => {
                let width = item.offsetWidth;
                item.style.setProperty('--max-width', width + 'px');
                item.addEventListener('mouseover', () => {
                    this.active(i);
                })
                item.addEventListener('mouseleave', (e) => {
                    this.active(this.currentIndex);
                })
            })
        }
        toggleSticky(state) {
            if (window.innerWidth < 991) return;
            if (state) {
                this.stickyEls.forEach((item) => {
                    item.classList.add('on-sticky');
                })
            } else {
                this.stickyEls.forEach((item) => {
                    item.classList.remove('on-sticky');
                })
            }
        }
        active(index) {
            this.allItem.forEach((item, i) => {
                if (i === index) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            })
        }
        update() {
            if (pageName == 'home') {
                this.mostInViewSection = getMostInViewSection(this.allSections);
                let scName = this.mostInViewSection.section.getAttribute('data-sc-name');
                if (this.el.querySelector(`.header-link[data-sc-link="${scName}"]`)) {
                    this.currentIndex = $(this.el).find(`.header-link[data-sc-link="${scName}"]`).index();
                    this.active(this.currentIndex);
                } else {
                    this.currentIndex = -1;
                    this.active(-1);
                }
            } else {
                this.currentIndex = -1;
                this.active(-1);
            }
            
            if (lenis.scroll > this.el.offsetHeight) {
                this.toggleSticky(true);
            } else {
                this.toggleSticky(false);
            }
        }
        toggleMenu() {
            if (this.el.querySelector('.header-links-wrap').classList.contains('on-open')) {
                this.el.querySelector('.header-links-wrap').classList.remove('on-open')
                this.el.querySelector('.header-menu-toggle').classList.remove('on-open')
            } else {
                this.el.querySelector('.header-links-wrap').classList.add('on-open')
                this.el.querySelector('.header-menu-toggle').classList.add('on-open')
            }
        }
    }
    customElements.define('header-inner', Header);

    class PageProgress extends HTMLElement {
        constructor() {
            super();
            this.el = this;
        }
        connectedCallback() {
            this.update();
        }
        update() {
            if (window.innerWidth > 991) {
                gsap.set(this.el.querySelector('.prog-inner'), {scaleX: lenis.scroll / lenis.limit})
            } else {
                gsap.set(document.querySelector('.header-menu-toggle .el-prog'), {'stroke-dashoffset': (1 - (lenis.scroll / lenis.limit)) * 100})
            }
        }
    }
    customElements.define('prog-wrap', PageProgress);
    class HomeHero extends HTMLElement {
        constructor() {
            super();
            this.el = this;
            this.uiScreen = this.el.querySelector('.home-hero-ui-inner');
        }
        connectedCallback() {
            if (window.innerWidth > 991) {
                this.desktop();
            }
        }
        desktop() {
            let tlBg = gsap.timeline({
                scrollTrigger: {
                    trigger: this.el.querySelector('.home-hero-bg'),
                    start: `top top`,
                    end: 'bottom top',
                    scrub: true,
                }
            })
            tlBg.to(this.el.querySelector('.home-hero-bg-main'), {
                yPercent: 40,
                autoAlpha: .8,
                ease: 'none',
            })
            .to([this.el.querySelector('.home-hero-title-wrap'), this.el.querySelector('.home-hero-partner')], {
                y: this.el.querySelector('.home-hero-bg-main').offsetHeight * .25,
                ease: 'none',
            }, '<')
            .to([this.uiScreen], {
                yPercent: 40,
                ease: 'none',
            }, '<')
        }
    }
    customElements.define('home-hero-wrap', HomeHero);
    class HomeHow extends HTMLElement {
        constructor() {
            super();
            this.el = this;
            this.allItem = this.el.querySelectorAll('.home-how-main-item');
        }
        connectedCallback() {
            console.log('connected')
            if (window.innerWidth > 767) return;
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: this.el.querySelector('.home-how-main-wrap'),
                    start: 'top 15%',
                    end: 'bottom 75%',
                    scrub: true,
                }
            })
            this.allItem.forEach((item, i) => {
                if (i === 0) {
                    tl.to(this.allItem[i], {
                        yPercent: 164.26592798,
                        scale: 0.7229916898,
                        opacity: .3,
                        duration: 2,
                        ease: 'none',
                    }, 0)
                } else if (i === 1) {
                    tl.to(this.allItem[i], {
                        yPercent: 80.0554016620,
                        scale: 0.861495844875,
                        opacity: 1,
                        duration: 1,
                        ease: 'none',
                    }, 1)
                    tl.to(this.allItem[i].querySelector('.home-how-main-item-inner'), {
                        backgroundColor: '#140E0A',
                        duration: 1,
                        ease: 'none',
                    }, 1)
                    tl.to(this.allItem[i].querySelector('.home-how-main-item-head'), {
                        opacity: .6,
                        duration: 1,
                        ease: 'none',
                    }, 1)
                    tl.to(this.allItem[i].querySelector('.home-how-main-item-content'), {
                        opacity: .6,
                        duration: 1,
                        ease: 'none',
                    }, 1)
                }
            })
        }
    }
    customElements.define('home-how-wrap', HomeHow);
    class HomeCoin extends HTMLElement {
        constructor() {
            super();
            this.el = this;
            this.textEl = this.el.querySelector('.home-coin-sub .txt');
        }
        connectedCallback() {
            console.log('connected')
            let splitEl = SplitText.create(this.textEl, {
                type: "words, lines",
            });
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: this.el.querySelector('.home-coin-sub'),
                    start: 'top bottom',
                    end: 'bottom 35%',
                    scrub: true,
                }
            })
            console.log(splitEl)
            tl.to(splitEl.words, {
                color: '#fff',
                duration: 1,
                stagger: 0.1,
                ease: 'none',
            })
        }
    }
    customElements.define('home-coin-wrap', HomeCoin);

    class HomeNFT extends HTMLElement {
        constructor() {
            super();
            this.el = this;
            this.allLeft = this.el.querySelectorAll('.home-nft-main-left-item');
            this.allRight = this.el.querySelectorAll('.home-nft-main-right-item');
        }
        connectedCallback() {
            console.log('connected')
            let duration = 6;
            this.allLeft.forEach((item, i) => {
                let tlLeft = gsap.timeline({
                    repeat: -1,
                    delay: i * (-duration / this.allLeft.length),
                })
                gsap.set(item, {
                    'transform': 'translate3d(80%, 0px, 0px)',
                    autoAlpha: 1,
                })
                tlLeft.to(item, {
                    keyframes: [
                        {
                            'transform': 'translate3d(0%, 0px, 0px)',
                            autoAlpha: 1,
                            ease: 'power3.out',
                        },
                        {
                            'transform': 'translate3d(-47%, 0px, -83.8px)',
                            autoAlpha: 1,
                            ease: 'power3.out',
                        },
                        {
                            'transform': 'translate3d(-108%, 0px, -200.2px)',
                            autoAlpha: 1,
                            ease: 'power3.out',
                        },
                        {
                            'transform': 'translate3d(-198%, 0px, -373px)',
                            autoAlpha: 1,
                            ease: 'power3.out',
                        },  
                        {
                            'transform': 'translate3d(-340%, 0%, -667px)',
                            autoAlpha: 1,
                            ease: 'power3.out',
                        },
                        {
                            'transform': 'translate3d(-604%, 0px, -1253.4px)',
                            autoAlpha: 0,
                            ease: 'power3.out',
                        },
                    ],
                    duration: duration,
                    ease: 'none',
                })
            })
            this.allRight.forEach((item, i) => {
                let tlRight = gsap.timeline({
                    repeat: -1,
                    delay: i * (-duration / this.allRight.length),
                })
                gsap.set(item, {
                    'transform': 'translate3d(-80%, 0px, 0px)',
                    autoAlpha: 1,
                })
                tlRight.to(item, {
                    keyframes: [
                        
                        {
                            'transform': 'translate3d(0%, 0px, 0px)',
                            autoAlpha: 1,
                            ease: 'power3.out',
                        },
                        {
                            'transform': 'translate3d(47%, 0px, -83.8px)',
                            autoAlpha: 1,
                            ease: 'power3.out',
                        },
                        {
                            'transform': 'translate3d(108%, 0px, -200.2px)',
                            autoAlpha: 1,
                            ease: 'power3.out',
                        },
                        {
                            'transform': 'translate3d(198%, 0px, -373px)',
                            autoAlpha: 1,
                            ease: 'power3.out',
                        },  
                        {
                            'transform': 'translate3d(340%, 0%, -667px)',
                            autoAlpha: 1,
                            ease: 'power3.out',
                        },
                        {
                            'transform': 'translate3d(604%, 0px, -1253.4px)',
                            autoAlpha: 0,
                            ease: 'power3.out',
                        },
                    ],
                    duration: duration,
                    ease: 'none',
                })
            })
        }
    }
    customElements.define('home-nft-wrap', HomeNFT);

    class HomeToken extends HTMLElement {
        constructor() {
            super();
            this.el = this;
        }
        connectedCallback() {
            console.log('connected')
            this.setup();
        }
        setup() {
            if (window.innerWidth > 991) return;
            this.update();
        }
        update() {
            if (window.innerWidth > 991) return;
            let headRight = this.el.querySelector('.home-token-table-cell.first').getBoundingClientRect().right
            let contentLeft = this.el.querySelector('.home-token-table-row-content').getBoundingClientRect().left 
            
            let gap = (contentLeft - headRight) * -1
            this.el.querySelectorAll('.home-token-table-row-content').forEach((item, i) => {
                let parent = item.parentElement;
                if (gap > 1) {
                    parent.querySelector('.home-token-table-cell.first').classList.add('on-sticky')
                } else {
                    parent.querySelector('.home-token-table-cell.first').classList.remove('on-sticky')
                }
                item.style.setProperty('clip-path', `inset(0px 0px 0px ${gap}px)`)
            })
            requestAnimationFrame(this.update.bind(this))
        }
    }
    customElements.define('home-token-wrap', HomeToken);

    class HomeRoad extends HTMLElement {
        constructor() {
            super();
            this.el = this;
        }
        connectedCallback() {
            console.log('connected')
            if (window.innerWidth > 767) {
                this.desktop();
            } else {
                this.mobile();
            }
        }
        desktop() {
            let padding = $(window).width() > 991 ? parseRem(160) : parseRem(64);
            let containerWidth = this.el.querySelector('.container').offsetWidth - padding;
            let totalWidth = this.el.querySelector('.home-road-sub-wrap').offsetWidth + ((this.el.querySelector('.home-road-main-item').offsetWidth + parseRem(16)) * 5);
            let distance = totalWidth - containerWidth;
            console.log(distance / $(window).height())
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: this.el.querySelector('.home-road-stick-wrap'),
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                }
            })
            tl
            .fromTo(this.el.querySelector('.home-road-stick'),{x: containerWidth}, {x: `-${distance + containerWidth * 1.5}px`, ease: 'none' })
            .fromTo(this.el.querySelector('.home-road-line-vert'), {x: -containerWidth}, {x: `${((this.el.querySelector('.home-road-main-item').offsetWidth + parseRem(16)) * 5) + containerWidth * 1.5}px`, ease: 'none' }, '<=0')
        }
        mobile() {
            let padding = parseRem(32);
            let containerWidth = this.el.querySelector('.container').offsetWidth - padding;
            let totalWidth = this.el.querySelector('.home-road-sub-wrap').offsetWidth + ((this.el.querySelector('.home-road-main-item').offsetWidth + parseRem(16)) * 5);
            let distance = totalWidth - containerWidth;
            console.log(distance / $(window).height())
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: this.el.querySelector('.home-road-main'),
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                }
            })
            tl
            .fromTo(this.el.querySelector('.home-road-main-inner'),{x: 0}, {x: `-${distance + containerWidth}px`, ease: 'none' })
            .fromTo(this.el.querySelector('.home-road-line-vert'), {x: 0}, {x: containerWidth, ease: 'none' }, '<=0')
        }
    }
    customElements.define('home-road-wrap', HomeRoad);

    class HomeFAQ extends HTMLElement {
        constructor() {
            super();
            this.el = this;
            this.allItems = this.el.querySelectorAll('.home-faq-main-item');
            this.allHead = this.el.querySelectorAll('.home-faq-main-item-head');
        }
        connectedCallback() {
            this.allHead.forEach((item, i) => {
                item.addEventListener('click', () => {
                    this.active(i);
                })
            })
            this.active(0);
        }
        active(index) {
            this.allItems.forEach((item, i) => {
                if (i === index) {
                    item.setAttribute('data-open', 'true');
                } else {
                    item.setAttribute('data-open', 'false');
                }
            })
        }
    }
    customElements.define('home-faq-wrap', HomeFAQ);

    let lastItem = document.querySelectorAll('.home-art-main-item')[document.querySelectorAll('.home-art-main-item').length - 1];
    let firstItem = document.querySelectorAll('.home-art-main-item')[0];

}

window.onload = script