import React, { useRef, useState } from "react";

const OtpPage2 = ({ number }) => {
  console.log("-----------------------------");
  const [otp, setOtp] = useState(Array(number).fill(""));
  const inputRefs = useRef([]);
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    console.log(index, otp);

    // move to the new input field
    console.log("index:", index);
    if (value && index < number - 1) {
      console.log("inside next move");

      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div>
      <h2>Enter OTP</h2>
      {otp.map((digit, index) => (
        <input
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          key={index}
        />
      ))}
    </div>
  );
};

export default OtpPage2;
