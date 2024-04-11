import React, { useState } from "react";
import "../App.css";
import jsPDF from "jspdf";

const Dashboard = () => {
  const [invoiceData, setInvoiceData] = useState({
    fullName: "",
    address: "",
    email: "",
    phone: "",
    bankName: "",
    bankAccount: "",
    clientName: "",
    clientAddress: "",
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    items: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddItem = () => {
    const newItem = {
      itemName: "",
      quantity: 0,
      price: 0,
    };
    setInvoiceData((prevData) => ({
      ...prevData,
      items: [...prevData.items, newItem],
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...invoiceData.items];
    updatedItems[index][name] = value;
    setInvoiceData((prevData) => ({
      ...prevData,
      items: updatedItems,
    }));
  };

  const handlePrint = () => {
    window.print();
  };
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.text("Invoice", 10, 10);
    // Add invoice details to the PDF document
    const invoiceContent = `
      Customer Name: ${invoiceData.fullName}
      Address: ${invoiceData.address}
      Email: ${invoiceData.email}
      Phone: ${invoiceData.phone}
      Bank Name: ${invoiceData.bankName}
      Bank Account Number: ${invoiceData.bankAccount}
      Client Name: ${invoiceData.clientName}
      Client Address: ${invoiceData.clientAddress}
      Invoice Number: ${invoiceData.invoiceNumber}
      Invoice Date: ${invoiceData.invoiceDate}
      Due Date: ${invoiceData.dueDate}
      
      Items:
      ${invoiceData.items
        .map(
          (item) => `
        Item Name: ${item.itemName}
        Quantity: ${item.quantity}
        Price: ${item.price}
      `
        )
        .join("\n")}
    `;
    doc.text(invoiceContent, 10, 20);
    doc.save("invoice.pdf");
  };
  return (
    <div className="invoice-generator">
      <div className="input-section">
        <label>Full Name:</label>
        <input
          type="text"
          name="fullName"
          value={invoiceData.fullName}
          onChange={handleInputChange}
        />
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={invoiceData.address}
          onChange={handleInputChange}
        />
        <label>Email:</label>
        <input
          type="text"
          name="email"
          value={invoiceData.email}
          onChange={handleInputChange}
        />
        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          value={invoiceData.phone}
          onChange={handleInputChange}
        />
        <label>Bank Name:</label>
        <input
          type="text"
          name="bankName"
          value={invoiceData.bankName}
          onChange={handleInputChange}
        />
        <label>Bank Account Number:</label>
        <input
          type="text"
          name="bankAccount"
          value={invoiceData.bankAccount}
          onChange={handleInputChange}
        />
        <label>Client Name:</label>
        <input
          type="text"
          name="clientName"
          value={invoiceData.clientName}
          onChange={handleInputChange}
        />
        <label>Client Address:</label>
        <input
          type="text"
          name="clientAddress"
          value={invoiceData.clientAddress}
          onChange={handleInputChange}
        />
        <label>Invoice Number:</label>
        <input
          type="text"
          name="invoiceNumber"
          value={invoiceData.invoiceNumber}
          onChange={handleInputChange}
        />
        <label>Invoice Date:</label>
        <input
          type="text"
          name="invoiceDate"
          value={invoiceData.invoiceDate}
          onChange={handleInputChange}
        />
        <label>Due Date:</label>
        <input
          type="text"
          name="dueDate"
          value={invoiceData.dueDate}
          onChange={handleInputChange}
        />
        {/* Add more input fields for other details */}
        <button onClick={handleAddItem}>Add Item</button>
      </div>
      <div className="invoice-section">
        <h2>Invoice</h2>
        <p>Customer Name: {invoiceData.fullName}</p>
        <p>Address: {invoiceData.address}</p>
        <p>Email: {invoiceData.email}</p>
        <p>Phone: {invoiceData.phone}</p>
        <p>Bank Name: {invoiceData.bankName}</p>
        <p>Bank Account Number: {invoiceData.bankAccount}</p>
        <p>Client Name: {invoiceData.clientName}</p>
        <p>Client Address: {invoiceData.clientAddress}</p>
        <p>Invoice Number: {invoiceData.invoiceNumber}</p>
        <p>Invoice Date: {invoiceData.invoiceDate}</p>
        <p>Due Date: {invoiceData.dueDate}</p>
        {/* Display other invoice details */}
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    name="itemName"
                    value={item.itemName}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="price"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handlePrint}>Print Invoice</button>
        <button onClick={handleDownload}>Download Invoice</button>
      </div>
    </div>
  );
};

export default Dashboard;
