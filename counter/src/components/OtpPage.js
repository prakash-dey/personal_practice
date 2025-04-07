import React, { useState, useRef } from "react";

const OtpPage = () => {

    console.log("**********************")
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const inputRefs = useRef([]);

  // Handle input change
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if a digit is entered
    if (value && index < 5) {
        console.log("inside if");
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace and move to the previous input
  const handleKeyDown = (index, e) => {
    console.log(otp[index],index);
    if (e.key === "Backspace" && !otp[index] && index > 0) {
        console.log("inside backspace");
      inputRefs.current[index - 1].focus();
    }
  };

  // Verify OTP
  const handleVerify = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp === "123456") {
      setMessage("✅ OTP Verified Successfully!");
    } else {
      setMessage("❌ Invalid OTP. Try Again!");
    }
  };

  // Resend OTP
  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setMessage("🔄 OTP Resent! Check your messages.");
    inputRefs.current[0].focus(); // Focus back to the first input
  };

  return (
    <div style={styles.container}>
      <h2>Enter OTP</h2>
      <div style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            style={styles.input}
          />
        ))}
      </div>
      <button onClick={handleVerify} style={styles.button}>
        Verify OTP
      </button>
      <button onClick={handleResend} style={styles.resendButton}>
        Resend OTP
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

const styles = {
  container: { textAlign: "center", marginTop: "50px" },
  otpContainer: { display: "flex", justifyContent: "center", gap: "10px" },
  input: {
    width: "40px",
    height: "40px",
    fontSize: "20px",
    textAlign: "center",
    border: "2px solid #007bff",
    borderRadius: "5px",
    outline: "none",
  },
  button: {
    display: "block",
    width: "100px",
    margin: "10px auto",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  resendButton: {
    backgroundColor: "transparent",
    color: "#007bff",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default OtpPage;
