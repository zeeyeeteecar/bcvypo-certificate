import React from "react";
import { revalidatePath } from "next/cache";
import { exportedCertList, generateCert } from "../lib/lib";
import {ListObject} from "@/lib/lib"
import Link from "next/link";

let globe_exportedCertList = null;

export default async function ExportCert() {
  const array_exportedCertList = await ListObject();

  async function exportCert(data: FormData) {
    "use server";
    const memberNameList = data.get("memberNameList")?.valueOf().toString();
    const array_memberNameList = memberNameList
      ?.replace(/\r\n/g, "\n")
      .split("\n");

    console.log(array_memberNameList);
    if (array_memberNameList) {
      for (let i = 0; i < array_memberNameList.length; i++) {
        const memberName = array_memberNameList[i].toString();
        await generateCert(memberName);
      }
    }

    revalidatePath("/exportCertificate");
  }

  console.log("typeof", typeof exportedCertList());

  return (
    <main className="w-[1500px] h-[1000px] border p-2 space-x-2 flex flex-row">
      <div className="w-1/3 border h-full p-2">
        <form action={exportCert} className="w-full h-full space-y-2">
          <textarea
            className="h-[600px] w-full text-slate-600 p-2 rounded-lg"
            id="memberNameList"
            name="memberNameList"
            required
          ></textarea>

          <button
            type="submit"
            className=" w-full bg-blue-100 border border-blue-300 text-blue-600 h hover:text-white hover:bg-blue-700 focus:ring-4 text-lg focus:outline-none focus:ring-blue-100 font-medium rounded-lg   px-5 py-2.5 text-center "
          >
            Submit
          </button>
        </form>
      </div>
      <div className="w-1/3 border h-ful">
        {array_exportedCertList && array_exportedCertList.map((certName:any) => {
          return (
            <div className="h-[40px] flex items-center border p-2 ">
              <Link
                className="hover:text-slate-200"
                href={"/certificateExport/" + certName.Key}
                target="_blank"
              >
                {certName.Key}
              </Link>
{/* {JSON.stringify(certName)} */}
            </div>
          );
        })}
      </div>
      <div className="w-1/3 border h-ful">{}</div>
    </main>
  );
}
