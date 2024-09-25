import React, { useState, useEffect } from "react";
import "./date.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const BookingForm = () => {
  const TICKET_PRICE = 700;
  const initialState = {
    name: "",
    email: "",
    phone: "",
    address: "",
    date: "",
    tickets: "",
    discountCode: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [isdateEnabled, setIsdateEnabled] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [emailError, setemailError] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // Define selectedDate state
// Captcha state
const [captchaNum1, setCaptchaNum1] = useState(0);
const [captchaNum2, setCaptchaNum2] = useState(0);
const [captchaAnswer, setCaptchaAnswer] = useState('');
const [captchaCorrect, setCaptchaCorrect] = useState(false);

// Randomly generate captcha numbers
useEffect(() => {
  generateCaptcha();
}, []);

const generateCaptcha = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  setCaptchaNum1(num1);
  setCaptchaNum2(num2);
};

const handleCaptchaChange = (e) => {
  const value = e.target.value;
  setCaptchaAnswer(value);
  if (parseInt(value) === captchaNum1 + captchaNum2) {
    setCaptchaCorrect(true);
  } else {
    setCaptchaCorrect(false);
  }
};

  const notifySuccess = (message) => {
    toast.success(message, 
      {
        className: "cts",
        autoClose: 5000,
      }
    );
  };
  const notifySuccessPerm = (res) =>
    toast.success(
        <>
        <div className="customAlert">
          <p>
            Confirmed! Booking ID {res.data.token}. You are entitled to  
            {res.data.tickets} tickets dated {res.data.date} for Taaza Dandiya
            @Netaji Indoor Stadium subject to clearance of payment. T&C apply.
          </p>
          <p>
            <strong>Goto the Ticket counter at the venue to redeem.</strong>
          </p>
          <button
            onClick={() =>
              (window.location.href = "https://dandiya.taazatv.com")
            }
            className="redirectbutton"
            title="go to home"
            style={{ padding: "8px 16px"}}
          >
            Back to Home Page
          </button>
        </div>
      </>, {
      className: "scs",
      autoClose: false,
      position: "top-center",
    });

  const notifyError = (message) =>
    toast.error(message, {
      className: "cte",
      autoClose: 5000,
    });
  const notifyErrorPerm = (message) =>
    toast.error(message, {
      className: "sce",
      autoClose: false,
    });
  // Fetch booking status based on the selected date
  const fetchBookingStatus = async (selectedDate) => {
    try {
      const response = await fetch(
        `https://taaza-dandiya-backend.onrender.com/api/admin/booking-status/${selectedDate}`
      );
      const data = await response.json();
      setIsdateEnabled(data.bookingEnabled);
    } catch (error) {
      console.error("Error fetching booking status:", error);
    }
  };

  // Check booking status whenever a date is selected
  useEffect(() => {
    if (formData.date) {
      fetchBookingStatus(formData.date);
    }
  }, [formData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "email") {
      validateEmail(value);
    }
  };

  const handleDateSelect = (dateString) => {
    const date = new Date(dateString);

    const formattedDate = [
      date.getFullYear(),

      String(date.getDate()).padStart(2, "0"),
      String(date.getMonth() + 1).padStart(2, "0"),
    ].join("-");

    setFormData({ ...formData, date: formattedDate });
    setSelectedDate(dateString);
  };
  const verifyDiscountCode = async () => {
    if (formData.discountCode && formData.date) {
      try {
        // Convert the date to YYYY-MM-DD format to ensure consistency across platforms
        const formattedDate = new Date(formData.date).toISOString().split('T')[0];
        
        console.log({ code: formData.discountCode, date: formattedDate });
  
        const response = await fetch(
          "https://taaza-dandiya-backend.onrender.com/api/admin/verify-coupon",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code: formData.discountCode,
              date: formattedDate, // Send the formatted date
            }),
          }
        );
  
        if (!response.ok) {
          const result = await response.json();
          notifyError(`Coupon error: ${result.message}`);
          setDiscount(0);
        } else {
          const result = await response.json();
          setDiscount(result.discount);
          notifySuccess(`Discount applied: ${result.discount}%`);
        }
      } catch (error) {
        console.error("Error verifying coupon:", error);
        notifyError("Failed to verify coupon, please try again.");
      }
    } else {
      notifyError("Please enter a discount code and select a valid date.");
    }
  };
  
  const validateEmail = (email) => {
    // Simple email validation regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setemailError("Please enter a valid email address");
    } else {
      setemailError(""); // Clear the error if email is valid
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDateObj = new Date(formData.date);
    const currentDateObj = new Date();

    // Check if the selected date is in the past
    if (selectedDateObj < currentDateObj.setHours(0, 0, 0, 0)) {
      notifyError("The selected event date has already passed.");
      return;
    }

     if (!isdateEnabled) {
        notifyError('Booking is currently disabled for the selected date.');
        return;
   }

    // Validate required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.date ||
      !formData.tickets
    ) {
      notifyError("Please fill all required fields.");
      return;
    }
    if (formData.tickets < 1 || formData.tickets > 5) {
      notifyError(
        "Minimum 1 and Maximum 5 tickets can be purchased from one number."
      );
      return;
    }

    setLoading(true);

    try {
      // Check if phone number exists
      const phoneCheckRes = await axios.get(
        `https://taaza-dandiya-backend.onrender.com/api/bookings/check-phone/${formData.phone}`
      );
      if (phoneCheckRes.status === 400) {
        notifyError("A booking with this phone number already exists.");
        setLoading(false);
        return;
      }

      // Check if booking limit is reached
      const limitCheckRes = await axios.get(
        `https://taaza-dandiya-backend.onrender.com/api/bookings/check-limit/${formData.date}/${formData.tickets}`
      );
      if (limitCheckRes.status === 400) {
        notifyError("Booking limit reached! No more available spots.");
        setLoading(false);
        return;
      }

      const totalAmount = formData.tickets * TICKET_PRICE;
      const finalAmount =
        discount > 0
          ? totalAmount - totalAmount * (discount / 100)
          : totalAmount;

      const bookingData = {
        ...formData,
        totalAmount: finalAmount,
      };
      const test_key = "rzp_live_Qm0FjnvHxpYDho";
      const options = {
        key: `${test_key}`,
        amount: `${finalAmount * 100}`,
        currency: "INR",
        name: "Taaza Dandiya 2024",
        description: "Ticket Booking Payment",
        image: "https://taazatv.com/image/logo.webp",
        handler: async (response) => {
          bookingData.razorpayPaymentId = response.razorpay_payment_id;
          try {
            const res = await axios.post(
              "https://taaza-dandiya-backend.onrender.com/api/bookings",
              bookingData
            );
            if (res.status === 201) {
              console.log(res);
              notifySuccessPerm(res);
              // console.log(`Confirmed! Booking ID ${res.data.razorpayPaymentId}. You are entitled to ${res.data.tickets} tickets dated ${res.data.date} for Taaza Dandiya @Netaji Indoor Stadium subject to clearance of payment. T&C apply. Goto the Ticket counter at venue to redeem`)
              setFormData(initialState);
              setDiscount(0); // Reset discount after booking
            } else {
              notifyErrorPerm(`Error: ${res.data.message}`);
            }
          } catch (error) {
            console.error("Error during booking:", error);
            notifyError("Failed to book, please try again.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#F00040",
        },
        modal: {
          ondismiss: () => {
            notifyError("Payment has been declined or canceled.");
            setLoading(false);
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      notifyError(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="inter booking-form flex flex-col gap-3 shadow-xl border-2 border-slate-300 bg-white p-6"
    >
      <div className="my-3">
        <div className="date-selection">
          <div
            className={`date-box ${
              selectedDate === "10-10-2024" ? "active" : ""
            }`}
            onClick={() => handleDateSelect("10-10-2024")}
          >
            <span className="month">OCT</span>
            <span className="date">10</span>
            <span className="day">Thu</span>
          </div>
          <div
            className={`date-box ${
              selectedDate === "11-10-2024" ? "active" : ""
            }`}
            onClick={() => handleDateSelect("11-10-2024")}
          >
            <span className="month">OCT</span>
            <span className="date">11</span>
            <span className="day">Fri</span>
          </div>
          <div
            className={`date-box ${
              selectedDate === "12-10-2024" ? "active" : ""
            }`}
            onClick={() => handleDateSelect("12-10-2024")}
          >
            <span className="month">OCT</span>
            <span className="date">12</span>
            <span className="day">Sat</span>
          </div>
        </div>
        <div className="selected">
          {" "}
          {selectedDate && (
            <p className="selected-date">Selected Date: {selectedDate}</p>
          )}{" "}
          {/* Display the selected date */}
        </div>
      </div>

     
      <div div className='flex gap-3'>
            <div className='flex-1'>
    <label>No. of Tickets <span style={{ color: 'red' }}>*</span></label>
    <select
        name="tickets"
        className="ticket-count"
        value={formData.tickets}
        onChange={handleChange}
        required
        style={{
            width: '100%',
            height:'60%',
            padding: '8px',
            border: '2px solid black',
            backgroundColor: '#FFFFFF',
            fontSize: '16px',
            cursor: 'pointer'
        }}
    >
        <option value="">Select</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
    </select>
</div>
      
        <div className="flex-1">
          <label>Coupon Code</label>
          <input
            type="text"
            name="discountCode"
            value={formData.discountCode}
            onChange={handleChange}
            disabled={
              formData.date && selectedDate && formData.tickets ? false : true
            }
            title={
              formData.date && selectedDate && formData.tickets
                ? "Enter Coupon Code"
                : "Please Enter Date and Number of tickets first"
            }
          />
        </div>
        <div className="flex align-items-center pt-4">
          <button
            type="button"
            onClick={verifyDiscountCode}
            className={`btnnn ${discount === 0 ? "" : "disabled"}`}
            disabled={discount === 0 ? false : true}
          >
            Verify
          </button>
        </div>
      </div>
      <div>
        <label>
          Name: <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>
          Mobile no.: <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="tel"
          name="phone"
          maxLength="10"
          value={formData.phone}
          onChange={handleChange}
          pattern="[0-9]*" // Allows only numeric input
          required
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Filters out non-numeric characters
          }}
        />
      </div>
      <div>
        <label>
          Email Id: <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          onInput={(e) => {
            e.target.value = e.target.value.toLowerCase(); // Converts all characters to lowercase
          }}
        />
        {emailError !== "" && (
          <p style={{ color: "red", fontSize: "12px" }}>{emailError}</p>
        )}{" "}
        {/* Error message */}
      </div>

      <div className="flex">
        <div className="content-center mx-2">
          <input type="checkbox" required />
        </div>
        <div className="my-container">
          <label>I agree to the terms and conditions listed below.</label>
        </div>
      </div>

      <div name="price" className="text-xl font-bold text-slate-800">
        Total Amount:{" "}
        {formData.tickets * TICKET_PRICE -
          (discount > 0
            ? formData.tickets * TICKET_PRICE * (discount / 100)
            : 0)}{" "}
        {discount ? `(${discount} % Discount Applied )` : ""}
      </div>
      <div>
        <label>Solve the captcha: {captchaNum1} + {captchaNum2} = ?</label>
        <input
          type="number"
          value={captchaAnswer}
          onChange={handleCaptchaChange}
          required
        />
        {!captchaCorrect && captchaAnswer && (
          <p style={{ color: 'red', fontSize: '12px' }}>Captcha is incorrect.</p>
        )}
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Proceed To Pay"}
      </button>

      {/* Terms and conditions */}
      <p className="font-light font-xs leading-3">
        1. You can book a minimum of 1 and a maximum of 5 tickets from one
        mobile number.
      </p>
      <p className="font-light font-xs leading-3">
        2. Online Tickets will have to be changed for physical tickets at the
        ticket counter at venue.
      </p>
      <p className="font-light font-xs leading-3">
        3. Only 1 booking allowed per phone number{" "}
      </p>
      <p className="font-light font-xs leading-3">
        4. Only successfully paid tickets will be accepted for entry.
      </p>
      <p className="font-light font-xs leading-3">
        5. Severe action will be taken against misconduct or mischievous
        behavior.
      </p>
      <p className="font-light font-xs leading-3">
        6. Smoking and consumption of alcohol is strictly prohibited inside the
        venue.
      </p>
      <p className="font-light font-xs leading-3">
        7. Entry ticket is required for children above 3 years of age.
      </p>
      <p className="font-light font-xs leading-3">
        8. Individuals under the influence of alcohol will not be allowed inside
        the venue.
      </p>
      <p className="font-light font-xs leading-3">
        9. Outside eatables and water are not allowed.
      </p>
      <p className="font-light font-xs leading-3">
        10. Scissors, knives, blades, or any other objectionable instruments are
        not allowed.
      </p>
      <p className="font-light font-xs leading-3">
        11. Every individual must undergo security checks and frisking before
        entering.
      </p>
      <p className="font-light font-xs leading-3">
        12. The program is subject to the Force Majeure clause.
      </p>
      <p className="font-light font-xs leading-3">
        13. The program is liable to change at the organizer's discretion.
      </p>
      <p className="font-light font-xs leading-3">
        14. Dandiya sticks and food are available for purchase until stocks
        last.
      </p>
      <p className="font-light font-xs leading-3">
        15. Re-entry is not allowed once you exit the venue.
      </p>
      <p className="font-light font-xs leading-3">
        16. Organisers hold the rights to deny late entry.
      </p>
    </form>
  );
};

export default BookingForm;
