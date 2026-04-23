createCarousel(".testemonials__track", ".testemonials__testemonial", "#testemonials__previous-button", "#testemonials__next-button");
createCarousel(".about-author__track", ".about-author__slide", "#about-author__previous-button", "#about-author__next-button");

function createCarousel(trackSelector, slidesSelector, prevButtonSelector, nextButtonSelector) {
    const track = document.querySelector(trackSelector);
    const slides = track.querySelectorAll(slidesSelector);
    const prevButton = document.querySelector(prevButtonSelector);
    const nextButton = document.querySelector(nextButtonSelector);

    track.addEventListener("touchstart", touchBegin);
    track.addEventListener("touchmove", touchMove);
    track.addEventListener("touchend", touchEnd);

    track.addEventListener("mousedown", touchBegin);
    track.addEventListener("mousemove", touchMove);
    track.addEventListener("mouseup", touchEnd);
    track.addEventListener("mouseleave", touchEnd);

    prevButton.addEventListener("click", decreaseSlide)
    nextButton.addEventListener("click", increaseSlide)

    let coordXTouchBeginning = 0;
    let trackerMoved = 0;
    let pendingMovement = 0;
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

    function touchBegin(event){
        coordXTouchBeginning = getClientX(event);
        isDragging = true;
        updateSlideWidth();

        document.body.style.userSelect = "none";
    }    

    function touchMove(event){
        if (isDragging == true) {
            let coordXDragEnd = getClientX(event);
            let diff = coordXDragEnd - coordXTouchBeginning;
            pendingMovement = trackerMoved + diff;
            track.style.transform = `translateX(${pendingMovement}px)`;
        }
    }

    function touchEnd(){
        isDragging = false;
        let movement = pendingMovement - trackerMoved;

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
        const trackComputedStyle = window.getComputedStyle(track);
        const trackGap = parseFloat(trackComputedStyle.columnGap);

        pendingMovement = currentSlide * -(slideWidth + trackGap);
        trackerMoved = pendingMovement;

        track.style.transform = `translateX(${pendingMovement}px)`;
        updateSlideWidth();
    }

    function updateSlideWidth() {
        slideWidth = slides[0].offsetWidth;
    }

    function decreaseSlide() {
        if (currentSlide > 0){
            currentSlide--

            setPositionByIndex();
        }
    }

        function increaseSlide() {
        if (currentSlide < getMaxIndex()){
            currentSlide++;

            setPositionByIndex();
        }
    }
}
