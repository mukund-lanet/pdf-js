import axios from "axios";
import fs from "fs-extra";
import path from "path";
import { Poppler } from "node-poppler";
import { v4 as uuidv4 } from "uuid";

const TMP_DIR = "./tmp";
const OUTPUT_DIR = '../../../../micro-frontend/src/components/contractManagement/images';

export async function downloadPdf(url: string, outputPath: string) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, response.data);
    
    const stats = await fs.stat(outputPath);
    console.log(`[Download] Saved ${stats.size} bytes to ${outputPath}`);
    
    if (stats.size === 0) throw new Error("----------Downloaded file is empty.");
  } catch (error: any) {
    throw new Error(`-----------Download Failed: ${error.message}`);
  }
}

export async function convertPdf(pdfPath: string, jobId: string) {
  const poppler = new Poppler('/usr/bin');
  const jobOutputDir = path.resolve(OUTPUT_DIR, jobId);
  await fs.ensureDir(jobOutputDir);

  const outputPrefix = path.join(jobOutputDir, "page");

  const options = {
    pngFile: true,
  };

  try {
    await poppler.pdfToCairo(pdfPath, outputPrefix, options);

    const files = await fs.readdir(jobOutputDir);
    
    const imagePaths = files
      .filter((file: any) => file.endsWith(".png"))
      .map((file: any) => path.join(jobOutputDir, file))
      .sort((a: any, b: any) => {
          const numA = parseInt(a.match(/-(\d+)\.png$/)[1]);
          const numB = parseInt(b.match(/-(\d+)\.png$/)[1]);
          return numA - numB;
      });

    return imagePaths;
  } catch (error: any) {
    throw new Error(`-------Poppler Tool Error: ${error.message}`);
  }
}

export async function extractImagesFromPdf(firebaseUrl: string) {
  const jobId = uuidv4();
  const currentPdfPath = path.resolve(TMP_DIR, `${jobId}.pdf`);

  try {
    console.log(`[Job ${jobId}] Starting...`);
    
    await downloadPdf(firebaseUrl, currentPdfPath);
    
    const images = await convertPdf(currentPdfPath, jobId);

    if (images.length === 0) {
      console.error("------------------ No images were generated. Is poppler-utils installed?");
      return;
    }

    console.log(`-------------[Job ${jobId}] Success: ${images.length} images created.`);
    return images;
  } catch (error: any) {
    console.error(`-----------[Job ${jobId}] ERROR:`, error.message);
  } finally {
    if (await fs.pathExists(currentPdfPath)) {
      await fs.remove(currentPdfPath);
    }
  }
}

// const testUrl = "https://firebasestorage.googleapis.com/v0/b/tasktool-238217.appspot.com/o/public_objects%2FmloSuit0sK2O0sPyrT9B%2FHY7IAUl86AUMMqVbzGKn%2Fmedia_manager%2F0bd534eb_INV-004%20(1).pdf?alt=media&token=035ad0b6-df60-4039-8aa2-f7cd7a4f4461";

// const imagesList = await main(testUrl);

// console.log({imagesList})