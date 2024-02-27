const express = require("express");
const bodyParser = require("body-parser");
const { jsPDF } = require("jspdf");
const app = express();
const port = 3000; // You can choose any available port
const { OpenAI } = require("openai");
const fs = require("fs").promises;
const { ExportSdkClient } = require("@exportsdk/client");

const openai = new OpenAI({
  apiKey: "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",
});

app.use(express.json());

// Define your function to call OpenAI
async function getOpenAICompletion(Name, Company, Position, Jobdescription) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Write a cover letter for ${Name} who wants to work for ${Company} as a ${Position}, as described in this job description: ${Jobdescription}`,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return null;
  }
}

app.post("/submit-input", async (req, res) => {
  try {
    const { Name, Company, Position, Jobdescription } = req.body;
    console.log(
      "Received input values:",
      Name,
      Company,
      Position,
      Jobdescription
    );

    // Add your logic here to process the input values

    // Call the OpenAI function to get completion
    const completion = await getOpenAICompletion(
      Name,
      Company,
      Position,
      Jobdescription
    );

    // Return response with OpenAI completion and input values
    res.json(completion);
    console.log(completion);
  } catch (error) {
    console.error("Error processing input:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

app.post("/api/generatePDF", (req, res) => {
  const { Name, Url, Email, Phone, City, responseContent } = req.body;
  const doc = new jsPDF();

  var pageWidth = doc.internal.pageSize.width;
  var pageHeight = doc.internal.pageSize.height;
  var containerX = 10;
  var containerY = 15;
  var lineHeight = 5;

  doc.setFont("times", "bold");
  doc.setFontSize(18);

  // PDF generation logic

  // Add content to the PDF document
  doc.text(`${Name}`, 10, 10);
  doc.setFont("times", "normal");
  doc.setFontSize(14);
  doc.text(`${Url}`, 10, 20);
  doc.text(`${Email}`, 10, 30);
  doc.text(`${Phone}`, 40, 30);
  doc.text(`${City}`, 60, 30);
  doc.setFontSize(13);
  doc.text(`${responseContent}`, 10, 40);

  // Save the PDF to a buffer
  const pdfBuffer = doc.output();

  // Send the PDF buffer back to the client
  res.setHeader("Content-Type", "application/pdf");
  res.send(pdfBuffer);
});

app.get("/download-pdf", async (req, res) => {
  try {
    const client = new ExportSdkClient(
      "eazyletter_bbedd4a1-7071-4803-a0ce-79187c13357c"
    );

    const templateId = "19aa0f5f-6aa7-483f-8e54-6190652f294c";

    // Extract arguments from the request query or body
    const { Name, Url, Email, Phone, City, responseContent } = req.query;

    // Construct template data with the provided arguments
    const templateData = {
      Name: { Name },
      Url: Url,
      Email: Email,
      Phone: Phone,
      City: City,
      responseContent: responseContent,
    };

    // Render PDF binary
    const result = await client.renderPdf(templateId, templateData);

    // Extract PDF content from the result
    const binary = result.data;

    // Save binary as PDF file
    await fs.writeFile("output.pdf", binary, "binary");

    console.log("PDF file has been downloaded successfully.");

    // Send the PDF file to the client for download
    const file = `${__dirname}/output.pdf`;
    res.download(file); // Send the file as an attachment
  } catch (error) {
    console.error("Error downloading PDF:", error);
    res.status(500).send("Error downloading PDF");
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
