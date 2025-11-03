'use client';
import PdfEditor from "@/components/PdfEditor";

import setupLocatorUI from "@locator/runtime";

if (process.env.NODE_ENV === "development") {
  setupLocatorUI();
}

export default function Home() {
  return (
      <PdfEditor />
  );
}