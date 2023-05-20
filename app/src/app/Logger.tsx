"use client";

import { useEffect, useState } from "react";

export const Logger = () => {
  useEffect(() => {
    console.log(
      "       _____                                       _____\n\
      /\\  __`\\                                    /\\  __`\\\n\
      \\ \\ \\/\\ \\    ____    ___     __     _ __    \\ \\ \\/\\ \\   __  _\n\
       \\ \\ \\ \\ \\  /',__\\  /'___\\ /'__`\\  /``'__\\   \\ \\ \\ \\ \\ /\\ \\/'\\\n\
        \\ \\ \\_\\ \\/\\__, `\\/\\ \\__//\\ \\L\\.\\_\\ \\ \\/     \\ \\ \\_\\ \\\\/>  </\n\
         \\ \\_____\\/\\____/\\ \\____\\ \\__/.\\_\\\\ \\_\\      \\ \\_____\\/\\_/\\_\\\n\
          \\/_____/\\/___/  \\/____/\\/__/\\/_/ \\/_/       \\/_____/\\//\\/_/"
    );
    console.log(
      `Welcome to %cOscar Ox %c- %c${process.env.NEXT_PUBLIC_STAGE}`,
      "color: red",
      "color: black",
      "color: blue"
    );
  }, []);

  return null;
};
