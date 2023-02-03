import Head from "next/head";
import { useState } from "react";
import { ImDownload2 } from "react-icons/im";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [res, setRes] = useState(null);
  const [error, setError] = useState("");

  const request = () => {
    if (username == "" || password == "") return;
    fetch("/api/getCourses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) =>
        res
          .json()
          .then((result) => {
            if (!res.ok) throw result.response.error;
            setRes(result.response);
          })
          .catch((err) => {
            throw err;
          })
      )
      .catch((err) => setError(err));
  };

  const download = () => {
    if (res == null) return;
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(res, null, 2)], {
      type: "text/plain",
    });
    a.href = URL.createObjectURL(file);
    a.download = `${username}_marks.json`;
    a.click();
  };

  return (
    <>
      <Head>
        <title>TA Api</title>
        <meta name="description" content="API for retrieving TA data" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-screen min-h-screen flex flex-col items-center pt-32 px-10 md:px-32 lg:px-60 bg-[url('/background.png')] bg-cover bg-no-repeat bg-center">
        <header className="w-full flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white">
            TA-API
          </h1>
          <p className="text-base md:text-lg font-normal text-center text-white mt-5">
            An unofficial public API for retrieving data from official YRDSB
            teachassist accounts.
          </p>
          <p className="text-base md:text-lg font-normal text-center text-white mt-2">
            Used in the TeachAssist{" "}
            <a
              href="https://teachassistapp.github.io/"
              className="underline font-bold hover:drop-shadow-[0px_0px_10px_rgba(219,231,219,0.7)] duration-300 ease-in-out hover:tracking-wider"
              rel="noreferrer noopener"
            >
              mobile app
            </a>
            .
          </p>
          <div className="w-full flex flex-col landscape:flex-row items-center justify-evenly mt-7">
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              className="bg-green-transparent text-white focus:outline-none mb-4 landscape:w-1/3 px-6 py-3 placeholder-white-transparent rounded-full ring-2 ring-green-light shadow-[0px_0px_8px_3px_rgba(219,231,219,0.6)] duration-300 ease-in-out hover:shadow-[0px_0px_20px_3px_rgba(219,231,219,0.7)]"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="bg-green-transparent text-white focus:outline-none mb-4 landscape:w-1/3 px-6 py-3 placeholder-white-transparent rounded-full ring-2 ring-green-light shadow-[0px_0px_8px_3px_rgba(219,231,219,0.6)] duration-300 ease-in-out hover:shadow-[0px_0px_20px_3px_rgba(219,231,219,0.7)]"
            />
            <button
              onClick={request}
              className="bg-green-light landscape:w-1/4 text-green-dark mb-4 text-center font-bold px-6 py-3 rounded-full ring-2 ring-green-light shadow-[0px_0px_8px_3px_rgba(219,231,219,0.6)] hover:scale-105 duration-300 ease-in-out hover:shadow-[0px_0px_20px_3px_rgba(219,231,219,0.7)]"
            >
              Get Marks!
            </button>
          </div>
          {error && (
            <p className="text-lg md:text-xl font-bold text-center text-red-400/75 mt-2">
              {error}.
            </p>
          )}
        </header>
        {!error && res && (
          <section className="w-full flex flex-col items-center mt-10">
            <h2 className="text-3xl font-bold text-white">Response</h2>
            <div className="w-full p-2 mt-5 ring-2 ring-green-light bg-green-transparent shadow-[0px_0px_8px_3px_rgba(219,231,219,0.6)] rounded-3xl">
              <div className="w-full max-h-60 overflow-y-scroll overflow-x-hidden px-5 py-3">
                <pre className="text-white text-sm font-normal w-full">
                  {JSON.stringify(res, null, 2)}
                </pre>
              </div>
            </div>
            <button
              onClick={download}
              className="bg-green-light text-green-dark text-center font-bold mt-5 px-6 py-3 rounded-full ring-2 ring-green-light shadow-[0px_0px_8px_3px_rgba(219,231,219,0.6)] hover:scale-105 duration-300 ease-in-out hover:shadow-[0px_0px_20px_3px_rgba(219,231,219,0.7)]"
            >
              Download JSON
              <ImDownload2 className="inline-block ml-2" />
            </button>
          </section>
        )}
        <section className="w-full flex flex-col items-center mt-20">
          <h2 className="text-3xl font-bold text-white">About</h2>
          <p className="text-sm md:text-base text-center font-normal text-white mt-5">
            This API is safe and secure, unlike other APIs which may store your
            results in their own database. Your credentials are sent directly to
            teachassist, and the results are directly returned and parsed into
            JSON format, allowing for both readability and use.
          </p>
          <a
            href="https://github.com/ryan-zhu-music/ta-api"
            className="bg-green-light text-green-dark text-center font-bold mt-5 px-6 py-3 rounded-full ring-2 ring-green-light shadow-[0px_0px_8px_3px_rgba(219,231,219,0.6)] hover:scale-105 duration-300 ease-in-out hover:shadow-[0px_0px_20px_3px_rgba(219,231,219,0.7)]"
            rel="noreferrer noopener"
            target="_blank"
          >
            View source code (GitHub)
          </a>
        </section>
        <section className="w-full flex flex-col items-center mt-20">
          <h2 className="text-3xl font-bold text-white">Usage</h2>
          <h3 className="text-xl font-bold text-white mt-5">Website</h3>
          <p className="text-sm md:text-base text-center font-normal text-white mt-2">
            Enter your YRDSB username and password above, and hit &quot;Get
            Marks!&quot; When the data is returned, it will be displayed above,
            along with the Download JSON button.
          </p>
          <h3 className="text-xl font-bold text-white mt-7">Endpoint</h3>
          <p className="text-sm md:text-base text-center font-normal text-white mt-2">
            Make a POST request to <code>/api/getCourses</code>, with a JSON
            body of two string parameters, <code>username</code> and{" "}
            <code>password</code>. Node fetch example provided below:
          </p>
          <div className="w-full px-3 py-2 mt-7 ring-2 ring-green-light shadow-[0px_0px_8px_3px_rgba(219,231,219,0.6)] bg-green-transparent rounded-3xl">
            <div className="w-full max-h-64 overflow-y-scroll overflow-x-scroll px-5 py-3">
              <pre className="text-white text-sm font-normal w-full">
                {`const fetch = require('node-fetch');

fetch('https://ta-api.vercel.app/api/getCourses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ username: 'username', password: 'password' }),
})
  .then((res) => res.json())
  .then((json) => console.log(json));`}
              </pre>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mt-10">Response</h3>
          <p className="text-sm md:text-base text-center font-normal text-white mt-2">
            The response will be a JSON array of objects, one for each course.
          </p>
          <table className="w-full mt-7">
            <thead className="text-sm md:text-base">
              <tr>
                <th className="pb-2 text-center text-white">Property</th>
                <th className="pb-2 text-center text-white">Type</th>
                <th className="pb-2 text-center text-white">Description</th>
                <th className="pb-2 text-center text-white">Example</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              <tr className="border-b-8 border-transparent">
                <td className="px-2 text-center">
                  <code>code</code>
                </td>
                <td className="px-2 text-center text-emerald-200/80">
                  <code>string</code>
                </td>
                <td className="px-2 text-center text-white">Course code</td>
                <td className="px-2 text-center">
                  <code>&quot;ICS4U1-03&quot;</code>
                </td>
              </tr>
              <tr className="border-b-8 border-transparent">
                <td className="px-2 text-center">
                  <code>name</code>
                </td>
                <td className="px-2 text-center text-emerald-200/80">
                  <code>string</code>
                </td>
                <td className="px-2 text-center text-white">Course name</td>
                <td className="px-2 text-center">
                  <code>&quot;Computer Science&quot;</code>
                </td>
              </tr>
              <tr className="border-b-8 border-transparent">
                <td className="px-2 text-center">
                  <code>block</code>
                </td>
                <td className="px-2 text-center text-emerald-200/80">
                  <code>string</code>
                </td>
                <td className="px-2 text-center text-white">Block/period</td>
                <td className="px-2 text-center">
                  <code>&quot;2&quot;</code>
                </td>
              </tr>
              <tr className="border-b-8 border-transparent">
                <td className="px-2 text-center">
                  <code>room</code>
                </td>
                <td className="px-2 text-center text-emerald-200/80">
                  <code>string</code>
                </td>
                <td className="px-2 text-center text-white">Room number</td>
                <td className="px-2 text-center">
                  <code>&quot;208&quot;</code>
                </td>
              </tr>
              <tr className="border-b-8 border-transparent">
                <td className="px-2 text-center">
                  <code>start_time</code>
                </td>
                <td className="px-2 text-center text-emerald-200/80">
                  <code>string</code>
                </td>
                <td className="px-2 text-center text-white">
                  Start date (yyyy-mm-dd)
                </td>
                <td className="px-2 text-center">
                  <code>&quot;2023-02-06&quot;</code>
                </td>
              </tr>
              <tr className="border-b-8 border-transparent">
                <td className="px-2 text-center">
                  <code>end_time</code>
                </td>
                <td className="px-2 text-center text-emerald-200/80">
                  <code>string</code>
                </td>
                <td className="px-2 text-center text-white">
                  End date (yyyy-mm-dd)
                </td>
                <td className="px-2 text-center">
                  <code>&quot;2023-07-01&quot;</code>
                </td>
              </tr>
              <tr className="border-b-8 border-transparent">
                <td className="px-2 text-center">
                  <code>overall_mark</code>
                </td>
                <td className="px-2 text-center text-emerald-200/80">
                  <code>number | string</code>
                </td>
                <td className="px-2 text-center text-white">Overall mark</td>
                <td className="px-2 text-center">
                  <code>99.4 | &quot;N/A&quot;</code>
                </td>
              </tr>
              <tr className="border-b-8 border-transparent">
                <td className="px-2 text-center">
                  <code>isFinal</code>
                </td>
                <td className="px-2 text-center text-emerald-200/80">
                  <code>boolean</code>
                </td>
                <td className="px-2 text-center text-white">
                  If the mark is a final mark
                </td>
                <td className="px-2 text-center">
                  <code>true</code>
                </td>
              </tr>
              <tr className="border-b-8 border-transparent">
                <td className="px-2 text-center">
                  <code>isMidterm</code>
                </td>
                <td className="px-2 text-center text-emerald-200/80">
                  <code>boolean</code>
                </td>
                <td className="px-2 text-center text-white">
                  If the mark is a midterm mark
                </td>
                <td className="px-2 text-center">
                  <code>false</code>
                </td>
              </tr>
              <tr className="border-b-8 border-transparent">
                <td className="px-2 text-center">
                  <code>assignments</code>
                </td>
                <td className="px-2 text-center text-emerald-200/80">
                  <code>Array</code>
                </td>
                <td className="px-2 text-center text-white">
                  Array of assignment objects
                </td>
                <td className="px-2 text-center">
                  <code>[]</code>
                </td>
              </tr>
              <tr className="border-b-8 border-transparent">
                <td className="px-2 text-center">
                  <code>weight_table</code>
                </td>
                <td className="px-2 text-center text-emerald-200/80">
                  <code>Object</code>
                </td>
                <td className="px-2 text-center text-white">
                  Course weightings for each category
                </td>
                <td className="px-2 text-center">
                  <code>{"{}"}</code>
                </td>
              </tr>
            </tbody>
          </table>
          <h4 className="text-md text-center font-bold text-white mt-5">
            Abbreviations
          </h4>
          <ul className="list-disc list-inside text-white text-xs mt-2 leading-5">
            <li>
              <code>KU</code> - Knowledge/Understanding
            </li>
            <li>
              <code>T</code> - Thinking
            </li>
            <li>
              <code>C</code> - Communication
            </li>
            <li>
              <code>A</code> - Application
            </li>
            <li>
              <code>F</code> - Final
            </li>
            <li>
              <code>O</code> - Other
            </li>
            <li>
              <code>W</code> - Term weighting (e.g. /70%)
            </li>
            <li>
              <code>CW</code> - Course weighting (e.g. /100%)
            </li>
            <li>
              <code>SA</code> - Student achievement (e.g. 95.8%)
            </li>
          </ul>
        </section>
        <footer className="flex flex-col items-center justify-center w-full h-24 mt-14 border-t border-emerald-200/20">
          <p className="text-xs text-white">
            Made with{" "}
            <span role="img" aria-label="love">
              ❤️
            </span>{" "}
            by{" "}
            <a
              href="https://www.ryanzhu.com"
              target="_blank"
              rel="noreferrer noopener"
              className="text-emerald-200/80 hover:text-emerald-200/100"
            >
              Ryan Zhu
            </a>
          </p>
        </footer>
      </main>
    </>
  );
}
