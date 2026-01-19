/**
 * JVDZ Digital Store - API Backend
 */

// --- CONFIGURATION ---
// 1. Spreadsheet ID (from URL)
const SPREADSHEET_ID = "1Y8nlh45khut-KmP0tjwD7doBl3VMJf1ORZwLT5gbYXU"; 
// 2. Folder ID (from URL)
const FOLDER_ID = "1cQFOXjP565gZdOAFDJ_m6pcYLSG36hwA"; 

// --- API Endpoints ---

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getProducts') {
    return getProducts();
  }
  
  // Health check endpoint
  return createJSONOutput({ status: 'Active', message: 'JVDZ API is online' });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000); // Wait up to 10s to avoid collisions

  try {
    let data;
    // robust parsing
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error("No data received");
    }

    const result = processOrder(data);
    return createJSONOutput(result);

  } catch (error) {
    return createJSONOutput({ success: false, error: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

function createJSONOutput(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// --- Logic ---

function getProducts() {
  if (SPREADSHEET_ID.includes("REPLACE_WITH")) return createJSONOutput([]);

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName("Inventory");
    if (!sheet) return createJSONOutput([]);
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return createJSONOutput([]); 

    data.shift(); 
    
    const products = data.map(row => ({
      uuid: row[0].toString(),
      name: row[1],
      price: Number(row[2]),
      category: row[3],
      platform: row[4],
      region: row[5],
      imageUrl: row[6],
      stockStatus: row[7],
      description: row[8]
    }));
    
    return createJSONOutput(products);
  } catch (e) {
    return createJSONOutput([]);
  }
}

function processOrder(formObject) {
  if (SPREADSHEET_ID.includes("REPLACE_WITH")) {
    return { success: false, error: "Configuration Error: Spreadsheet ID is missing in Code.gs" };
  }

  const { customerName, phone, email, paymentMethod, itemsJson, totalAmount, fileData, mimeType, fileName } = formObject;
  
  // 1. Upload Proof
  let fileUrl = "No Image";
  if (fileData && !FOLDER_ID.includes("REPLACE_WITH")) {
    try {
      const folder = DriveApp.getFolderById(FOLDER_ID);
      const decodedFile = Utilities.base64Decode(fileData);
      const blob = Utilities.newBlob(decodedFile, mimeType, `Proof_${customerName}_${Date.now()}_${fileName}`);
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      fileUrl = file.getUrl();
    } catch (e) {
      fileUrl = "Upload Failed: " + e.toString();
    }
  }

  const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const timestamp = new Date();

  // 2. Save to Sheets
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName("Orders");
  if (!sheet) {
    sheet = ss.insertSheet("Orders");
    sheet.appendRow(["Order ID", "Timestamp", "Customer Name", "Phone", "Email", "Items", "Total", "Payment Method", "Proof URL", "Status"]);
  }
  
  sheet.appendRow([
    orderId,
    timestamp,
    customerName,
    phone,
    email,
    itemsJson,
    totalAmount,
    paymentMethod,
    fileUrl,
    "Pending"
  ]);

  return { success: true, orderId: orderId };
}