import { Link } from "@/components/typography/link";
import { useState } from "react";
import { PlusIcon, Recycle } from "lucide-react";

function App() {
  const [facts, setFacts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const CONVEX_HTTP_URL = import.meta.env.VITE_CONVEX_HTTP_URL; //ends with .site not .cloud

  const clearErrors = () => {
    setError(null);
  };

  const handleClickGetRandomFact = async () => {
    try {
      const response = await fetch(`${CONVEX_HTTP_URL}/randomFact`);
      if (!response.ok) {
        const data = await response.json();
        setError(data.error);
      } else {
        clearErrors();
        const data = await response.json();
        setFacts([...facts, data[0].fact]);
      }
    } catch (e: Error) {
      setError(e.message);
    }
  };

  return (
    <main className="container max-w-2xl flex flex-col gap-2">
      <h1 className="text-4xl font-extrabold mt-8 text-center">
        Convex ❤️ CORS
      </h1>
      <h2 className="opacity-40 font-light mb-0 p-0 text-center uppercase tracking-[5px] text-md">
        Transcending boundaries
      </h2>
      <h2 className="opacity-40 font-light mb-8 mt-[-14px] text-center uppercase tracking-[5px] text-md">
        Since 2020
      </h2>
      <div className="hidden">
        <p>
          Cross-origin resource sharing (aka CORS), is a mechanism by which an
          HTTP server can allow or reject incoming requests from servers on
          different domains. It's enforced by the browser, not the server.
        </p>
        <p>
          For example, if you host example.com but you don't want badactor.com
          to be able to fetch your data, you can use CORS to block them.
        </p>
        <p>
          CORS is enabled by default, which means if we want to allow
          goodactor.com to be able to fetch our data, we need to add a CORS
          policy that explicitly allows goodactor.com to fetch our data.
        </p>
        <p>
          CORS is a good thing. However, it often trips up developers and can
          feel confusing to resolve.
        </p>
        <p>
          The concept however is simple: as the owner of an HTTP server, you can
          enable CORS by adding a few headers to your responses.
        </p>
        <p>
          For any origins (other servers) you want to allow, add the following
          header to your response:
        </p>
        <pre>Access-Control-Allow-Origin: http://goodactor.com</pre>
        <p>
          A note on preflight requests! Browsers will often send a preflight
          requests using the OPTIONS method. In order for the browser to
          continue with the full request, the OPTIONS response must include the
          allowed METHODS for that endpoint as well as the CORS header:
        </p>
        <pre>
          Access-Control-Allow-Methods: GET, POST, PUT, DELETE
          Access-Control-Allow-Origin: http://goodactor.com
        </pre>
        <p>
          Now, when the app at goodactor.com makes a request to
          https://example.com/api/randomFact, the browser will first request the
          OPTIONS response, which says that GET is allowed from this domain, and
          then the browser will carry on with the actual request, which also
          allows goodactor.com to make that request.
        </p>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg px-6 py-4 ring-1 ring-slate-900/5 shadow-xl">
        <div className="flex flex-row justify-between items-baseline mb-4">
          <h3 className="text-slate-900 dark:text-white mt-5 text-xl font-medium tracking-tight">
            Facts
          </h3>
          <div className="flex flex-row gap-4">
            <button
              type="button"
              className="flex items-center justify-center px-4 py-1 text-center text-white bg-slate-700 shadow-sm rounded-lg focus:outline-none hover:bg-slate-900"
              onClick={() => {
                void handleClickGetRandomFact();
              }}
            >
              <PlusIcon className="mr-2 w-6 h-6" />
              <span className="self-center text-sm font-medium">New fact</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center px-4 py-1 text-center text-white bg-slate-700 shadow-sm rounded-lg focus:outline-none hover:bg-slate-900"
              onClick={() => {
                setFacts([]);
                clearErrors();
              }}
            >
              <Recycle className="mr-2 w-6 h-6" />
              <span className="self-center text-sm font-medium">Reset</span>
            </button>
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="text-sm text-slate-500 mt-12">
          <ol>
            <li>
              1. Open developer tools:{" "}
              <pre className="inline-block text-slate-400">Option + ⌘ + I</pre>
            </li>
            <li>
              2. Go to the "Network" tab:{" "}
              <pre className="inline-block text-slate-400">
                Ctrl + Shift + P
              </pre>{" "}
              type <pre className="inline-block text-slate-400">network</pre>{" "}
              then{" "}
              <pre className="inline-block text-slate-400">&lt;Enter&gt;</pre>
            </li>
            <li>3. Click "New Fact" to see some CORS in action.</li>
          </ol>
        </div>

        <ul className="space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400 py-4">
          {facts.map((fact, index) => {
            console.log(fact);
            return <li key={index}>{fact}</li>;
          })}
        </ul>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg px-6 py-4 ring-1 ring-slate-900/5 shadow-xl">
        <div className="flex flex-row justify-between items-baseline mb-4">
          <h3 className="text-slate-900 dark:text-white mt-5 text-xl font-medium tracking-tight">
            Edit this app
          </h3>
          <button
            type="button"
            className="flex items-center justify-center px-4 py-1 text-center text-white bg-emerald-600 border border-emerald-700 rounded-lg focus:outline-none hover:bg-emerald-700"
            onClick={() => {
              window.open(
                "https://github.com/convexdev/cors-example",
                "_blank"
              );
            }}
          >
            <img
              height="16"
              width="16"
              src="https://cdn.simpleicons.org/github/white"
              className="mr-2"
            />
            <span className="self-center text-sm font-medium">
              Clone on Github
            </span>
          </button>
        </div>

        <ul className="space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400 py-4">
          <li>
            Edit{" "}
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              convex/myFunctions.ts
            </code>{" "}
            to change your backend
          </li>
          <li>
            Edit{" "}
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              convex/http.ts
            </code>{" "}
            to change your HTTP routes & functions
          </li>
          <li>
            Edit{" "}
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              src/App.tsx
            </code>{" "}
            to change your frontend
          </li>
        </ul>
      </div>
      <footer className="mt-4 opacity-50 text-sm">
        <p>
          Got something you want to build? Dive in to the{" "}
          <Link target="_blank" href="https://docs.convex.dev/home">
            Convex docs
          </Link>
        </p>
        <p className="">
          The Convex team is always available in{" "}
          <Link
            target="_blank"
            href="https://convex.dev/community?utm=convex_cors"
          >
            our community on Discord
          </Link>
        </p>
      </footer>
    </main>
  );
}

export default App;
