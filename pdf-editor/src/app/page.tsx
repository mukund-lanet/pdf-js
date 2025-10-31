'use client';
import PdfEditor from "@/components/PdfEditor/PdfEditor";
import styles from "./Home.module.scss";

import setupLocatorUI from "@locator/runtime";

if (process.env.NODE_ENV === "development") {
  setupLocatorUI();
}

export default function Home() {
  return (
    <main className={styles.container}>
      <PdfEditor />
    </main>
  );
}