import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [text, setText] = useState("");
  const [words, setWords] = useState('');

  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text, words: words }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setText("");
      setWords('')
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3>Summarise this text</h3>
        <form onSubmit={onSubmit}>
          <textarea
            type="text"
            name="text"
            rows={10}
            placeholder="Enter a text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input 
            type="number" 
            placeholder="Number of words"
            min={0}
            required
            onChange={(e)=> setWords(e.target.value)}
          />
          <input type="submit" value="Generate summarised text" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
