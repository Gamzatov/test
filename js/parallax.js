class Parallax {
    get PAPALLAX_BASE_SELECTOR() { return '.parallax-base'; };
    get PAPALLAX_BGS_CONTAINER_SELECTOR() { return '.parallax-bgs'; };
    get PAPALLAX_BGS_SELECTOR() { return this.PAPALLAX_BGS_CONTAINER_SELECTOR + ' img'; };
    get bases() { return this._bases; };
    set bases(value) {
        this._bases = value;
    }

    constructor($settings = null) {
        this.init();
    }

    init() {
        this.initContainer();
        window.onresize = function() {this.redraw()}.bind(this);
        this.redraw();
        window.onscroll = function() {this.reClip()}.bind(this);

    }
    initContainer() {
        let bgContainer = document.querySelectorAll(this.PAPALLAX_BGS_CONTAINER_SELECTOR)[0];
        document.querySelectorAll(this.PAPALLAX_BASE_SELECTOR).forEach(function(base) {
            var img = document.createElement("img");  
            if (base.dataset.imageSrc)
                img.src = base.dataset.imageSrc;
                bgContainer.appendChild(img);
        });
    }
    redraw() {
        this.bases = this.defineBasesProperties();
        this.reClip();
    }

    reClip() {
        let bgs = document.querySelectorAll(this.PAPALLAX_BGS_SELECTOR);

        for (let i = 0; i < this.bases.length; i++) {
            const overCatForSmoth = 100;
            let clipTop = this.bases[i].top - window.pageYOffset - overCatForSmoth;
            let clipBottom = this.bases[i].height + clipTop + 2* overCatForSmoth;
            clipTop = clipTop > 0 ? clipTop : 0;

            const clipPath = `polygon(0 ${clipTop}px, 100% ${clipTop}px, 100% ${clipBottom}px, 0 ${clipBottom}px)`;
            bgs[i].style.clipPath = clipPath;
            bgs[i].style.webkitClipPath  = clipPath;
        }
    }

    defineBasesProperties() {
        let result = [];
        const bases = document.querySelectorAll(this.PAPALLAX_BASE_SELECTOR);
        for (let i = 0; i < bases.length; i++) {
            result[i] = this.defineElementProperies(bases[i]);
        }
        return result;
    }
    defineElementProperies(element) {
        return {
            top: this.cumulativeOffsetTop(element),
            height: element.clientHeight
        }
    }
    cumulativeOffsetTop(element) {
        var top = 0;
        
        do {
                top += element.offsetTop  || 0;
                top += element.style.paddingTop || 0;
                element = element.offsetParent;
    
        } while(element);
        return top;
    }
};