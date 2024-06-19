import React from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import download from "downloadjs";
import fs from "fs";
import { jsPDF } from "jspdf";
import moment from "moment-timezone";
import CurrentTime from "../components/CurrentTime";

export default async function createPdf() {
  //const currentTime = moment(new Date()).tz('America/Vancouver').format("HH:mm:ss");

  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 10;
  page.drawText("Creating PDFs in JavaScript is awesome1234!", {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0.53, 0.71),
  });

  page.drawText(CurrentTime.toString(), {
    x: 50,
    y: height - 8 * fontSize,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0.53, 0.71),
  });

  const pdfBytes = await pdfDoc.save();

  const content = "Some content!55";

  fs.writeFile("src/app/createPDF/test.pdf", pdfBytes, (err) => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
    }
  });
  //download(pdfBytes, "out.pdf", "application/pdf");

  // const doc = new jsPDF("p", "mm", [500, 250]);

  // doc.text("Richmond Centre for Disability", 10, 30);

  // doc.text("permit#:", 20, 30);

  // doc.save("src/app/ta4.pdf");

  return (
    <>
      <div>
        <CurrentTime />
      </div>
      <div>{JSON.stringify(pdfBytes)}</div>
    </>
  );
}
