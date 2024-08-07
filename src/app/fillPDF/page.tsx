import React from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";
import { headers } from "next/headers";

export default async function page() {
  const headersList = headers();
  const host = headersList.get("X-Forwarded-Host");
  const proto = headersList.get("X-Forwarded-Proto");

  const url =
    "http://" + host + "/bcvypo_certificate_2023-2024_form_sample.pdf";
  //   const url = "https://pdf-lib.js.org/assets/with_update_sections.pdf";
  const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const form = pdfDoc.getForm();

  const nameField = form.getTextField("Text1");
  nameField.setText(
    `Mario is a fictional character in the Mario video game franchise, `
  );

  form.flatten();

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  firstPage.drawText("This text was added with JavaScript!", {
    x: 5,
    y: height / 2 + 300,
    size: 20,
    font: helveticaFont,
    color: rgb(0.95, 0.1, 0.1),
    //rotate: degrees(-45),
  });

  const pdfBytes = await pdfDoc.save();

  fs.writeFile("public/fillPDF/filledPDF.pdf", pdfBytes, (err) => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
    }
  });

  const files = fs.readdirSync(path.join("public/"));

  

  return (
    <>
      <div>{host}</div>
      <div>{JSON.stringify(files)}</div>
    </>
  );
}
