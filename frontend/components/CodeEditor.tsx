"use client";

import Editor from "@monaco-editor/react";

interface Props {
  value: string;
  onChange: (value: string | undefined) => void;
  language: "python" | "json";
  height?: string;
}

export const CodeEditor = ({ value, onChange, language, height = "300px" }: Props) => {
  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden bg-[#1e1e1e]">
      <Editor
        height={height}
        language={language}
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
};