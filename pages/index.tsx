import Head from "next/head";
import { useState } from "react";

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
          .then((result) => setRes(result.response))
          .catch((err) => {
            throw err;
          })
      )
      .catch((err) => setError(err));
  };

  return (
    <>
      <Head>
        <title>TA Api</title>
        <meta name="description" content="API for retrieving TA data" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-screen min-h-screen flex flex-col items-center py-32 px-10 md:px-32 lg:px-60 bg-[url('/background.png')] bg-cover bg-no-repeat bg-center">
        <header className="w-full flex flex-col items-center">
          <h1 className="text-7xl font-black text-white">TA-API</h1>
          <p className="text-lg font-normal text-white mt-5">
            An unofficial public API for retrieving data from official YRDSB
            teachassist accounts.
          </p>
          <p className="text-lg font-normal text-white mt-2">
            Used in the TeachAssist{" "}
            <a
              href="https://teachassistapp.github.io/"
              className="underline font-bold"
              rel="noreferrer noopener"
            >
              mobile app
            </a>
            .
          </p>
          <div className="w-full flex flex-row items-center justify-evenly mt-7">
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              className="bg-green-transparent text-white focus:outline-none w-1/3 px-6 py-3 placeholder-white-transparent rounded-full ring-2 ring-green-light shadow-[0px_0px_8px_3px_rgba(219,231,219,0.6)]"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="bg-green-transparent text-white focus:outline-none w-1/3 px-6 py-3 placeholder-white-transparent rounded-full ring-2 ring-green-light shadow-[0px_0px_8px_3px_rgba(219,231,219,0.6)]"
            />
            <button
              onClick={request}
              className="bg-green-light w-1/4 text-green-dark text-center font-bold px-6 py-3 rounded-full ring-2 ring-green-light shadow-[0px_0px_8px_3px_rgba(219,231,219,0.6)]"
            >
              Get Marks!
            </button>
          </div>
        </header>
        {res && (
          <section className="w-full flex flex-col items-center mt-10">
            <h2 className="text-3xl font-bold text-white">Response</h2>
            <div className="w-full p-2 mt-5 ring-2 ring-green-light bg-green-transparent shadow-[0px_0px_8px_3px_rgba(219,231,219,0.6)] rounded-3xl">
              <div className="w-full max-h-60 overflow-y-scroll overflow-x-hidden px-5 py-3">
                <pre className="text-white text-sm font-normal w-full">
                  {JSON.stringify(res, null, 2)}
                </pre>
              </div>
            </div>
          </section>
        )}
        <section className="w-full flex flex-col items-center mt-20">
          <h2 className="text-3xl font-bold text-white">About</h2>
          <p className="text-base text-center font-normal text-white mt-5">
            This API is safe and secure, unlike other APIs which may store your
            results in their own database. Your credentials are sent directly to
            teachassist, and the results are directly returned and parsed into
            JSON format, allowing for both readability and manipulation.
          </p>
          <a
            href="https://github.com/ryan-zhu-music/ta-api"
            className="bg-green-light text-green-dark text-center font-bold mt-5 px-6 py-3 rounded-full ring-2 ring-green-light shadow-[0px_0px_8px_3px_rgba(219,231,219,0.6)]"
            rel="noreferrer noopener"
          >
            View source code (GitHub)
          </a>
        </section>
        <section className="w-full flex flex-col items-center mt-20">
          <h2 className="text-3xl font-bold text-white">Usage</h2>
          <h3 className="text-xl font-bold text-white mt-5">Website</h3>
          <p className="text-base text-center font-normal text-white mt-5">
            Enter your YRDSB username and password above, and hit Get marks!
            When the data is returned, it will be displayed below, along with
            the Download as JSON button.
          </p>
          <h3 className="text-xl font-bold text-white mt-5">Request</h3>
          <p className="text-base text-center font-normal text-white mt-5">
            Make a POST request to{" "}
            <code className="text-green-light drop-shadow-[0px_0px_8px_rgba(219,231,219,0.6)]">
              /api/getCourses
            </code>
            , with a JSON body of two string parameters,{" "}
            <code className="text-green-light drop-shadow-[0px_0px_8px_rgba(219,231,219,0.6)]">
              username
            </code>{" "}
            and{" "}
            <code className="text-green-light drop-shadow-[0px_0px_8px_rgba(219,231,219,0.6)]">
              password
            </code>
            . Node fetch example provided below:
          </p>
          <div className="w-full p-2 mt-5 ring-2 ring-green-light shadow-[0px_0px_8px_3px_rgba(219,231,219,0.6)] bg-green-transparent rounded-3xl">
            <div className="w-full max-h-60 overflow-y-scroll overflow-x-hidden px-5 py-3">
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
        </section>
      </main>
    </>
  );
}
