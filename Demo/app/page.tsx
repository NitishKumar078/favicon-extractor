"use client";
import { useState } from "react";
import Image from "next/image";

interface BatchResult {
  url: string;
  favicon: string | null;
  success: boolean;
  error?: string;
}
export default function Home() {
  const [inputText, setInputText] = useState("");
  const [displayText, setDisplayText] = useState<BatchResult[]>([]);
  // const

  const handleSubmit = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    if (inputText.trim()) {
      const urls = inputText
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean);
      const responce = await fetch("/api", {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(urls),
      });
      console.log(responce);

      const data: BatchResult[] = await responce.json();
      setDisplayText(data);

      setInputText("");
    }
  };

  function extractHostnameKeyword(url: string) {
    try {
      const hostname = new URL(url).hostname; // e.g., www.linkedin.com
      const parts = hostname.replace(/^www\./, "").split(".");
      return parts[0]; // returns 'linkedin' from 'www.linkedin.com'
    } catch (e) {
      return null; // invalid URL
    }
  }
  function customImageLoader({ src }: { src: string }) {
    return src; // just return the URL directly
  }
  return (
    <div className="w-full h-screen mx-auto p-6 bg-white">
      <div className="space-y-6">
        {/* Input Section */}
        <div className="flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter URL's here..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black placeholder:text-gray-700 placeholder:font-medium"
            onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
          />
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
          >
            Submit
          </button>
        </div>

        {/* Note */}
        <div className="w-full h-full p-2 border border-gray-200 rounded-lg bg-gray-50 overflow-auto">
          <p className="text-red-500 ">
            <span className="text-bold">Note</span> : <br></br> &bull; This
            library only ment to be used in the Backend <br></br> &bull; If you
            want to featch more then one URL type separated with comma(,)
          </p>
        </div>

        {/* Display Section */}
        <div className="flex gap-2">
          {" "}
          <div className="w-1/2 h-[75vh] p-4 border border-gray-200 rounded-lg bg-gray-50 overflow-auto">
            <h1 className="text-gray-700 text-center ">Console</h1>
            <div className="text-gray-700 text-m leading-relaxed">
              <pre>
                {displayText.length > 0
                  ? JSON.stringify(displayText, null, 2)
                  : "No Output"}
              </pre>{" "}
            </div>
          </div>
          <div className="w-1/2 h-[75vh] p-4 border border-gray-200 rounded-lg bg-gray-50 overflow-auto">
            <h1 className="text-gray-700 text-center ">FAVICONS</h1>
            <div id="icons" className=" flex gap-3">
              {displayText.length > 0 ? (
                displayText.map((element, idx) => (
                  <div
                    key={element.url + idx}
                    className="flex flex-col items-center"
                  >
                    {element.favicon ? (
                      <Image
                        loader={customImageLoader}
                        width={20}
                        height={20}
                        src={element.favicon}
                        alt={`Favicon for ${element.url}`}
                        className="w-20 h-20 mt-2 object-contain mb-1"
                      />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded mb-1 text-xs text-gray-500">
                        N/A
                      </div>
                    )}
                    <span className="text-xs text-gray-600 break-all max-w-[80px] text-center">
                      {extractHostnameKeyword(element.url)}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-gray-400">No favicons to display</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
