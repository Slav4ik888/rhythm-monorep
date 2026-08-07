/** Удаляет кнопку Живосайта */
export const removeJivoSite = () => {
  const jivo = document.querySelector('jdiv');

  if (jivo) jivo.remove();
}
