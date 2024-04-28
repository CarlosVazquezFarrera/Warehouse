import html2canvas from 'html2canvas';

export async function printHTMLElement(idElement: string): Promise<void> {
  const element = document.getElementById(idElement);
  if (!element) return;


  const canvas = await html2canvas(element);

  const ventana = window.open('', '_blank');
  if (!ventana) return;
  ventana.document.write(`<img src="${canvas.toDataURL()}">`);
  ventana.document.close();
  ventana.print();

  ventana.onafterprint = ventana.onbeforeunload = () => {
    ventana.close();
  };
}
