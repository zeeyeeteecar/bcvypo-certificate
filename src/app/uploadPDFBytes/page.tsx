import React from "react";
import { prisma } from "@/lib/prisma";

export default async function page() {
  const certPDFs = await prisma.tbl_certificate.findMany();

  return (
    <div>
      <div>{JSON.stringify(certPDFs)}</div>
      <div>
        {certPDFs &&
          certPDFs.map((certPDF: any, key: number) => {
            return (
              <div key={key}>
                {certPDF.ID} -- {certPDF.cert_year} -- {certPDF.cert_memberName}{" "}
                -- {certPDF.cert_PDFBytes}
              </div>
            );
          })}
      </div>
    </div>
  );
}
