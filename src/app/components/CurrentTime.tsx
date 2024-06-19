import React from "react";

export default function CurrentTime() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  const currentDate = month + "/" + date + "/" + year;
  const currentTime =
    today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();

  return <div>{currentTime}</div>;
}
