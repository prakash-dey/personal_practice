import { useRef, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Signup() {
    const [errorMsg, setErrorMsg] = useState("");

    const nameRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    async function signup() {
        try{
        const name = nameRef.current?.value;
        const email = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        if(!(name || email || password)){
            return setErrorMsg("All the fields are required");
        }

        const response = await axios.post(BACKEND_URL + "/api/v1/user/signup", {
            email,
            password,
            name
        })
        console.log(response)
        const data = response.data;
        if (data.success) {
            const token = response.data.token;
            localStorage.setItem("token", token);
            navigate("/dashboard");
          } else {
            setErrorMsg(data.error);
          }
        navigate("/dashboard")
    }catch (err: any) {
        if (err.response) {
          // Server responded with an error
          if (err.response.status === 400) {
            setErrorMsg(err.response.data.error);
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
    }

    return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white rounded-xl border min-w-48 p-8">
            <Input reference={nameRef} placeholder="Name" />
            <Input reference={usernameRef} placeholder="Username" />
            <Input reference={passwordRef} placeholder="Password" type="password"/>
            <div className="flex justify-center pt-4">
                <Button onClick={signup} loading={false} variant="primary" text="Signup" fullWidth={true} />
            </div>
            <div className="text-red-400">{errorMsg}</div>
        </div>
    </div>
}