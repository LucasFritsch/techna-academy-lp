criarCarrossel(".about-author__track", ".about-author__slide");
criarCarrossel(".testemonials__track", ".testemonials__testemonial")

function criarCarrossel(trackSelector, slidesSelector) {
    const track = document.querySelector(trackSelector);
    const slides = track.querySelectorAll(slidesSelector);

    track.addEventListener("touchstart", toqueInicio);
    track.addEventListener("touchmove", toqueMoveu);
    track.addEventListener("touchend", toqueFim);

    track.addEventListener("mousedown", toqueInicio);
    track.addEventListener("mousemove", toqueMoveu);
    track.addEventListener("mouseup", toqueFim);
    track.addEventListener("mouseleave", toqueFim);

    let coordenadaXInicioToque = 0;
    let quantoOTrackerJaDeslocou = 0;
    let deslocamentoARealizar = 0;
    let slideAtual = 0;
    let estaArrastando = false;
    let comprimentoSlide;

    function pegarClientX(event) {
    if (event.touches) {
        return event.touches[0].clientX;
    } else {
        return event.clientX;
    }
    }

    function toqueInicio(event){
        coordenadaXInicioToque = pegarClientX(event);
        estaArrastando = true;
        atualizarComprimentoSlide();

        document.body.style.userSelect = "none";
    }

    function pegarSlidesPorTela(){
        if (window.matchMedia("(min-width:992px)").matches) {
            return 2;
        }
        else {
            return 1;
        }
    }

    function pegarIndiceMaximo() {
        return Math.max(0, slides.length - pegarSlidesPorTela());
    }

    function toqueMoveu(event){
        if (estaArrastando == true) {
            const coordenadaXFinalArrasto = pegarClientX(event);
            const diferenca = coordenadaXFinalArrasto - coordenadaXInicioToque;
            deslocamentoARealizar = quantoOTrackerJaDeslocou + diferenca;
            track.style.transform = `translateX(${deslocamentoARealizar}px)`;
        }
    }

    function toqueFim(){
        estaArrastando = false;
        const quantoMoveu = deslocamentoARealizar - quantoOTrackerJaDeslocou;

        // puxou o slide da direita
        if (quantoMoveu < -50 && slideAtual < pegarIndiceMaximo()){
            slideAtual++;
        }

        // puxou o slide da esquerda
        if (quantoMoveu > 50 && slideAtual > 0){
            slideAtual--;
        }

        definirPosicaoPeloIndice();
    }

    function definirPosicaoPeloIndice() {
        trackComputedStyle = window.getComputedStyle(track);
        trackGap = parseFloat(trackComputedStyle.columnGap);

        deslocamentoARealizar = slideAtual * -(comprimentoSlide + trackGap);
        quantoOTrackerJaDeslocou = deslocamentoARealizar;

        track.style.transform = `translateX(${deslocamentoARealizar}px)`;
        atualizarComprimentoSlide();
    }

    function atualizarComprimentoSlide() {
        comprimentoSlide = slides[0].offsetWidth;
    }
}
