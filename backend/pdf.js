const fs = require("fs").promises; // using fs.promises to enable async/await
const { ExportSdkClient } = require("@exportsdk/client");

async function downloadPDF() {
  const client = new ExportSdkClient(
    "eazyletter_bbedd4a1-7071-4803-a0ce-79187c13357c"
  );

  const templateId = "19aa0f5f-6aa7-483f-8e54-6190652f294c";
  const templateData = {
    firstName: "Jon",
    middleName: "Bon",
    lastName: "Hqssd",
  };

  // Render PDF binary
  const result = await client.renderPdf(templateId, templateData);

  // Extract PDF content from the result
  const binary = result.data; // assuming 'data' is the property containing PDF content

  // Save binary as PDF file
  await fs.writeFile("output.pdf", binary, "binary");

  console.log("PDF file has been downloaded successfully.");
}

// Call the async function
downloadPDF().catch((error) => {
  console.error("Error downloading PDF:", error);
});
