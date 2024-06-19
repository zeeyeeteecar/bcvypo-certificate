import React from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";

export default async function page() {
  //const url = "src/app/fillPDF/formFillPDF.pdf";
  const url = 'https://pdf-lib.js.org/assets/with_update_sections.pdf'
  const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  firstPage.drawText("This text was added with JavaScript!", {
    x: 5,
    y: height / 2 + 300,
    size: 50,
    font: helveticaFont,
    color: rgb(0.95, 0.1, 0.1),
    //rotate: degrees(-45),
  });

  const pdfBytes = await pdfDoc.save();

  fs.writeFile("src/app/fillPDF/filledPDF.pdf", pdfBytes, (err) => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
    }
  });

  return <div>page</div>;
}