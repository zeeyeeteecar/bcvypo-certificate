"use server";
import { revalidatePath } from "next/cache";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, uploadFileToS3 } from "@/lib/lib";

import React from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { headers } from "next/headers";

import fs from "fs";
import { jsPDF } from "jspdf";
import moment from "moment-timezone";

//=============================================
// const s3Client = new S3Client({
//   region: process.env.NEXT_AWS_S3_REGION,
//   credentials: {
//     accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID,
//     secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY,
//   },
// });

//=============================================

// async function uploadFileToS3(file, fileName) {
//   const fileBuffer = file;

//   const params = {
//     Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME,
//     Key: `${fileName}`,
//     Body: fileBuffer,
//   };

//   const command = new PutObjectCommand(params);

//   try {
//     const response = await s3Client.send(command);
//     console.log("File uploaded successfully", response);
//     return fileName;
//   } catch (error) {
//     throw error;
//   }
// }

//=============================================

export default async function createPdf() {
  const currentTime = moment().format("HH:mm:ss");

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

  page.drawText(currentTime, {
    x: 50,
    y: height - 8 * fontSize,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0.53, 0.71),
  });

  const pdfBytes = await pdfDoc.save();

  const buffer = Buffer.from(await pdfBytes);
  await uploadFileToS3(await buffer, "filename_" + currentTime + ".pdf");
  revalidatePath("/listFiles");

  fs.writeFile(
    "public/createPDF/test_" + currentTime + ".pdf",
    pdfBytes,
    (err) => {
      if (err) {
        console.error(err);
      } else {
        // file written successfully
      }
    }
  );
  //download(pdfBytes, "out.pdf", "application/pdf");

  // const doc = new jsPDF("p", "mm", [500, 250]);

  // doc.text("Richmond Centre for Disability", 10, 30);

  // doc.text("permit#:", 20, 30);

  // doc.save("src/app/ta4.pdf");

  const headersList = headers();
  const host = headersList.get("X-Forwarded-Host");
  const proto = headersList.get("X-Forwarded-Proto");

  return (
    <>
      <div>{}</div>
      <div>currentTime:{currentTime}</div>
      <div>{JSON.stringify(host)}</div>
    </>
  );
}
