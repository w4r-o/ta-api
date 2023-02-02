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
      <main className="w-screen min-h-screen flex flex-col items-center pt-32 px-10 md:px-32 lg:px-60 bg-[url('/background.png')] bg-cover bg-no-repeat bg-center">
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
            <h2 className="text-2xl font-bold text-white">Response</h2>
            <div className="w-full p-2 mt-5 ring-2 ring-green-light shadow-[0px_0px_8px_3px_rgba(219,231,219,0.6)] rounded-3xl">
              <div className="w-full max-h-60 overflow-y-scroll overflow-x-hidden p-8">
                <pre className="text-white text-sm font-normal w-full">
                  {JSON.stringify(res, null, 2)}
                </pre>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
