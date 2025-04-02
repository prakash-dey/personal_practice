import { useRef, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signin() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const signin = async () => {
    try {
      const email = usernameRef.current?.value;
      const password = passwordRef.current?.value;

      if (!email || !password) {
        setErrorMsg("Email and password are required.");
        return;
      }

      const payload = {
        email,
        password,
      };
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/signin`,
        payload
      );
      console.log("response", response);
      const data = response.data;
      if (data.success) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        navigate("/dashboard");
      } else {
        setErrorMsg(data.error);
      }
    } catch (err: any) {
      if (err.response) {
        // Server responded with an error
        if (err.response.status === 400) {
          setErrorMsg(err.response.data.error || "Invalid credentials.");
        } else {
          setErrorMsg(
            `Error ${err.response.status}: ${
              err.response.data.error || "Something went wrong."
            }`
          );
        }
      } else if (err.request) {
        // No response from the server
        setErrorMsg("No response from server. Please try again later.");
      } else {
        // Other errors (e.g., network issues)
        setErrorMsg("An unexpected error occurred.");
      }
    }
  };
  return (
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white rounded-xl border min-w-48 p-8">
        <Input reference={usernameRef} placeholder="Username" />
        <Input reference={passwordRef} placeholder="Password" type="password" />
        <div className="flex justify-center pt-4">
          <Button
            onClick={signin}
            loading={false}
            variant="primary"
            text="Signin"
            fullWidth={true}
          />
        </div>
        <div className="text-red-400">{errorMsg}</div>
      </div>
    </div>
  );
}
