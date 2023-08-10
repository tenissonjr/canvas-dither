const inputFile = document.getElementById('inputFile');
const imagemExibida = document.getElementById('imagemOriginal');
const imagemContainer = document.getElementById('imagemContainer');

let lumR = [];
let lumG = [];
let lumB = [];
for (let i = 0; i < 256; i++) {
    lumR[i] = i * 0.299;
    lumG[i] = i * 0.587;
    lumB[i] = i * 0.114;
}
function monochrome(imageData) {

    let imageDataLength = imageData.data.length;

    // Greyscale luminance (sets r pixels to luminance of rgb)
    for (let i = 0; i <= imageDataLength; i += 4) {
        imageData.data[i] = Math.floor(lumR[imageData.data[i]] + lumG[imageData.data[i + 1]] + lumB[imageData.data[i + 2]]);
    }

    let w = imageData.width;
    let newPixel, err;

    for (let currentPixel = 0; currentPixel <= imageDataLength; currentPixel += 4) {


        // Bill Atkinson's dithering algorithm
        newPixel = imageData.data[currentPixel] < 129 ? 0 : 255;
        err = Math.floor((imageData.data[currentPixel] - newPixel) / 8);
        imageData.data[currentPixel] = newPixel;

        imageData.data[currentPixel + 4] += err;
        imageData.data[currentPixel + 8] += err;
        imageData.data[currentPixel + 4 * w - 4] += err;
        imageData.data[currentPixel + 4 * w] += err;
        imageData.data[currentPixel + 4 * w + 4] += err;
        imageData.data[currentPixel + 8 * w] += err;


        // Set g and b pixels equal to r
        imageData.data[currentPixel + 1] = imageData.data[currentPixel + 2] = imageData.data[currentPixel];
    }

    return imageData;
}

function criarimagemFormatadaBase64(base64String) {
    const imagem = new Image();
    imagem.src = base64String;
    return imagem;
}

function mmToPx(milimetros) {

    const fatorConversao = 3.7795275591
    return milimetros * fatorConversao;
}

function criarCanvasAPartirDeImagem(imagemElement, widthParam, heightParam) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const widthPX = mmToPx(widthParam);
    const heightPX = mmToPx(heightParam);

    canvas.width = widthPX;
    canvas.height = heightPX;

    ctx.drawImage(imagemElement, 0, 0, widthPX, heightPX);

    return canvas;
}

function clonarCanvas(canvasOriginal) {
    const novoCanvas = document.createElement('canvas');
    novoCanvas.width = canvasOriginal.width;
    novoCanvas.height = canvasOriginal.height;

    return novoCanvas;
}

function canvasParaBase64(canvas) {
    const dataURL = canvas.toDataURL(); // A imagem é convertida para uma string base64
    return dataURL;
}

function imageParaBase64(imagemExibida) {
    const canvas = document.createElement('canvas');
    canvas.width = imagemExibida.width;
    canvas.height = imagemExibida.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(imagemExibida, 0, 0);

    const base64String = canvas.toDataURL(); // Obtém a representação em string base64 da imagem

   return base64String;
}

function redimensionarImagem(imagemOriginalParam, widthParam, heightParam) {
    
    //Imagem original
	const imagemOriginalBase64 = document.querySelector('#imagemOriginalBase64')
	imagemOriginalBase64.innerText=imagemOriginalParam.src;

    //Imagem redimensionada
    const canvasImagemRedimensionada = criarCanvasAPartirDeImagem(imagemOriginalParam,widthParam,heightParam );
    const posImagemOriginalDesimensionada = document.querySelector('#posImagemOriginalDesimensionada')
	posImagemOriginalDesimensionada.appendChild(canvasImagemRedimensionada);    

   
	const contextoImageRedimensionada = canvasImagemRedimensionada.getContext("2d");
	const imageRedimensionadaData = contextoImageRedimensionada.getImageData(0, 0,mmToPx(26), mmToPx(35));

	const imagemRedimensionadaBase64 = document.querySelector('#imagemRedimensionadaBase64')
    imagemRedimensionadaBase64.innerText=canvasParaBase64(canvasImagemRedimensionada)



    //Imagem formatada
	const canvasImagemFormatada = clonarCanvas(canvasImagemRedimensionada);
	const contextoImageFormatada = canvasImagemFormatada.getContext("2d");
	const imagemFormatada = monochrome(imageRedimensionadaData);    
	contextoImageFormatada.putImageData(imagemFormatada, 0,0);

	const posImagemFormatada = document.querySelector('#posImagemFormatada')
	posImagemFormatada.appendChild(canvasImagemFormatada);


	const imagemFormatadaBase64 = document.querySelector('#imagemFormatadaBase64')
	imagemFormatadaBase64.innerText=canvasParaBase64(canvasImagemFormatada)


}    

inputFile.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (readerEvent) {
            imagemExibida.src = readerEvent.target.result;
            imagemContainer.style.display = 'block';
            redimensionarImagem(imagemExibida, 26, 35)
        };
        reader.readAsDataURL(file);
        
        
    }
});
