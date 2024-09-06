const salvar = document.querySelector('.salvar');
const contentType = 'image/png';

const quill = new Quill('#editor', {
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }],
      ['bold', 'italic', 'underline'],
      ['image', 'code-block'],
    ],
  },
  placeholder: 'Compose an epic...',
  theme: 'snow', // or 'bubble'
});
salvar.addEventListener('click', processHtmlContent);

function processHtmlContent() {
  const images = extractImagesFromQuill();
  const form = extractTextandConvertImgBlob(images);

  fetch('/api/upload', {
    method: 'POST',
    body: form,
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error.message));
}

function extractImagesFromQuill() {
  const delta = quill.getContents();
  const images = [];

  delta.ops.forEach((op) => {
    if (op.insert && op.insert.image) {
      images.push(op.insert.image); // Aqui as imagens estão em base64
    }
  });

  return images;
}
function extractTextandConvertImgBlob(images) {
  const formData = new FormData();
  const html = quill.getSemanticHTML();
  const formulario = document.querySelector('.formIntro');
  const imgIntro = document.querySelector('.imgIntro').files[0];
  const textoIntro = formulario.elements['textoIntro'].value;
  const categoryTag = formulario.elements['categoryTag'].value;
  const autor = formulario.elements['autor'].value;
  const titulo = formulario.elements['titulo'].value;
  const hoje = new Date();
  const dia = hoje.getDate();
  const mes = hoje.getMonth() + 1;
  const ano = hoje.getFullYear();
  const dtAtual = dia + '/' + mes + '/' + ano;
  images.forEach((image, index) => {
    const blob = base64ToBlob(image); // Convertemos a base64 para blob
    formData.append(`image_${index}`, blob, `image_${index}.png`); // Nome único
  });
  //IMPORTANTE:::ao mudar ordem do formData.append do blob e do img intro ira interferir no final::IMPORTANTE
  formData.append('categoryTag', categoryTag);
  formData.append('html', html);
  formData.append('imgIntro', imgIntro);
  formData.append('textoIntro', textoIntro);
  formData.append('autor', autor);
  formData.append('titulo', titulo);
  formData.append('data', dtAtual);

  return formData;
}
function base64ToBlob(base64) {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers); // Cria um array de bytes a partir dos códigos ASCII
  return new Blob([byteArray], { type: contentType }); // Cria um Blob a partir do array de bytes
}
