import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
console.log('tete');

/*
async function addPost(conteudo, data, intro) {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      conteudo,
      data,
      intro,
    });
    console.log('id: ' + docRef.id);
  } catch (error) {
    console.log('error ?');
    console.log('erro ao add', e);
  }
}
*/
//editor de texto
const salvar = document.querySelector('.salvar');
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
/*
//extrair imagem do conteudo html e pega o src
function extractBase64Images(htmlContent) {
  const imageTags = htmlContent.match(/<img [^>]*src="[^"]*"[^>]*>/gm);
  const base64Images = [];

  if (imageTags) {
    imageTags.forEach((tag) => {
      const src = tag.match(/src="([^"]*)"/);
      if (src && src[1].startsWith('data:image')) {
        base64Images.push(src[1]);
      }
    });
  }

  return base64Images;
}
*/
/*
//salvar imagem no banco e cria nome unico

async function uploadBase64Images(base64Images) {
  const uploadPromises = base64Images.map((base64String, index) => {
    //Cria um nome único para cada imagem
    const imageName = `image_${Date.now()}_${index}.png`; //

    //sobe a imagem
    return uploadImage(base64String, imageName);
  });

  return await Promise.all(uploadPromises);
}
//sobe imagem
async function uploadImage(base64String, imageName) {
  const storageRef = ref(storage, `posts/${imageName}`);
  await uploadString(storageRef, base64String, 'data_url');
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

async function uploadImageIntro(arquivo) {
  const uniqueName = `${uuidv4()}_${Date.now()}_${arquivo.name}`; // Gera nome único

  const storageRef = ref(storage, `posts/${uniqueName}`);
  try {
    await uploadBytesResumable(storageRef, arquivo); // Realiza o upload
    const downloadURL = await getDownloadURL(storageRef); // Obtém a URL de download
    return downloadURL;
  } catch (error) {
    console.error('Erro no upload:', error);
  }
}
*/
async function processHtmlContent() {
  //pega conteudo html do editor
  let html = quill.getSemanticHTML(0);
  const delta = quill.getContents();

  //pega src da imagem
  /*
  const base64Images = extractBase64Images(html);

  //separa as imagens,cria nome unico e sobe elas pro bd e retorna referencia
  const imageUrls = await uploadBase64Images(base64Images);

  //alterar na imagem o src, colocando referencia do bd
  base64Images.forEach((base64String, index) => {
    html = html.replace(base64String, imageUrls[index]);
  });
  //pegar data atual
  const hoje = new Date();
  const dia = hoje.getDate();
  const mes = hoje.getMonth() + 1;
  const ano = hoje.getFullYear();
  const dtAtual = dia + '/' + mes + '/' + ano;
  const intro = await introFormulario();
  //subir tudo pro bd
  addPost(html, dtAtual, intro);
  */
}

async function introFormulario() {
  const form = document.querySelector('.formIntro');
  const imgIntro = document.querySelector('.imgIntro').files[0];
  const textoIntro = form.elements['textoIntro'].value;
  const autor = form.elements['autor'].value;
  const titulo = form.elements['titulo'].value;

  if (textoIntro && imgIntro && autor && titulo) {
    console.log(textoIntro, imgIntro, autor);
  } else {
    form.querySelector('.aviso').classList.add('ativo');
  }
}

salvar.addEventListener('click', processHtmlContent);

//ver se usuario ta logado
