"use client";

import React from "react";
import ASCIIText from "@/components/ui/ASCIIText";

function NotFound() {
  return <div className="h-full flex p-0 items-center justify-center bg-black">
    <div>
        <h1 className="text-5xl text-white max-w-100">Uh Oh this looks like an error.</h1>
    </div>
    <div>
        <ASCIIText  text='404' enableWaves={true} asciiFontSize={8}/>
    </div>
  </div>;
}

export default NotFound;
