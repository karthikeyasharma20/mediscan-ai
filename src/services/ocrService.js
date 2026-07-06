import Tesseract from "tesseract.js";

// Helper to extract text from a digital PDF file using pdf.js loaded via CDN
export const extractTextFromPDF = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function () {
      try {
        const typedarray = new Uint8Array(this.result);
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        
        if (!pdfjsLib) {
          throw new Error("PDF.js library failed to load from CDN.");
        }
        
        // Configure worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let fullText = "";
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(" ");
          fullText += pageText + "\n";
        }
        
        resolve(fullText.trim());
      } catch (error) {
        console.error("PDF extraction error:", error);
        reject(new Error("Unable to extract text from PDF. Make sure it is not password protected."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const extractText = async (file) => {
  if (file.type === "application/pdf") {
    return await extractTextFromPDF(file);
  } else {
    const result = await Tesseract.recognize(
      file,
      "eng",
      {
        logger: (m) => console.log(m.status, Math.round(m.progress * 100) + "%"),
      }
    );
    return result.data.text;
  }
};