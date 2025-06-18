/* eslint-disable @typescript-eslint/no-explicit-any */

export async function chat(
  agentId: string,
  message: string,
  streamingMessage: string,
  setStreamingMessage: any,
  setMessages: any,
  setStreaming: any
) {
  try {
    const streamMessage = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentId,
        message,
      }),
    });
    console.log({ streamMessage });
    if (streamMessage?.status !== 200) {
      throw new Error("Service Failure");
    }
    if (streamMessage.ok) {
      setStreaming(true);
      setStreamingMessage("");

      const reader = streamMessage.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;
      while (!done) {
        const { done: isDone, value } = await (reader?.read() as Promise<
          ReadableStreamReadResult<Uint8Array>
        >);

        done = isDone;

        if (done) {
          setStreamingMessage("");
          setStreaming(false);
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.trim()) continue;
          if (line.startsWith("data:")) {
            const dataString = line.substring(5).trim();
            console.log({ dataString });
            if (!dataString) continue;
            try {
              const jsonData = JSON.parse(dataString);

              if (jsonData.status === "error") {
                throw jsonData;
              }
              if (jsonData.status === "streaming") {
                if (jsonData.response.length > 0) {
                  setStreamingMessage((prev:any) => prev + jsonData.response);
                }
              } else if (jsonData.status === "Agent Called") {
                setMessages((prev:any) => [
                  ...prev,
                  { agentCall: `Agent Got Called: ${jsonData.response}` },
                ]);
              } else if (jsonData.status === "Parallel Yield") {
                setMessages((prev:any) => [
                  ...prev,
                  {
                    agentCall: `Parallel Agent Result: ${jsonData.response}`,
                    parallel: true,
                  },
                ]);
              } else if (jsonData.status === "Tool Called") {
                setMessages((prev:any) => [
                  ...prev,
                  { agentCall: `Got Tool Called: ${jsonData.response}` },
                ]);
              } else if (jsonData.status === "End of stream") {
                // setStreamingMessage(
                //   (prev) => prev + jsonData.response + "\\n\\n"
                // );
                setMessages((prev:any) => [...prev, { text: jsonData.response }]);
              }
            } catch (error: any) {
              if (error.status === "error") {
                throw error;
              } else {
                console.error("Invalid JSON in data:", dataString, error);
                continue;
              }
            }
          }
        }
      }
    } else if (!streamMessage.ok) {
      const jsonData = await streamMessage.json();
      console.log("streamMessage not ok", jsonData);
    }
  } catch (error: any) {
    console.log("Error", error);
  }
}
