createCarousel(".about-author__track", ".about-author__slide");
createCarousel(".testemonials__track", ".testemonials__testemonial")

function createCarousel(trackSelector, slidesSelector) {
    const track = document.querySelector(trackSelector);
    const slides = track.querySelectorAll(slidesSelector);

    track.addEventListener("touchstart", touchBegin);
    track.addEventListener("touchmove", touchMove);
    track.addEventListener("touchend", touchEnd);

    track.addEventListener("mousedown", touchBegin);
    track.addEventListener("mousemove", touchMove);
    track.addEventListener("mouseup", touchEnd);
    track.addEventListener("mouseleave", touchEnd);

    let coordXTouchBegin = 0;
    let trackerMoved = 0;
    let pendingMove = 0;
    let currentSlide = 0;
    let isDragging = false;
    let slideWidth;

    function getClientX(event) {
    if (event.touches) {
        return event.touches[0].clientX;
    } else {
        return event.clientX;
    }
    }

    function touchBegin(event){
        coordXTouchBegin = getClientX(event);
        isDragging = true;
        updateSlideWidth();

        document.body.style.userSelect = "none";
    }

    function getSlidesOnScreen(){
        if (window.matchMedia("(min-width:992px)").matches) {
            return 2;
        }
        else {
            return 1;
        }
    }

    function getMaxIndex() {
        return Math.max(0, slides.length - getSlidesOnScreen());
    }

    function touchMove(event){
        if (isDragging == true) {
            let coordenadaXFinalArrasto = getClientX(event);
            let diferenca = coordenadaXFinalArrasto - coordXTouchBegin;
            pendingMove = trackerMoved + diferenca;
            track.style.transform = `translateX(${pendingMove}px)`;
        }
    }

    function touchEnd(){
        isDragging = false;
        let movement = pendingMove - trackerMoved;

        // puxou o slide da direita
        if (movement < -50 && currentSlide < getMaxIndex()){
            currentSlide++;
        }

        // puxou o slide da esquerda
        if (movement > 50 && currentSlide > 0){
            currentSlide--;
        }

        setPositionByIndex();
    }

    function setPositionByIndex() {
        trackComputedStyle = window.getComputedStyle(track);
        trackGap = parseFloat(trackComputedStyle.columnGap);

        pendingMove = currentSlide * -(slideWidth + trackGap);
        trackerMoved = pendingMove;

        track.style.transform = `translateX(${pendingMove}px)`;
        updateSlideWidth();
    }

    function updateSlideWidth() {
        slideWidth = slides[0].offsetWidth;
    }
}
