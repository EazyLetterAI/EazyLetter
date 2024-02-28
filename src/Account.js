import * as React from "react";
import "./Account.css";
import { useState } from "react";
import PageHeading from "./PageHeading";

function Account() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you can perform form submission logic, such as sending the form data to a server
    console.log(formData);
    // Clear the form after submission
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
    });
  };
  return (
    <div className="account">
      <PageHeading
        currentPageName="Account" // Set the current page name dynamically
        description="Update your information here to customize your experience." // Set the description dynamically
        imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/821719b1235948e9817e36e82f5135206f1a7df72d1d81de9af32170edfdde1d?"
      />
      <div className="account-form">
        <form onSubmit={handleSubmit}>
          <h1>Personal Details</h1>

          <div>
            <label htmlFor="First name">First name:</label>
            <input
              className="text-input"
              type="text"
              id="firstname"
              name="firstname"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="name">Last name:</label>
            <input
              className="text-input"
              type="text"
              id="lastname"
              name="lastname"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              className="text-input"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="phone">Phone:</label>
            <input
              className="text-input"
              id="phone"
              name="phone"
              value={formData.message}
              onChange={handleInputChange}
              required
            ></input>
          </div>
          <button className="submitbutton" type="submit">
            Update
          </button>
        </form>
      </div>
      <div className="account-form">
        <form onSubmit={handleSubmit}>
          <h1>Academic Details</h1>

          <div>
            <label htmlFor="university">University:</label>
            <input
              className="text-input"
              type="text"
              id="university"
              name="university"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="degree">Degree:</label>
            <input
              className="text-input"
              type="text"
              id="degree"
              name="degree"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              className="text-input"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="phone">Phone:</label>
            <input
              className="text-input"
              id="phone"
              name="phone"
              value={formData.message}
              onChange={handleInputChange}
              required
            ></input>
          </div>
          <button className="submitbutton" type="submit">
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default Account;
