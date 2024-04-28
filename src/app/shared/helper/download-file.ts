import html2canvas from 'html2canvas';

type validFiles = 'jpeg' | 'png';


export async function downloadHTMLElement(idElement: string, name: string, extension: validFiles) {
  const element = document.getElementById(idElement);

  if (!element) return;
  const canvas = await html2canvas(element);
  const imagenDataURL: string = canvas.toDataURL();
  const enlaceDescarga: HTMLAnchorElement = document.createElement("a");
  enlaceDescarga.href = imagenDataURL;
  const nameFile = `${name}_${getDateString()}.${extension}`;
  enlaceDescarga.download = nameFile;
  enlaceDescarga.click();
}


function getDateString(): string {
  const date = new Date();
  const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const hourString = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
  return `${dateString}_${hourString}`;
}
