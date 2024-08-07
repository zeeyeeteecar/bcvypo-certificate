"use server";
import { promises as fs } from "fs";
import path from "path";
import { headers } from "next/headers";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { revalidatePath } from "next/cache";
import { s3Client, uploadFileToS3 } from "@/lib/lib";

export async function exportedCertList() {
  const path_certificateExport = path.resolve(process.cwd(), "src", "tmp");
  const fileObjs = await fs.readdir(path_certificateExport);
  //const fileObjs = fs.readdirSync(path.join("public/certificateExport"));
  let fileList: string[] = [];

  fileObjs.forEach((file) => {
    fileList.push(file);
  });

  return fileList;
}

export async function generateCert(_memberName: string) {
  const headersList = headers();
  const host = headersList.get("X-Forwarded-Host");
  const proto = headersList.get("X-Forwarded-Proto");

  const textbox_Member_Name = "Orchestra_Member_Name";
  const Member_Name = "Tom Tang Tom";

  const path_certificateExport = path.resolve(process.cwd(), "src", "tmp");

  const url =
    "http://" + host + "/bcvypo_certificate_2023-2024_form_sample.pdf";
  //   const url = "https://pdf-lib.js.org/assets/with_update_sections.pdf";
  //const pdf = await fetch(url).then((res) => res.arrayBuffer());

  console.log(
    "host==",
    "http://" + host + "/bcvypo_certificate_2023-2024_form_sample.pdf"
  );
  const pdfData = await fs.readFile(
    path_certificateExport + "/bcvypo_certificate_2023-2024_form_sample.pdf"
  );

  const pdfDoc = await PDFDocument.load(pdfData);
  //const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  const form = pdfDoc.getForm();

  const nameField = form.getTextField(textbox_Member_Name);
  nameField.setText(_memberName);
  nameField;

  form.flatten();

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  //   const { width, height } = firstPage.getSize();
  //   firstPage.drawText("This text was added with JavaScript!", {
  //     x: 5,
  //     y: height / 2 + 300,
  //     size: 20,
  //     font: helveticaFont,
  //     color: rgb(0.95, 0.1, 0.1),
  //     rotate: degrees(-45),
  //   });

  const pdfBytes = await pdfDoc.save();

  const buffer = Buffer.from(await pdfBytes);
  await uploadFileToS3(await buffer, "certificate_" + _memberName + ".pdf");
  revalidatePath("/listFiles");

  // await fs.writeFile(
  //   path_certificateExport + "/filledPDF" + _memberName + ".pdf",
  //   pdfBytes
  // );
}
